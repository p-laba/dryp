import { BaseAgent, AgentResult } from './base';
import { VibeAnalysis, ProfessionArchetype } from './vibe';
import { getDb } from '@/lib/mongodb';

export interface StyleRecommendation {
  primary_archetype: string;
  secondary_archetype: string;
  color_palette: string[];
  style_notes: string;
  avoid: string[];

  // Enhanced fields
  gender_specific_notes: string;
  profession_style_tips: string;
  seasonal_adjustments: string;
  color_season_palette?: string[];
  budget_tier: 'accessible' | 'mid-range' | 'luxury' | 'mixed';
  signature_pieces: string[];
}

// Profession-specific style mappings
const PROFESSION_STYLE_MAP: Record<ProfessionArchetype, {
  description: string;
  key_brands: string[];
  signature_items: string[];
  style_vibe: string;
}> = {
  'tech-founder': {
    description: 'Stealth wealth, quiet luxury. The "I could buy this company" energy.',
    key_brands: ['Brunello Cucinelli', 'Loro Piana', 'The Row', 'Fear of God Essentials', 'Zegna'],
    signature_items: ['cashmere crewneck', 'premium gray t-shirt', 'tailored joggers', 'minimalist sneakers', 'understated watch'],
    style_vibe: 'Expensive basics that whisper wealth',
  },
  'developer': {
    description: 'Comfort-first with subtle tech cred. Function meets form.',
    key_brands: ['Allbirds', 'Patagonia', 'Arc\'teryx', 'Uniqlo', 'Everlane'],
    signature_items: ['quality hoodie', 'performance fleece', 'dark jeans', 'comfortable sneakers', 'backpack'],
    style_vibe: 'Practical, comfortable, subtly technical',
  },
  'creative': {
    description: 'Bold self-expression, mixing high and low, vintage and new.',
    key_brands: ['Comme des Garçons', 'Rick Owens', 'Margiela', 'vintage finds', 'emerging designers'],
    signature_items: ['statement jacket', 'unique accessories', 'interesting textures', 'artistic pieces', 'conversation starters'],
    style_vibe: 'Artistic, intentional, boundary-pushing',
  },
  'finance': {
    description: 'Traditional elegance with power cues. Serious money energy.',
    key_brands: ['Tom Ford', 'Brioni', 'Hermès', 'Rolex', 'Ermenegildo Zegna'],
    signature_items: ['tailored suit', 'luxury watch', 'leather briefcase', 'silk tie', 'Oxford shoes'],
    style_vibe: 'Polished, traditional, authoritative',
  },
  'influencer': {
    description: 'Camera-ready, on-trend, brand-conscious. Made for the feed.',
    key_brands: ['Jacquemus', 'Bottega Veneta', 'trending designers', 'It brands', 'statement logos'],
    signature_items: ['photogenic pieces', 'trending items', 'statement bags', 'bold accessories', 'mix of luxury and accessible'],
    style_vibe: 'Trendy, photogenic, instantly recognizable',
  },
  'academic': {
    description: 'Timeless intellectual style. Think tweed meets modern.',
    key_brands: ['J.Press', 'Brooks Brothers', 'Drake\'s', 'Margaret Howell', 'A.P.C.'],
    signature_items: ['blazer', 'quality knitwear', 'Oxford cloth button-down', 'loafers', 'leather tote'],
    style_vibe: 'Intellectual, timeless, thoughtfully assembled',
  },
  'artist': {
    description: 'Avant-garde expression. Clothes as art.',
    key_brands: ['Yohji Yamamoto', 'Issey Miyake', 'Ann Demeulemeester', 'Comme des Garçons', 'Rick Owens'],
    signature_items: ['architectural pieces', 'all-black looks', 'asymmetric cuts', 'unusual silhouettes', 'artisan jewelry'],
    style_vibe: 'Dramatic, sculptural, gallery-ready',
  },
  'entrepreneur': {
    description: 'Versatile polish. Boardroom to bar.',
    key_brands: ['Theory', 'Reiss', 'COS', 'Suitsupply', 'Massimo Dutti'],
    signature_items: ['versatile blazer', 'smart casual pieces', 'quality basics', 'good leather shoes', 'classic watch'],
    style_vibe: 'Adaptable, polished, professional',
  },
  'athlete': {
    description: 'Performance meets lifestyle. Elevated athleisure.',
    key_brands: ['Lululemon', 'Nike', 'Rhone', 'Vuori', 'Outdoor Voices'],
    signature_items: ['premium joggers', 'performance polo', 'technical layers', 'quality sneakers', 'sporty watch'],
    style_vibe: 'Active, fit, performance-oriented',
  },
  'general': {
    description: 'Classic versatility. Build a solid foundation.',
    key_brands: ['Uniqlo', 'Everlane', 'COS', 'Mango', 'Zara'],
    signature_items: ['quality basics', 'versatile jeans', 'clean sneakers', 'classic outerwear', 'minimal accessories'],
    style_vibe: 'Clean, versatile, universally appealing',
  },
};

