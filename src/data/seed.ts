import { MongoClient, Document } from 'mongodb';

const ARCHETYPES = [
  {
    _id: 'techwear',
    name: 'Techwear',
    description: 'Functional, futuristic clothing with technical fabrics. Urban ninja aesthetic.',
    keywords: ['tech', 'functional', 'futuristic', 'minimal', 'black', 'urban', 'ninja', 'cyberpunk'],
    color_palettes: [['#000000', '#1a1a1a', '#333333', '#00ff00']],
    example_brands: ['Acronym', "Arc'teryx Veilance", 'Stone Island Shadow Project', 'Y-3'],
  },
  {
    _id: 'quiet-luxury',
    name: 'Quiet Luxury',
    description: 'Understated elegance. Quality over logos. The old money aesthetic.',
    keywords: ['elegant', 'understated', 'quality', 'timeless', 'neutral', 'sophisticated', 'refined'],
    color_palettes: [['#f5f5dc', '#d4c5a9', '#8b7355', '#2f2f2f']],
    example_brands: ['The Row', 'Loro Piana', 'Brunello Cucinelli', 'Zegna'],
  },
  {
    _id: 'streetwear',
    name: 'Streetwear',
    description: 'Bold, expressive, culture-driven. Sneakers, hoodies, statement pieces.',
    keywords: ['bold', 'expressive', 'hype', 'sneakers', 'graphic', 'urban', 'culture', 'drops'],
    color_palettes: [['#ff0000', '#000000', '#ffffff', '#ffd700']],
    example_brands: ['Supreme', 'Off-White', 'A Bathing Ape', 'Stüssy'],
  },
  {
    _id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines, neutral colors, capsule wardrobe mentality.',
    keywords: ['clean', 'simple', 'neutral', 'capsule', 'essential', 'modern', 'scandinavian'],
    color_palettes: [['#ffffff', '#f0f0f0', '#000000', '#808080']],
    example_brands: ['COS', 'Everlane', 'Uniqlo U', 'Arket'],
  },
  {
    _id: 'avant-garde',
    name: 'Avant-Garde',
    description: 'Experimental, artistic, boundary-pushing fashion as art.',
    keywords: ['experimental', 'artistic', 'deconstructed', 'asymmetric', 'dramatic', 'unique'],
    color_palettes: [['#000000', '#ffffff', '#8b0000', '#4a4a4a']],
    example_brands: ['Rick Owens', 'Comme des Garçons', 'Yohji Yamamoto', 'Maison Margiela'],
  },
  {
    _id: 'classic-prep',
    name: 'Classic Prep',
    description: 'Timeless Ivy League style. Polo shirts, chinos, boat shoes.',
    keywords: ['preppy', 'classic', 'ivy', 'traditional', 'collegiate', 'nautical', 'conservative'],
    color_palettes: [['#1e3a5f', '#ffffff', '#8b0000', '#f0e68c']],
    example_brands: ['Ralph Lauren', 'Brooks Brothers', 'J.Crew', 'Vineyard Vines'],
  },
  {
    _id: 'athleisure',
    name: 'Athleisure',
    description: 'Performance meets lifestyle. Gym-to-street versatility.',
    keywords: ['athletic', 'comfortable', 'sporty', 'performance', 'casual', 'active'],
    color_palettes: [['#000000', '#ffffff', '#ff6b35', '#4ecdc4']],
    example_brands: ['Lululemon', 'Nike', 'Alo Yoga', 'Outdoor Voices'],
  },
];

