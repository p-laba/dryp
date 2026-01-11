const { ApifyClient } = require('apify-client');
require('dotenv').config({ path: '.env.local' });

async function testApify() {
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    console.error('❌ APIFY_API_TOKEN is not defined in .env.local');
    process.exit(1);
  }

  const client = new ApifyClient({ token });
  const testHandle = 'elonmusk'; // A public account to test with

  console.log(`🔄 Testing Apify with @${testHandle}...`);
  console.log('   This may take 30-60 seconds...\n');

  try {
    // Try different input formats based on common Apify Twitter scraper patterns
    const run = await client.actor('quacker/twitter-scraper').call({
      startUrls: [{ url: `https://twitter.com/${testHandle}` }],
      tweetsDesired: 5,
      includeUserInfo: true,
    }, {
      timeout: 120,
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      console.error('❌ No data returned from Apify');
      process.exit(1);
    }

    const userInfo = items[0]?.user || {};
    const tweets = items
      .filter(item => item.full_text)
      .map(item => item.full_text)
      .slice(0, 5);

    console.log('✅ Apify is working!\n');
    console.log('📊 Profile Data:');
    console.log(`   Name: ${userInfo.name || 'N/A'}`);
    console.log(`   Handle: @${testHandle}`);
    console.log(`   Followers: ${userInfo.followers_count?.toLocaleString() || 'N/A'}`);
    console.log(`   Bio: ${(userInfo.description || 'N/A').slice(0, 100)}...`);
    console.log(`\n📝 Sample Tweets (${tweets.length}):`);
    tweets.forEach((tweet, i) => {
      console.log(`   ${i + 1}. ${tweet.slice(0, 80)}...`);
    });

  } catch (error) {
    console.error('❌ Apify test failed:', error.message);
    if (error.message.includes('timeout')) {
      console.log('\n💡 The actor timed out. This could mean:');
      console.log('   - The Twitter scraper is rate limited');
      console.log('   - Try again in a few minutes');
    }
    process.exit(1);
  }
}

testApify();
