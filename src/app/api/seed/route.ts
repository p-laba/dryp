import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ARCHETYPES, PRODUCTS } from '@/data/seed';
import { Document } from 'mongodb';

export async function POST() {
  try {
    const db = await getDb();

    console.log('[Seed] Starting database seed...');

    // Clear existing data
    await db.collection('archetypes').deleteMany({});
    await db.collection('products').deleteMany({});

    // Insert archetypes
    if (ARCHETYPES.length > 0) {
      await db.collection('archetypes').insertMany(ARCHETYPES as unknown as Document[]);
      console.log(`[Seed] Inserted ${ARCHETYPES.length} archetypes`);
    }

    // Insert products
    if (PRODUCTS.length > 0) {
      await db.collection('products').insertMany(PRODUCTS as unknown as Document[]);
      console.log(`[Seed] Inserted ${PRODUCTS.length} products`);
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      archetypes: ARCHETYPES.length,
      products: PRODUCTS.length,
    });
  } catch (error) {
    console.error('[Seed] Error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();

    const archetypeCount = await db.collection('archetypes').countDocuments();
    const productCount = await db.collection('products').countDocuments();

    return NextResponse.json({
      archetypes: archetypeCount,
      products: productCount,
      seeded: archetypeCount > 0 && productCount > 0,
    });
  } catch (error) {
    console.error('[Seed] Error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
