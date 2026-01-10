import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/mongodb';
import { scrapeTwitterProfile, parseManualInput, TwitterProfile } from '@/lib/twitter';
import { VibeAgent, VibeAnalysis } from './vibe';
import { StyleAgent, StyleRecommendation } from './style';
import { ShoppingAgent, ShoppingResult } from './shopping';
import { Document } from 'mongodb';

export interface AnalysisJob {
  _id: string;
  handle: string;
  status: 'pending' | 'scraping' | 'analyzing_vibe' | 'matching_style' | 'finding_products' | 'complete' | 'error';
  progress: number;
  error?: string;
  lookbook_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Lookbook {
  _id: string;
  handle: string;
  profile: TwitterProfile;
  vibe: VibeAnalysis;
  style: StyleRecommendation;
  products: ShoppingResult;
  created_at: Date;
}

class Orchestrator {
  private vibeAgent = new VibeAgent();
  private styleAgent = new StyleAgent();
  private shoppingAgent = new ShoppingAgent();

  async startAnalysis(handle: string, directInput?: string): Promise<string> {
    const jobId = uuidv4();
    const db = await getDb();

    // Create job
    await db.collection('jobs').insertOne({
      _id: jobId,
      handle,
      status: 'pending',
      progress: 0,
      created_at: new Date(),
      updated_at: new Date(),
    } as unknown as Document);

    // Start async processing (don't await)
    this.processJob(jobId, handle, directInput).catch(console.error);

    return jobId;
  }

  async getJobStatus(jobId: string): Promise<AnalysisJob | null> {
    const db = await getDb();
    return db.collection('jobs').findOne({ _id: jobId } as unknown as Document) as unknown as AnalysisJob | null;
  }

  async getLookbook(lookbookId: string): Promise<Lookbook | null> {
    const db = await getDb();
    return db.collection('lookbooks').findOne({ _id: lookbookId } as unknown as Document) as unknown as Lookbook | null;
  }

  private async updateJob(jobId: string, update: Partial<AnalysisJob>) {
    const db = await getDb();
    await db.collection('jobs').updateOne(
      { _id: jobId } as unknown as Document,
      { $set: { ...update, updated_at: new Date() } }
    );
  }

  private async processJob(jobId: string, handle: string, directInput?: string) {
    const db = await getDb();

    try {
      // Step 1: Get Twitter Data
      await this.updateJob(jobId, { status: 'scraping', progress: 10 });

      let profile: TwitterProfile;
      if (directInput) {
        // Use manual input (for demo)
        profile = parseManualInput(directInput, handle);
        console.log('[Orchestrator] Using manual input mode');
      } else {
        // Scrape from Twitter
        try {
          profile = await scrapeTwitterProfile(handle);
        } catch (scrapeError) {
          console.log('[Orchestrator] Twitter scrape failed, using demo data:', scrapeError);
          // Fallback to demo data
          profile = this.getDemoProfile(handle);
        }
      }
      await this.updateJob(jobId, { progress: 25 });

      // Step 2: Analyze Vibe
      await this.updateJob(jobId, { status: 'analyzing_vibe', progress: 30 });
      const vibeResult = await this.vibeAgent.run(profile);
      if (!vibeResult.success || !vibeResult.data) {
        throw new Error(vibeResult.error || 'Vibe analysis failed');
      }
      await this.updateJob(jobId, { progress: 50 });

      // Step 3: Match Style
      await this.updateJob(jobId, { status: 'matching_style', progress: 55 });
      const styleResult = await this.styleAgent.run(vibeResult.data);
      if (!styleResult.success || !styleResult.data) {
        throw new Error(styleResult.error || 'Style matching failed');
      }
      await this.updateJob(jobId, { progress: 70 });

      // Step 4: Find Products
      await this.updateJob(jobId, { status: 'finding_products', progress: 75 });
      const shoppingResult = await this.shoppingAgent.run({
        style: styleResult.data,
        vibe: vibeResult.data,
      });
      if (!shoppingResult.success || !shoppingResult.data) {
        throw new Error(shoppingResult.error || 'Product search failed');
      }
      await this.updateJob(jobId, { progress: 90 });

      // Step 5: Create Lookbook
      const lookbookId = uuidv4();
      const lookbook: Lookbook = {
        _id: lookbookId,
        handle,
        profile,
        vibe: vibeResult.data,
        style: styleResult.data,
        products: shoppingResult.data,
        created_at: new Date(),
      };

      await db.collection('lookbooks').insertOne(lookbook as unknown as Document);

      // Complete!
      await this.updateJob(jobId, {
        status: 'complete',
        progress: 100,
        lookbook_id: lookbookId,
      });

      console.log(`[Orchestrator] Job ${jobId} complete! Lookbook: ${lookbookId}`);

    } catch (error) {
      console.error(`[Orchestrator] Job ${jobId} failed:`, error);
      await this.updateJob(jobId, {
        status: 'error',
        error: String(error),
      });
    }
  }

  private getDemoProfile(handle: string): TwitterProfile {
    // Demo profiles for testing without Apify
    const demoTweets = [
      "Just shipped a new feature at 3am. Sleep is for the weak.",
      "Hot take: TypeScript > JavaScript. Fight me.",
      "The future is agents. Everything will be automated.",
      "Currently obsessed with minimalist design and black coffee.",
      "Why do meetings exist when we have Slack?",
      "Building in public is the way. Transparency wins.",
      "AI is not going to take your job. Someone using AI will.",
      "Startup life: 80 hour weeks but at least I'm my own boss lol",
      "Clean code is a love language.",
      "Just discovered a new coffee shop. Productivity +100%",
    ];

    return {
      handle,
      bio: "Builder. Hacker. Coffee enthusiast. Shipping code and taking names.",
      followers: 5420,
      following: 892,
      tweets: demoTweets,
    };
  }
}

export const orchestrator = new Orchestrator();