export class StyleAgent extends BaseAgent<VibeAnalysis, StyleRecommendation> {
  constructor() {
    super('StyleAgent', 'Maps personality, demographics, and season to fashion archetypes');
  }

  async run(vibe: VibeAnalysis): Promise<AgentResult<StyleRecommendation>> {
    this.log('Matching vibe to style archetypes with enhanced analysis...');

    // Get all archetypes from DB
    const db = await getDb();
    const archetypes = await db.collection('archetypes').find({}).toArray();

    // Get profession-specific guidance
    const professionStyle = PROFESSION_STYLE_MAP[vibe.profession_archetype];

    // Build enhanced context
    const genderContext = vibe.gender !== 'unknown'
      ? `Gender: ${vibe.gender} (confidence: ${Math.round(vibe.gender_confidence * 100)}%)`
      : 'Gender: Not determined - provide gender-neutral recommendations';

    const weatherContext = vibe.weather
      ? `Current weather: ${vibe.weather.temperature}°C, ${vibe.weather.condition} in ${vibe.weather.location}. Season: ${vibe.weather.season}.`
      : '';

    const seasonalContext = vibe.seasonal_recommendations
      ? `Clothing weight: ${vibe.seasonal_recommendations.clothing_weight}. Suggested fabrics: ${vibe.seasonal_recommendations.fabric_suggestions.join(', ')}.`
      : '';

    const colorContext = vibe.color_profile
      ? `Color season: ${vibe.color_profile.subtype}. Best colors: ${vibe.color_profile.best_colors.join(', ')}. Metals: ${vibe.color_profile.metals.join(', ')}. Avoid: ${vibe.color_profile.avoid_colors.join(', ')}.`
      : '';

    const systemPrompt = `You are an elite personal stylist who creates hyper-personalized fashion recommendations.

Available style archetypes:
${archetypes.map(a => `- ${a.name}: ${a.description}`).join('\n')}

Profession archetype guidance for "${vibe.profession_archetype}":
- Vibe: ${professionStyle.style_vibe}
- Key brands: ${professionStyle.key_brands.join(', ')}
- Signature items: ${professionStyle.signature_items.join(', ')}

CRITICAL: Personalize recommendations based on ALL available data:
- Gender should influence silhouettes, brands, and specific pieces
- Weather/season should affect fabric weights and layering
- Color analysis should guide the color palette
- Profession should influence the overall aesthetic direction

Return ONLY a valid JSON object:
{
  "primary_archetype": "archetype name from list",
  "secondary_archetype": "archetype name from list",
  "color_palette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "style_notes": "2-3 specific styling tips personalized for this person",
  "avoid": ["thing to avoid 1", "thing to avoid 2", "thing to avoid 3"],
  "gender_specific_notes": "gender-appropriate styling advice",
  "profession_style_tips": "tips specific to their profession/interests",
  "seasonal_adjustments": "current season/weather specific advice",
  "color_season_palette": ["#hex1", "#hex2", "#hex3", "#hex4"] (based on their color season if available),
  "budget_tier": "accessible" | "mid-range" | "luxury" | "mixed",
  "signature_pieces": ["piece1", "piece2", "piece3", "piece4", "piece5"]
}`;

    const userPrompt = `Create personalized style recommendations for this person:

**DEMOGRAPHICS**
${genderContext}
Age range: ${vibe.age_range}
Profession archetype: ${vibe.profession_archetype}

**PERSONALITY & VIBE**
Vibe Summary: ${vibe.vibe_summary}
Energy: ${vibe.energy}
Aesthetic Keywords: ${vibe.aesthetic_keywords.join(', ')}
Personality Traits: ${vibe.personality_traits.join(', ')}
Interests: ${vibe.interests.join(', ')}
Communication Style: ${vibe.communication_style}

**LOCATION & WEATHER**
${weatherContext || 'Location not provided - give seasonally versatile advice'}
${seasonalContext}

**COLOR ANALYSIS**
${colorContext || 'Color season not determined - use versatile palette'}

**INFERRED APPEARANCE**
${vibe.inferred_appearance ? `
Hair: ${vibe.inferred_appearance.hair_color_guess || 'unknown'}
Eyes: ${vibe.inferred_appearance.eye_color_guess || 'unknown'}
Skin tone: ${vibe.inferred_appearance.skin_tone_guess || 'unknown'}
Undertone: ${vibe.inferred_appearance.undertone_guess}
Style era preference: ${vibe.inferred_appearance.style_era_preference}
` : 'Not available'}

Create a cohesive style identity that feels authentic to who they are.`;

    try {
      const response = await this.llm(systemPrompt, userPrompt, { json: true, temperature: 0.7 });

      let jsonStr = response.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '');
      }