const PRODUCTS = [
  // Techwear
  {
    _id: 'acronym-j1a',
    name: 'J1A-GTKP Jacket',
    brand: 'Acronym',
    category: 'Outerwear',
    price: 1800,
    style_archetypes: ['techwear', 'avant-garde'],
    description: 'The iconic Acronym jacket. GORE-TEX Pro, modular design, urban armor.',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    buy_link: 'https://acrnm.com/',
  },
  {
    _id: 'arcteryx-veilance-blazer',
    name: 'Veilance Indisce Blazer',
    brand: "Arc'teryx Veilance",
    category: 'Outerwear',
    price: 850,
    style_archetypes: ['techwear', 'minimalist', 'quiet-luxury'],
    description: 'Technical blazer that works in the boardroom and the rain.',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    buy_link: 'https://veilance.com/',
  },
  {
    _id: 'nike-acg-pants',
    name: 'ACG Cargo Pants',
    brand: 'Nike ACG',
    category: 'Bottoms',
    price: 180,
    style_archetypes: ['techwear', 'streetwear', 'athleisure'],
    description: 'Trail-ready cargos with urban appeal. Durable and functional.',
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    buy_link: 'https://nike.com/',
  },
  // Quiet Luxury
  {
    _id: 'the-row-cashmere',
    name: 'Cashmere Crew Sweater',
    brand: 'The Row',
    category: 'Tops',
    price: 1290,
    style_archetypes: ['quiet-luxury', 'minimalist'],
    description: 'Whisper-soft cashmere. No logos, just quality you can feel.',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    buy_link: 'https://therow.com/',
  },
  {
    _id: 'loro-piana-loafers',
    name: 'Summer Walk Loafers',
    brand: 'Loro Piana',
    category: 'Footwear',
    price: 895,
    style_archetypes: ['quiet-luxury', 'classic-prep'],
    description: 'The ultimate quiet flex. IYKYK.',
    image_url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400',
    buy_link: 'https://loropiana.com/',
  },
  // Streetwear
  {
    _id: 'supreme-box-logo',
    name: 'Box Logo Hoodie',
    brand: 'Supreme',
    category: 'Tops',
    price: 168,
    style_archetypes: ['streetwear'],
    description: 'The grail. Box logo speaks for itself.',
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    buy_link: 'https://supremenewyork.com/',
  },
  {
    _id: 'jordan-1-chicago',
    name: 'Air Jordan 1 Retro High OG',
    brand: 'Nike/Jordan',
    category: 'Footwear',
    price: 180,
    style_archetypes: ['streetwear', 'athleisure'],
    description: 'The most iconic sneaker ever made. Period.',
    image_url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
    buy_link: 'https://nike.com/',
  },
  {
    _id: 'stussy-tee',
    name: 'Basic Logo Tee',
    brand: 'Stüssy',
    category: 'Tops',
    price: 45,
    style_archetypes: ['streetwear', 'minimalist'],
    description: 'OG streetwear staple. Simple but unmistakable.',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
    buy_link: 'https://stussy.com/',
  },
  // Minimalist
  {
    _id: 'cos-wool-coat',
    name: 'Wool Blend Overcoat',
    brand: 'COS',
    category: 'Outerwear',
    price: 290,
    style_archetypes: ['minimalist', 'quiet-luxury'],
    description: 'Clean lines, impeccable fit, works with everything.',
    image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
    buy_link: 'https://cos.com/',
  },
  {
    _id: 'common-projects-achilles',
    name: 'Original Achilles Low',
    brand: 'Common Projects',
    category: 'Footwear',
    price: 425,
    style_archetypes: ['minimalist', 'quiet-luxury', 'techwear'],
    description: 'The perfect white sneaker. Gold numbers only.',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    buy_link: 'https://commonprojects.com/',
  },
  {
    _id: 'uniqlo-u-tee',
    name: 'U Crew Neck T-Shirt',
    brand: 'Uniqlo U',
    category: 'Tops',
    price: 20,
    style_archetypes: ['minimalist', 'streetwear', 'techwear'],
    description: 'Lemaire-designed basics. Best tee for the price.',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    buy_link: 'https://uniqlo.com/',
  },
  // Avant-Garde
  {
    _id: 'rick-owens-ramones',
    name: 'Ramones High-Top',
    brand: 'Rick Owens',
    category: 'Footwear',
    price: 1150,
    style_archetypes: ['avant-garde', 'streetwear'],
    description: 'Chunky, dark, unmistakably Rick.',
    image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    buy_link: 'https://rickowens.eu/',
  },
  {
    _id: 'cdg-play-tee',
    name: 'Play Heart Logo T-Shirt',
    brand: 'Comme des Garçons',
    category: 'Tops',
    price: 125,
    style_archetypes: ['avant-garde', 'streetwear'],
    description: 'Entry point to CDG. The heart knows.',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
    buy_link: 'https://comme-des-garcons.com/',
  },
  // More budget options
  {
    _id: 'carhartt-wip-jacket',
    name: 'Michigan Chore Coat',
    brand: 'Carhartt WIP',
    category: 'Outerwear',
    price: 215,
    style_archetypes: ['streetwear', 'minimalist'],
    description: 'Workwear heritage meets streetwear cool.',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    buy_link: 'https://carhartt-wip.com/',
  },
  {
    _id: 'everlane-chinos',
    name: 'Performance Chino',
    brand: 'Everlane',
    category: 'Bottoms',
    price: 78,
    style_archetypes: ['minimalist', 'classic-prep'],
    description: 'Stretchy, breathable, looks good everywhere.',
    image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    buy_link: 'https://everlane.com/',
  },
  {
    _id: 'new-balance-990',
    name: '990v6 Made in USA',
    brand: 'New Balance',
    category: 'Footwear',
    price: 200,
    style_archetypes: ['minimalist', 'quiet-luxury', 'athleisure'],
    description: 'Dad shoe that became a fashion icon. Grey is the new black.',
    image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400',
    buy_link: 'https://newbalance.com/',
  },
];

export async function seedDatabase(uri: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('drip-agent');

    console.log('🌱 Seeding database...');

    // Clear existing data
    await db.collection('archetypes').deleteMany({});
    await db.collection('products').deleteMany({});

    // Insert archetypes
    await db.collection('archetypes').insertMany(ARCHETYPES as unknown as Document[]);
    console.log(`✅ Inserted ${ARCHETYPES.length} archetypes`);

    // Insert products
    await db.collection('products').insertMany(PRODUCTS as unknown as Document[]);
    console.log(`✅ Inserted ${PRODUCTS.length} products`);

    console.log('\n🎉 Database seeded successfully!');

  } finally {
    await client.close();
  }
}

// Export for API route
export { ARCHETYPES, PRODUCTS };
