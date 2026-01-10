const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  console.log('🔄 Attempting to connect to MongoDB...');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB!');

    // List databases
    const dbs = await client.db().admin().listDatabases();
    console.log('\n📁 Available databases:');
    dbs.databases.forEach(db => console.log(`   - ${db.name}`));

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();