      const style = JSON.parse(jsonStr) as StyleRecommendation;

      // Ensure color_season_palette exists if we have color profile
      if (vibe.color_profile && !style.color_season_palette) {
        style.color_season_palette = this.getHexColorsFromProfile(vibe.color_profile.best_colors);
      }

      this.log(`Style matched: ${style.primary_archetype} + ${style.secondary_archetype} (${style.budget_tier})`);
      return { success: true, data: style };
    } catch (error) {
      this.log(`Error: ${error}`);
      // Enhanced fallback
      return {
        success: true,
        data: {
          primary_archetype: 'Minimalist',
          secondary_archetype: 'Streetwear',
          color_palette: ['#000000', '#ffffff', '#808080', '#1a1a1a', '#2d2d2d'],
          style_notes: 'Clean, versatile pieces that match your energy.',
          avoid: ['Overly loud patterns', 'Ill-fitting clothes', 'Fast fashion'],
          gender_specific_notes: 'Focus on well-fitted basics that flatter your frame.',
          profession_style_tips: professionStyle.description,
          seasonal_adjustments: 'Layer pieces that can adapt to temperature changes.',
          budget_tier: 'mixed',
          signature_pieces: professionStyle.signature_items,
        },
      };
    }
  }

  // Convert color names to approximate hex codes
  private getHexColorsFromProfile(colorNames: string[]): string[] {
    const colorMap: Record<string, string> = {
      // Warm colors
      'peach': '#FFCBA4', 'coral': '#FF7F50', 'tangerine': '#FF9966',
      'terracotta': '#E2725B', 'rust': '#B7410E', 'olive': '#808000',
      'mustard': '#FFDB58', 'camel': '#C19A6B', 'cream': '#FFFDD0',
      'gold': '#FFD700', 'copper': '#B87333', 'burnt orange': '#CC5500',

      // Cool colors
      'powder blue': '#B0E0E6', 'lavender': '#E6E6FA', 'slate blue': '#6A5ACD',
      'navy': '#000080', 'burgundy': '#800020', 'raspberry': '#E30B5C',
      'plum': '#8E4585', 'dusty rose': '#DCAE96', 'mauve': '#E0B0FF',
      'silver': '#C0C0C0', 'charcoal': '#36454F', 'gray': '#808080',

      // Neutrals
      'black': '#000000', 'white': '#FFFFFF', 'ivory': '#FFFFF0',
      'beige': '#F5F5DC', 'taupe': '#483C32', 'stone': '#928E85',

      // Bright colors
      'emerald': '#50C878', 'sapphire blue': '#0F52BA', 'ruby red': '#E0115F',
      'fuchsia': '#FF00FF', 'turquoise': '#40E0D0', 'cobalt blue': '#0047AB',
    };

    return colorNames.slice(0, 4).map(name => {
      const lower = name.toLowerCase();
      // Find partial match
      for (const [key, hex] of Object.entries(colorMap)) {
        if (lower.includes(key) || key.includes(lower)) {
          return hex;
        }
      }
      return '#808080'; // Default gray
    });
  }
}
