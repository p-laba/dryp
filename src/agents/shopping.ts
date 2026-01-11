import { BaseAgent, AgentResult } from './base';
import { StyleRecommendation } from './style';
import { VibeAnalysis } from './vibe';
import { getDb } from '@/lib/mongodb';
import { ObjectId, WithId, Document } from 'mongodb';

export interface ProductRecommendation {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  buy_link: string;
  match_reason: string;
  match_score?: number;
  gender_match?: boolean;
  color_match?: boolean;
  season_appropriate?: boolean;
}

export interface ShoppingResult {
  free_recommendations: ProductRecommendation[];
  premium_recommendations: ProductRecommendation[];
  outfit_suggestions?: OutfitSuggestion[];
}

export interface OutfitSuggestion {
  name: string;
  occasion: string;
  products: string[]; // product IDs
  styling_tip: string;
}

export class ShoppingAgent extends BaseAgent<
  { style: StyleRecommendation; vibe: VibeAnalysis },
  ShoppingResult
> {
  constructor() {
    super('ShoppingAgent', 'Finds gender-appropriate, season-aware products matching style profile');
  }

  async run(input: {
    style: StyleRecommendation;
    vibe: VibeAnalysis;
  }): Promise<AgentResult<ShoppingResult>> {
    this.log('Finding perfect products with enhanced matching...');

    const { style, vibe } = input;
    const db = await getDb();

    // Build strict gender filter - prioritize gender-specific products
    const detectedGender = vibe.gender || 'unknown';
    const genderFilter: string[] = ['unisex'];

    if (detectedGender === 'male') {
      genderFilter.push('male');
    } else if (detectedGender === 'female') {
      genderFilter.push('female');
    } else {
      // Unknown gender - include all
      genderFilter.push('male', 'female');
    }

    // Build archetype query with defensive checks
    const primaryArchetype = style?.primary_archetype || 'minimalist';
    const secondaryArchetype = style?.secondary_archetype || 'streetwear';

    const archetypeQuery = [
      primaryArchetype.toLowerCase().replace(/ /g, '-'),
      secondaryArchetype.toLowerCase().replace(/ /g, '-'),
    ];

    this.log(`Searching for: ${archetypeQuery.join(', ')} | Gender: ${detectedGender} (${genderFilter.join(', ')})`);

    // STEP 1: Find gender-specific products matching archetypes FIRST
    let products: WithId<Document>[] = [];

    if (detectedGender !== 'unknown') {
      // First priority: gender-specific products matching archetypes
      const genderSpecificProducts = await db.collection('products')
        .find({
          style_archetypes: { $in: archetypeQuery },
          gender: detectedGender, // Exact gender match first
        })
        .limit(10)
        .toArray();

      products = [...genderSpecificProducts];
      this.log(`Found ${genderSpecificProducts.length} gender-specific products matching archetypes`);
    }

    // STEP 2: Add unisex products matching archetypes
    const unisexProducts = await db.collection('products')
      .find({
        style_archetypes: { $in: archetypeQuery },
        gender: 'unisex',
      })
      .limit(8)
      .toArray();

    products = [...products, ...unisexProducts];
    this.log(`Added ${unisexProducts.length} unisex products`);

    // STEP 3: If still not enough, get more gender-specific products (any archetype)
    if (products.length < 6 && detectedGender !== 'unknown') {
      this.log('Expanding search for more gender-specific products...');
      const existingIds = products.map(p => p._id);

      const moreGenderProducts = await db.collection('products')
        .find({
          gender: { $in: [detectedGender, 'unisex'] },
          _id: { $nin: existingIds },
        })
        .limit(10 - products.length)
        .toArray();

      products = [...products, ...moreGenderProducts];
      this.log(`Added ${moreGenderProducts.length} more gender-appropriate products`);
    }

    // STEP 4: Last resort - add any matching products but penalize wrong gender
    if (products.length < 6) {
      this.log('Final expansion - adding remaining products...');
      const existingIds = products.map(p => p._id);

      const remainingProducts = await db.collection('products')
        .find({
          _id: { $nin: existingIds },
        })
        .limit(10 - products.length)
        .toArray();

      products = [...products, ...remainingProducts];
    }

    // Deduplicate
    const seen = new Set<string>();
    products = products.filter(p => {
      const id = p._id.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    // Score and enhance products
    const scoredProducts = await Promise.all(
      products.map(async (product) => {
        const score = this.calculateMatchScore(product, vibe, style);
        const reason = await this.generateMatchReason(product, vibe, style);

        return {
          _id: product._id?.toString() || '',
          name: (product.name as string) || 'Unknown Product',
          brand: (product.brand as string) || 'Unknown Brand',
          category: (product.category as string) || 'other',
          price: (product.price as number) || 0,
          description: (product.description as string) || '',
          image_url: (product.image_url as string) || '',
          buy_link: (product.buy_link as string) || '',
          match_reason: reason,
          match_score: score.total,
          gender_match: score.genderMatch,
          color_match: score.colorMatch,
          season_appropriate: score.seasonAppropriate,
        };
      })
    );

    // Sort by match score
    scoredProducts.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    // Split into free (3) and premium (rest)
    const freeRecs = scoredProducts.slice(0, 3);
    const premiumRecs = scoredProducts.slice(3);

    // Generate outfit suggestions
    const outfits = await this.generateOutfitSuggestions(scoredProducts, vibe, style);

    this.log(`Found ${freeRecs.length} free + ${premiumRecs.length} premium recommendations`);

    return {
      success: true,
      data: {
        free_recommendations: freeRecs,
        premium_recommendations: premiumRecs,
        outfit_suggestions: outfits,
      },
    };
  }

  private calculateMatchScore(
    product: Record<string, unknown>,
    vibe: VibeAnalysis,
    style: StyleRecommendation
  ): { total: number; genderMatch: boolean; colorMatch: boolean; seasonAppropriate: boolean } {
    let score = 50; // Base score
    let genderMatch = true;
    let colorMatch = false;
    let seasonAppropriate = true;

    // Gender match (VERY important - heavily penalize wrong gender)
    const productGender = product.gender as string | undefined;
    const userGender = vibe.gender || 'unknown';

    if (productGender && productGender !== 'unisex') {
      if (userGender !== 'unknown' && productGender !== userGender) {
        // WRONG gender - massive penalty, essentially filter out
        score -= 80;
        genderMatch = false;
      } else if (productGender === userGender) {
        // Exact gender match - bonus
        score += 25;
      }
    } else if (productGender === 'unisex') {
      // Unisex is good but gender-specific is better
      score += 10;
    }

    // Archetype match
    const productArchetypes = (product.style_archetypes as string[]) || [];
    const primaryMatch = (style?.primary_archetype || 'minimalist').toLowerCase().replace(/ /g, '-');
    const secondaryMatch = (style?.secondary_archetype || 'streetwear').toLowerCase().replace(/ /g, '-');

    if (productArchetypes.includes(primaryMatch)) {
      score += 20;
    }
    if (productArchetypes.includes(secondaryMatch)) {
      score += 10;
    }

    // Color match
    const productColors = ((product.colors as string[]) || []).filter(c => c && typeof c === 'string').map(c => c.toLowerCase());
    const bestColors = (vibe.color_profile?.best_colors || []).filter(c => c && typeof c === 'string').map(c => c.toLowerCase());

    for (const color of productColors) {
      for (const best of bestColors) {
        if (color.includes(best) || best.includes(color)) {
          score += 10;
          colorMatch = true;
          break;
        }
      }
    }

    // Season appropriateness
    if (vibe.seasonal_recommendations) {
      const weight = vibe.seasonal_recommendations.clothing_weight;
      const productWeight = product.weight as string | undefined;

      if (productWeight) {
        if (weight === 'heavy' && productWeight === 'light') {
          score -= 15;
          seasonAppropriate = false;
        } else if (weight === 'light' && productWeight === 'heavy') {
          score -= 15;
          seasonAppropriate = false;
        } else if (productWeight === weight) {
          score += 10;
        }
      }
    }

    // Price tier match
    const price = product.price as number || 0;
    if (style.budget_tier === 'luxury' && price >= 200) {
      score += 10;
    } else if (style.budget_tier === 'accessible' && price <= 100) {
      score += 10;
    } else if (style.budget_tier === 'mid-range' && price >= 80 && price <= 250) {
      score += 10;
    }

    return {
      total: Math.max(0, Math.min(100, score)),
      genderMatch,
      colorMatch,
      seasonAppropriate,
    };
  }

  private async generateMatchReason(
    product: Record<string, unknown>,
    vibe: VibeAnalysis,
    style: StyleRecommendation
  ): Promise<string> {
    // Include more context for better reasons - with null safety
    const gender = vibe?.gender || 'unknown';
    const professionArchetype = vibe?.profession_archetype || 'general';
    const energy = vibe?.energy || 'unique';
    const primaryArchetype = style?.primary_archetype || 'minimalist';
    const productName = product?.name || 'this item';
    const productBrand = product?.brand || 'this brand';

    const genderContext = gender !== 'unknown' ? `for a ${gender}` : '';
    const professionContext = professionArchetype !== 'general'
      ? `in the ${professionArchetype} space`
      : '';

    const prompt = `In exactly 10-15 words, explain why "${productName}" by ${productBrand} is perfect ${genderContext} ${professionContext} with "${energy}" energy and ${primaryArchetype} style.

Consider:
- Their vibe: ${vibe?.vibe_summary || 'unique style'}
- Season: ${vibe?.seasonal_recommendations?.season || 'versatile'}
- Color profile: ${vibe?.color_profile?.subtype || 'flexible'}

Be specific, stylish, and slightly witty. Make it personal.`;

    try {
      const response = await this.llm(
        'You are a fashion stylist giving quick, punchy product recommendations. Return ONLY the recommendation text, nothing else. Be personalized and specific.',
        prompt,
        { temperature: 0.9 }
      );
      return response.trim().replace(/"/g, '');
    } catch {
      return `Perfect ${(style?.primary_archetype || 'minimalist').toLowerCase()} pick for your ${vibe?.aesthetic_keywords?.[0] || 'unique'} aesthetic.`;
    }
  }

  private async generateOutfitSuggestions(
    products: ProductRecommendation[],
    vibe: VibeAnalysis,
    style: StyleRecommendation
  ): Promise<OutfitSuggestion[]> {
    if (products.length < 3) {
      return [];
    }

    // Group products by category
    const byCategory: Record<string, ProductRecommendation[]> = {};
    for (const p of products) {
      const cat = p.category?.toLowerCase() || 'other';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(p);
    }

    const archetype = vibe?.profession_archetype || 'general';
    const occasions = archetype === 'tech-founder'
      ? ['pitch meeting', 'casual friday', 'conference']
      : archetype === 'developer'
        ? ['work from home', 'team standup', 'hackathon']
        : archetype === 'creative'
          ? ['gallery opening', 'studio day', 'client meeting']
          : ['everyday', 'weekend', 'special occasion'];

    const outfits: OutfitSuggestion[] = [];

    for (let i = 0; i < Math.min(3, occasions.length); i++) {
      const occasion = occasions[i];
      // Try to pick one from different categories
      const selected: string[] = [];
      const categories = Object.keys(byCategory);

      for (const cat of categories.slice(0, 3)) {
        if (byCategory[cat].length > 0) {
          const product = byCategory[cat][i % byCategory[cat].length];
          selected.push(product._id);
        }
      }

      if (selected.length > 0) {
        outfits.push({
          name: `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Look`,
          occasion,
          products: selected,
          styling_tip: `Perfect for ${occasion} - ${(style?.style_notes || 'curated for your vibe').split('.')[0]}.`,
        });
      }
    }

    return outfits;
  }
}
