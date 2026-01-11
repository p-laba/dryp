import { BaseAgent, AgentResult } from './base';
import { TwitterProfile } from '@/lib/twitter';
import { getWeatherForLocation, getSeasonalRecommendations, WeatherData, SeasonalRecommendation } from '@/lib/weather';
import { analyzeColorSeason, ColorProfile } from '@/lib/color-analysis';

export interface VibeAnalysis {
  // Core personality
  personality_traits: string[];
  interests: string[];
  communication_style: string;
  aesthetic_keywords: string[];
  energy: string;
  vibe_summary: string;

  // Enhanced demographics
  gender: 'male' | 'female' | 'non-binary' | 'unknown';
  gender_confidence: number; // 0-1
  age_range: string;

  // Profession/Interest Archetype
  profession_archetype: ProfessionArchetype;

  // Location & Weather
  location_detected: string | null;
  weather?: WeatherData;
  seasonal_recommendations?: SeasonalRecommendation;

  // Color Analysis (inferred from profile)
  color_profile?: ColorProfile;
  inferred_appearance?: InferredAppearance;
}

export type ProfessionArchetype =
  | 'tech-founder'      // "Old money" stealth luxury, quiet confidence
  | 'developer'         // Comfort-focused, hoodies, practical
  | 'creative'          // Artistic, bold, experimental
  | 'finance'           // Traditional luxury, conservative
  | 'influencer'        // Trendy, brand-conscious, photogenic
  | 'academic'          // Classic, intellectual, timeless
  | 'artist'            // Avant-garde, unique, expressive
  | 'entrepreneur'      // Versatile, polished, adaptable
  | 'athlete'           // Athleisure, performance, sporty
  | 'general';          // Default fallback

export interface InferredAppearance {
  hair_color_guess: string | null;
  eye_color_guess: string | null;
  skin_tone_guess: string | null;
  undertone_guess: 'warm' | 'cool' | 'neutral';
  style_era_preference: string;
}

export class VibeAgent extends BaseAgent<TwitterProfile, VibeAnalysis> {
  constructor() {
    super('VibeAgent', 'Comprehensive personality, demographics, and style analysis');
  }

  async run(profile: TwitterProfile): Promise<AgentResult<VibeAnalysis>> {
    this.log(`Deep analysis for @${profile.handle}...`);

    // Run multiple analyses in parallel for speed
    const [personalityResult, demographicsResult, weatherData] = await Promise.all([
      this.analyzePersonality(profile),
      this.analyzeDemographics(profile),
      profile.location ? getWeatherForLocation(profile.location) : Promise.resolve(null),
    ]);

    if (!personalityResult.success || !personalityResult.data) {
      return { success: false, error: personalityResult.error || 'Personality analysis failed' };
    }

    if (!demographicsResult.success || !demographicsResult.data) {
      return { success: false, error: demographicsResult.error || 'Demographics analysis failed' };
    }

    const personality = personalityResult.data;
    const demographics = demographicsResult.data;

    // Analyze color profile based on inferred appearance
    let colorProfile: ColorProfile | undefined;
    if (demographics.inferred_appearance) {
      colorProfile = analyzeColorSeason({
        hair_color: demographics.inferred_appearance.hair_color_guess || undefined,
        eye_color: demographics.inferred_appearance.eye_color_guess || undefined,
        skin_tone: demographics.inferred_appearance.skin_tone_guess || undefined,
        undertone_guess: demographics.inferred_appearance.undertone_guess,
      });
    }

    // Get seasonal recommendations if we have weather
    let seasonalRecs: SeasonalRecommendation | undefined;
    if (weatherData) {
      seasonalRecs = getSeasonalRecommendations(weatherData);
    }

    const vibeAnalysis: VibeAnalysis = {
      // Core personality
      personality_traits: personality.personality_traits,
      interests: personality.interests,
      communication_style: personality.communication_style,
      aesthetic_keywords: personality.aesthetic_keywords,
      energy: personality.energy,
      vibe_summary: personality.vibe_summary,

      // Demographics
      gender: demographics.gender,
      gender_confidence: demographics.gender_confidence,
      age_range: demographics.age_range,
      profession_archetype: demographics.profession_archetype,

      // Location & Weather
      location_detected: profile.location || demographics.location_inferred || null,
      weather: weatherData || undefined,
      seasonal_recommendations: seasonalRecs,

      // Color Analysis
      color_profile: colorProfile,
      inferred_appearance: demographics.inferred_appearance,
    };

    this.log(`Complete! Gender: ${vibeAnalysis.gender} (${Math.round(vibeAnalysis.gender_confidence * 100)}%), Archetype: ${vibeAnalysis.profession_archetype}`);

    return { success: true, data: vibeAnalysis };
  }

