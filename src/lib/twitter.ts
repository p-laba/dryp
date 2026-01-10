import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

export interface TwitterProfile {
  handle: string;
  bio: string;
  followers: number;
  following: number;
  tweets: string[];
  location?: string;
  profile_image_url?: string;
  name?: string;
}

export async function scrapeTwitterProfile(handle: string): Promise<TwitterProfile> {
  // Remove @ if present
  const cleanHandle = handle.replace('@', '').trim();

  console.log(`[Twitter] Scraping @${cleanHandle}...`);

  // Run the Twitter scraper actor
  const run = await client.actor('quacker/twitter-scraper').call({
    startUrls: [`https://twitter.com/${cleanHandle}`],
    tweetsDesired: 30,
    includeUserInfo: true,
  }, {
    timeout: 60, // 60 second timeout
  });

  // Get results from dataset
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  if (!items || items.length === 0) {
    throw new Error(`Could not find Twitter profile: @${cleanHandle}`);
  }

  // Extract profile data
  const userInfo = (items[0] as Record<string, unknown>)?.user as Record<string, unknown> || {};
  const tweets = items
    .filter((item: Record<string, unknown>) => item.full_text)
    .map((item: Record<string, unknown>) => item.full_text as string)
    .slice(0, 30);

  console.log(`[Twitter] Found ${tweets.length} tweets for @${cleanHandle}`);

  return {
    handle: cleanHandle,
    bio: (userInfo.description as string) || '',
    followers: (userInfo.followers_count as number) || 0,
    following: (userInfo.friends_count as number) || 0,
    tweets,
  };
}

// Fallback: Manual input mode (for demo without Apify)
export function parseManualInput(input: string, handle: string = 'demo_user'): TwitterProfile {
  const tweets = input
    .split('\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  return {
    handle,
    bio: tweets[0]?.slice(0, 160) || '',
    followers: 1000,
    following: 500,
    tweets,
  };
}
