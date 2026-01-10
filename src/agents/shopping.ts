import { BaseAgent, AgentResult } from './base';
import { StyleRecommendation } from './style';
import { VibeAnalysis } from './vibe';
import { getDb } from '@/lib/mongodb';

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
}

export interface ShoppingResult {
  free_recommendations: ProductRecommendation[];
  premium_recommendations: ProductRecommendation[];
}

export class ShoppingAgent extends BaseAgent<
  { style: StyleRecommendation; vibe: VibeAnalysis },
  ShoppingResult
> {
  constructor() {
    super('ShoppingAgent', 'Finds products matching style profile');
  }

  async run(input: {
    style: StyleRecommendation;
    vibe: VibeAnalysis;
  }): Promise<AgentResult<ShoppingResult>> {
    this.log('Finding perfect products...');

    const { style, vibe } = input;
    const db = await getDb();

    // Find products matching the archetypes
    const products = await db.collection('products')
      .find({
        style_archetypes: {
          $in: [
            style.primary_archetype.toLowerCase().replace(' ', '-'),
            style.secondary_archetype.toLowerCase().replace(' ', '-'),
          ],
        },
      })
      .limit(10)
      .toArray();

    // If no matches, get random products
    let matchedProducts = products;
    if (products.length === 0) {
      this.log('No archetype matches, getting general products...');
      matchedProducts = await db.collection('products').find({}).limit(10).toArray();
    }

    // Generate match reasons with LLM
    const productsWithReasons = await Promise.all(
      matchedProducts.map(async (product) => {
        const reason = await this.generateMatchReason(product, vibe, style);
        return {
          _id: product._id.toString(),
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          description: product.description,
          image_url: product.image_url,
          buy_link: product.buy_link,
          match_reason: reason,
        };
      })
    );

    // Split into free (3) and premium (rest)
    const freeRecs = productsWithReasons.slice(0, 3);
    const premiumRecs = productsWithReasons.slice(3);

    this.log(`Found ${freeRecs.length} free + ${premiumRecs.length} premium recommendations`);

    return {
      success: true,
      data: {
        free_recommendations: freeRecs,
        premium_recommendations: premiumRecs,
      },
    };
  }

  private async generateMatchReason(
    product: Record<string, unknown>,
    vibe: VibeAnalysis,
    style: StyleRecommendation
  ): Promise<string> {
    const prompt = `In exactly 10-15 words, explain why "${product.name}" by ${product.brand} is perfect for someone with "${vibe.energy}" energy and a ${style.primary_archetype} style. Be specific, stylish, and slightly witty.`;

    try {
      const response = await this.llm(
        'You are a fashion stylist giving quick, punchy product recommendations. Return ONLY the recommendation text, nothing else.',
        prompt,
        { temperature: 0.9 }
      );
      return response.trim().replace(/"/g, '');
    } catch {
      return `Perfect match for your ${vibe.aesthetic_keywords[0] || 'unique'} aesthetic.`;
    }
  }
}