  private async analyzePersonality(profile: TwitterProfile): Promise<AgentResult<{
    personality_traits: string[];
    interests: string[];
    communication_style: string;
    aesthetic_keywords: string[];
    energy: string;
    vibe_summary: string;
  }>> {
    const systemPrompt = `You are a cultural analyst and fashion psychologist.
Analyze this Twitter/X presence to determine their aesthetic vibe.

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "personality_traits": ["trait1", "trait2", "trait3"],
  "interests": ["interest1", "interest2", "interest3"],
  "communication_style": "description of how they communicate",
  "aesthetic_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "energy": "one phrase describing their overall energy",
  "vibe_summary": "2-3 sentence summary of their vibe and what fashion would suit them"
}

Be insightful, culturally aware, and think like a fashion editor meets internet culture expert.`;

    const userPrompt = `Analyze this Twitter profile:

**Handle:** @${profile.handle}
**Name:** ${profile.name || 'Unknown'}
**Bio:** ${profile.bio || 'No bio provided'}
**Stats:** ${profile.followers.toLocaleString()} followers, following ${profile.following.toLocaleString()}

**Recent Tweets:**
${profile.tweets.slice(0, 15).map((t, i) => `${i + 1}. ${t}`).join('\n')}`;

    try {
      const response = await this.llm(systemPrompt, userPrompt, { json: true, temperature: 0.7 });
      let jsonStr = response.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '');
      }
      const data = JSON.parse(jsonStr);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async analyzeDemographics(profile: TwitterProfile): Promise<AgentResult<{
    gender: 'male' | 'female' | 'non-binary' | 'unknown';
    gender_confidence: number;
    age_range: string;
    profession_archetype: ProfessionArchetype;
    location_inferred: string | null;
    inferred_appearance: InferredAppearance;
  }>> {
    const systemPrompt = `You are an expert at analyzing social media profiles to understand demographics for personalized fashion recommendations.

Your task is to analyze the profile and return demographics. Be respectful and thoughtful.

IMPORTANT GUIDELINES:
- Gender: Analyze based on name, pronouns in bio, writing style, and content. If unsure, use "unknown"
- Profession Archetype: Categorize based on interests and content:
  * "tech-founder" - startup founders, VCs, building companies, tweets about raising, shipping, product
  * "developer" - programmers, engineers, code-focused, technical discussions
  * "creative" - designers, artists, photographers, creative work
  * "finance" - trading, investing, banking, markets
  * "influencer" - lifestyle content, brand deals, audience building
  * "academic" - researchers, professors, intellectual discussions
  * "artist" - musicians, visual artists, performers
  * "entrepreneur" - business-focused but not specifically tech
  * "athlete" - sports, fitness, physical performance
  * "general" - no clear archetype

- Appearance: Make educated guesses based on name origin, cultural context, and any hints. Use null if truly uncertain.
- For undertone: warm (golden/yellow), cool (pink/blue), or neutral

Return ONLY valid JSON:
{
  "gender": "male" | "female" | "non-binary" | "unknown",
  "gender_confidence": 0.0-1.0,
  "age_range": "18-24" | "25-34" | "35-44" | "45-54" | "55+",
  "profession_archetype": "tech-founder" | "developer" | "creative" | "finance" | "influencer" | "academic" | "artist" | "entrepreneur" | "athlete" | "general",
  "location_inferred": "City, Country" or null,
  "inferred_appearance": {
    "hair_color_guess": "description" or null,
    "eye_color_guess": "description" or null,
    "skin_tone_guess": "description" or null,
    "undertone_guess": "warm" | "cool" | "neutral",
    "style_era_preference": "modern" | "classic" | "retro" | "futuristic"
  }
}`;

    const userPrompt = `Analyze this profile for fashion personalization:

**Handle:** @${profile.handle}
**Name:** ${profile.name || 'Not provided'}
**Bio:** ${profile.bio || 'No bio'}
**Location:** ${profile.location || 'Not provided'}
**Followers:** ${profile.followers.toLocaleString()}

**Tweets (analyze for gender indicators, profession, interests):**
${profile.tweets.slice(0, 20).map((t, i) => `${i + 1}. ${t}`).join('\n')}

Based on name, bio, writing style, and content, provide demographic analysis.`;

    try {
      const response = await this.llm(systemPrompt, userPrompt, { json: true, temperature: 0.5 });
      let jsonStr = response.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '');
      }
      const rawData = JSON.parse(jsonStr);

      // Validate and normalize with defaults for ALL fields
      const validGenders = ['male', 'female', 'non-binary', 'unknown'];
      const gender = validGenders.includes(rawData.gender) ? rawData.gender : 'unknown';

      const validArchetypes: ProfessionArchetype[] = [
        'tech-founder', 'developer', 'creative', 'finance', 'influencer',
        'academic', 'artist', 'entrepreneur', 'athlete', 'general'
      ];
      const profession_archetype = validArchetypes.includes(rawData.profession_archetype)
        ? rawData.profession_archetype
        : 'general';

      const gender_confidence = Math.min(1, Math.max(0, rawData.gender_confidence || 0.5));

      // Ensure all fields have defaults
      const data = {
        gender,
        gender_confidence,
        age_range: rawData.age_range || '25-34',
        profession_archetype,
        location_inferred: rawData.location_inferred || null,
        inferred_appearance: {
          hair_color_guess: rawData.inferred_appearance?.hair_color_guess || null,
          eye_color_guess: rawData.inferred_appearance?.eye_color_guess || null,
          skin_tone_guess: rawData.inferred_appearance?.skin_tone_guess || null,
          undertone_guess: rawData.inferred_appearance?.undertone_guess || 'neutral',
          style_era_preference: rawData.inferred_appearance?.style_era_preference || 'modern',
        },
      };

      return { success: true, data };
    } catch (error) {
      // Return defaults on error
      return {
        success: true,
        data: {
          gender: 'unknown',
          gender_confidence: 0,
          age_range: '25-34',
          profession_archetype: 'general',
          location_inferred: null,
          inferred_appearance: {
            hair_color_guess: null,
            eye_color_guess: null,
            skin_tone_guess: null,
            undertone_guess: 'neutral',
            style_era_preference: 'modern',
          },
        },
      };
    }
  }
}
