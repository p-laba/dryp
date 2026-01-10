import { BaseAgent, AgentResult } from './base';
import { TwitterProfile } from '@/lib/twitter';

export interface VibeAnalysis {
  personality_traits: string[];
  interests: string[];
  communication_style: string;
  aesthetic_keywords: string[];
  energy: string;
  vibe_summary: string;
}

export class VibeAgent extends BaseAgent<TwitterProfile, VibeAnalysis> {
  constructor() {
    super('VibeAgent', 'Analyzes Twitter personality to extract aesthetic vibe');
  }

  async run(profile: TwitterProfile): Promise<AgentResult<VibeAnalysis>> {
    this.log(`Analyzing vibe for @${profile.handle}...`);

    const systemPrompt = `You are a cultural analyst and fashion psychologist.
Your job is to analyze someone's Twitter/X presence and determine their aesthetic vibe.

You MUST return a valid JSON object with this EXACT structure (no markdown, no extra text):
{
  "personality_traits": ["trait1", "trait2", "trait3"],
  "interests": ["interest1", "interest2", "interest3"],
  "communication_style": "description of how they communicate",
  "aesthetic_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "energy": "one phrase describing their overall energy",
  "vibe_summary": "2-3 sentence summary of their vibe and what fashion would suit them"
}

Be insightful, slightly edgy, and culturally aware. Think like a fashion editor meets internet culture expert.
Return ONLY the JSON object, nothing else.`;

    const userPrompt = `Analyze this Twitter profile:

**Handle:** @${profile.handle}
**Bio:** ${profile.bio || 'No bio provided'}
**Stats:** ${profile.followers.toLocaleString()} followers, following ${profile.following.toLocaleString()}

**Recent Tweets:**
${profile.tweets.slice(0, 15).map((t, i) => `${i + 1}. ${t}`).join('\n')}

Based on this, what is their aesthetic vibe? What kind of fashion would suit their personality?`;

    try {
      const response = await this.llm(systemPrompt, userPrompt, { json: true, temperature: 0.8 });

      // Parse JSON, handling potential markdown code blocks
      let jsonStr = response.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '');
      }

      const vibe = JSON.parse(jsonStr) as VibeAnalysis;

      this.log(`Vibe identified: "${vibe.energy}"`);
      return { success: true, data: vibe };
    } catch (error) {
      this.log(`Error: ${error}`);
      return { success: false, error: String(error) };
    }
  }
}
