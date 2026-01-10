import { BaseAgent, AgentResult } from './base';
import { VibeAnalysis } from './vibe';
import { getDb } from '@/lib/mongodb';

export interface StyleRecommendation {
  primary_archetype: string;
  secondary_archetype: string;
  color_palette: string[];
  style_notes: string;
  avoid: string[];
}

export class StyleAgent extends BaseAgent<VibeAnalysis, StyleRecommendation> {
  constructor() {
    super('StyleAgent', 'Maps personality vibe to fashion archetypes');
  }

  async run(vibe: VibeAnalysis): Promise<AgentResult<StyleRecommendation>> {
    this.log('Matching vibe to style archetypes...');

    // Get all archetypes from DB
    const db = await getDb();
    const archetypes = await db.collection('archetypes').find({}).toArray();

    // Use LLM to match vibe to archetypes
    const systemPrompt = `You are a fashion stylist expert. Given a person's vibe profile and available style archetypes, determine which archetypes best match them.

Available archetypes:
${archetypes.map(a => `- ${a.name}: ${a.description}`).join('\n')}

You MUST return a valid JSON object with this EXACT structure (no markdown, no extra text):
{
  "primary_archetype": "archetype name (must match one from the list)",
  "secondary_archetype": "archetype name (must match one from the list)",
  "color_palette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "style_notes": "2-3 specific styling tips personalized for this person",
  "avoid": ["thing to avoid 1", "thing to avoid 2", "thing to avoid 3"]
}

Return ONLY the JSON object, nothing else.`;

    const userPrompt = `Match this person to style archetypes:

**Vibe Summary:** ${vibe.vibe_summary}
**Energy:** ${vibe.energy}
**Aesthetic Keywords:** ${vibe.aesthetic_keywords.join(', ')}
**Personality Traits:** ${vibe.personality_traits.join(', ')}
**Interests:** ${vibe.interests.join(', ')}
**Communication Style:** ${vibe.communication_style}

Which archetypes fit best? Provide specific color palette and style notes.`;

    try {
      const response = await this.llm(systemPrompt, userPrompt, { json: true, temperature: 0.7 });

      let jsonStr = response.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '');
      }

      const style = JSON.parse(jsonStr) as StyleRecommendation;

      this.log(`Style matched: ${style.primary_archetype} + ${style.secondary_archetype}`);
      return { success: true, data: style };
    } catch (error) {
      this.log(`Error: ${error}`);
      // Fallback
      return {
        success: true,
        data: {
          primary_archetype: 'Minimalist',
          secondary_archetype: 'Streetwear',
          color_palette: ['#000000', '#ffffff', '#808080', '#1a1a1a'],
          style_notes: 'Clean, versatile pieces that match your energy.',
          avoid: ['Overly loud patterns', 'Ill-fitting clothes', 'Fast fashion'],
        },
      };
    }
  }
}
