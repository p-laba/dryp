'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  buy_link: string;
  match_reason: string;
  match_score?: number;
  gender_match?: boolean;
  color_match?: boolean;
  season_appropriate?: boolean;
}

interface ColorProfile {
  season: string;
  subtype: string;
  undertone: string;
  best_colors: string[];
  accent_colors: string[];
  avoid_colors: string[];
  metals: string[];
  neutrals: string[];
  description: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  season: string;
}

interface SeasonalRecommendation {
  season: string;
  clothing_weight: string;
  fabric_suggestions: string[];
  style_notes: string;
}

interface Lookbook {
  _id: string;
  handle: string;
  vibe: {
    personality_traits: string[];
    interests: string[];
    communication_style: string;
    aesthetic_keywords: string[];
    energy: string;
    vibe_summary: string;
    gender: string;
    gender_confidence: number;
    age_range: string;
    profession_archetype: string;
    location_detected: string | null;
    weather?: WeatherData;
    seasonal_recommendations?: SeasonalRecommendation;
    color_profile?: ColorProfile;
    inferred_appearance?: {
      hair_color_guess: string | null;
      eye_color_guess: string | null;
      skin_tone_guess: string | null;
      undertone_guess: string;
      style_era_preference: string;
    };
  };
  style: {
    primary_archetype: string;
    secondary_archetype: string;
    color_palette: string[];
    style_notes: string;
    avoid: string[];
    gender_specific_notes?: string;
    profession_style_tips?: string;
    seasonal_adjustments?: string;
    color_season_palette?: string[];
    budget_tier?: string;
    signature_pieces?: string[];
  };
  products: {
    free_recommendations: Product[];
    premium_recommendations: Product[];
    outfit_suggestions?: {
      name: string;
      occasion: string;
      products: string[];
      styling_tip: string;
    }[];
  };
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden group hover:ring-2 hover:ring-purple-500 transition-all">
      <div className="aspect-square bg-gray-700 relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Product';
          }}
        />
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
          {product.category}
        </div>
        {product.match_score && (
          <div className="absolute top-2 left-2 bg-purple-600/90 px-2 py-1 rounded text-xs font-bold">
            {product.match_score}% match
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {product.gender_match && (
            <span className="bg-green-600/80 px-1.5 py-0.5 rounded text-xs">gender</span>
          )}
          {product.color_match && (
            <span className="bg-blue-600/80 px-1.5 py-0.5 rounded text-xs">color</span>
          )}
          {product.season_appropriate && (
            <span className="bg-orange-600/80 px-1.5 py-0.5 rounded text-xs">season</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-purple-400 mb-1">{product.brand}</div>
        <div className="font-semibold mb-2 line-clamp-1">{product.name}</div>
        <div className="text-sm text-gray-400 mb-3 line-clamp-2">{product.match_reason}</div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">${product.price}</span>
          <a
            href={product.buy_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg transition-colors"
          >
            Shop
          </a>
        </div>
      </div>
    </div>
  );
}

function LookbookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [lookbook, setLookbook] = useState<Lookbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPremium, setShowPremium] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push('/');
      return;
    }

    fetch(`/api/lookbook?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setLookbook(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-4">DRIP</div>
          <div className="animate-pulse">Loading your lookbook...</div>
        </div>
      </main>
    );
  }

  if (!lookbook) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">:/</div>
          <div className="text-gray-400 mb-4">Lookbook not found</div>
          <button
            onClick={() => router.push('/')}
            className="text-purple-400 underline"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  const professionEmoji: Record<string, string> = {
    'tech-founder': 'rocket',
    'developer': 'computer',
    'creative': 'art',
    'finance': 'chart',
    'influencer': 'sparkles',
    'academic': 'books',
    'artist': 'palette',
    'entrepreneur': 'briefcase',
    'athlete': 'running',
    'general': 'person',
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4 font-black tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            DRIP
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            @{lookbook.handle}&apos;s Style Profile
          </h1>
          <p className="text-xl text-gray-400 italic">&quot;{lookbook.vibe.energy}&quot;</p>
        </div>

        {/* Profile Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-xl p-4">
            <div className="text-xs text-purple-400 uppercase tracking-wider mb-1">Gender</div>
            <div className="font-bold text-lg capitalize">{lookbook.vibe.gender || 'Unknown'}</div>
            <div className="text-xs text-gray-500">{Math.round((lookbook.vibe.gender_confidence || 0) * 100)}% confidence</div>
          </div>
          <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 border border-pink-700/30 rounded-xl p-4">
            <div className="text-xs text-pink-400 uppercase tracking-wider mb-1">Archetype</div>
            <div className="font-bold text-lg capitalize">{(lookbook.vibe.profession_archetype || 'creative').replace('-', ' ')}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-xl p-4">
            <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">Age Range</div>
            <div className="font-bold text-lg">{lookbook.vibe.age_range || '25-35'}</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-xl p-4">
            <div className="text-xs text-green-400 uppercase tracking-wider mb-1">Budget Tier</div>
            <div className="font-bold text-lg capitalize">{lookbook.style?.budget_tier || 'Mixed'}</div>
          </div>
        </div>

        {/* Weather & Location (if available) */}
        {lookbook.vibe.weather && (
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/30 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-cyan-400 uppercase tracking-wider mb-1">Location & Weather</div>
                <div className="font-bold">{lookbook.vibe.weather.location}</div>
                <div className="text-gray-400 text-sm">
                  {lookbook.vibe.weather.temperature}C | {lookbook.vibe.weather.condition}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl">
                  {lookbook.vibe.weather.condition.toLowerCase().includes('sun') ? 'SUN' :
                   lookbook.vibe.weather.condition.toLowerCase().includes('rain') ? 'RAIN' :
                   lookbook.vibe.weather.condition.toLowerCase().includes('cloud') ? 'CLOUD' : '-'}
                </div>
                <div className="text-xs text-gray-500 capitalize">{lookbook.vibe.seasonal_recommendations?.clothing_weight} layers</div>
              </div>
            </div>
          </div>
        )}

        {/* Vibe Card */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800/50 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Vibe</h2>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {lookbook.vibe.vibe_summary}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {lookbook.vibe.aesthetic_keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-purple-900/50 border border-purple-700 rounded-full text-sm text-purple-300"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-black/30 rounded-lg p-3">
              <span className="text-gray-500 block text-xs mb-1">Primary Style</span>
              <span className="font-semibold text-purple-400">
                {lookbook.style.primary_archetype}
              </span>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <span className="text-gray-500 block text-xs mb-1">Secondary</span>
              <span className="font-semibold text-pink-400">
                {lookbook.style.secondary_archetype}
              </span>
            </div>
            <div className="bg-black/30 rounded-lg p-3 col-span-2">
              <span className="text-gray-500 block text-xs mb-1">Communication</span>
              <span className="font-medium text-gray-300">
                {lookbook.vibe.communication_style}
              </span>
            </div>
          </div>
        </div>

        {/* Color Season Analysis */}
        {lookbook.vibe.color_profile && (
          <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-2">Your Color Season</h2>
            <p className="text-gray-400 mb-6 capitalize">
              {lookbook.vibe.color_profile.subtype.replace('-', ' ')} - {lookbook.vibe.color_profile.description}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-green-400 font-semibold mb-3 uppercase tracking-wider">Best Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {lookbook.vibe.color_profile.best_colors.slice(0, 6).map((color, i) => (
                    <span key={i} className="px-2 py-1 bg-green-900/30 border border-green-700/30 rounded text-sm">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-yellow-400 font-semibold mb-3 uppercase tracking-wider">Accent Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {lookbook.vibe.color_profile.accent_colors.map((color, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-900/30 border border-yellow-700/30 rounded text-sm">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 font-semibold mb-3 uppercase tracking-wider">Best Metals</h3>
                <div className="flex flex-wrap gap-2">
                  {lookbook.vibe.color_profile.metals.map((metal, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm capitalize">
                      {metal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Color Palette */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Palette</h2>
          <div className="flex flex-wrap gap-4">
            {lookbook.style.color_palette.map((color, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl shadow-lg border-2 border-gray-700"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-500 mt-2 font-mono">{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Pieces */}
        {lookbook.style.signature_pieces && lookbook.style.signature_pieces.length > 0 && (
          <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-700/30 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Signature Pieces</h2>
            <p className="text-gray-400 mb-4 text-sm">Must-have items for your wardrobe</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {lookbook.style.signature_pieces.map((piece, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-3 text-center">
                  <span className="text-sm">{piece}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Recommended For You</h2>
          <p className="text-gray-400 mb-6 text-sm">Personalized picks based on your vibe, gender, and style</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lookbook.products.free_recommendations.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        {/* Premium Section */}
        {lookbook.products.premium_recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-700/50 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold">Premium Picks</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {lookbook.products.premium_recommendations.length} more curated items
                </p>
              </div>
              {!showPremium && (
                <button
                  onClick={() => setShowPremium(true)}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  Unlock Premium
                </button>
              )}
            </div>

            {showPremium ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lookbook.products.premium_recommendations.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 blur-sm pointer-events-none">
                {lookbook.products.premium_recommendations.slice(0, 3).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Style Tips */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Style Notes</h2>
          <p className="text-gray-300 text-lg mb-6">{lookbook.style.style_notes}</p>

          {/* Enhanced Style Tips */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {lookbook.style.gender_specific_notes && (
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                <h3 className="text-sm text-purple-400 font-semibold mb-2 uppercase tracking-wider">For You</h3>
                <p className="text-gray-300 text-sm">{lookbook.style.gender_specific_notes}</p>
              </div>
            )}
            {lookbook.style.profession_style_tips && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <h3 className="text-sm text-blue-400 font-semibold mb-2 uppercase tracking-wider">Profession Tips</h3>
                <p className="text-gray-300 text-sm">{lookbook.style.profession_style_tips}</p>
              </div>
            )}
            {lookbook.style.seasonal_adjustments && (
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                <h3 className="text-sm text-green-400 font-semibold mb-2 uppercase tracking-wider">Seasonal Tips</h3>
                <p className="text-gray-300 text-sm">{lookbook.style.seasonal_adjustments}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 pt-4">
            <h3 className="font-bold text-red-400 mb-2">Avoid</h3>
            <ul className="text-gray-400 space-y-1">
              {lookbook.style.avoid.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-red-500">-</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={`px-6 py-3 rounded-xl mr-4 transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl transition-colors"
          >
            Analyze Another
          </button>
        </div>

        {/* Powered By */}
        <div className="text-center text-xs text-gray-600 pb-8">
          Powered by MongoDB | Fireworks AI | Voyage AI | Coinbase
        </div>
      </div>
    </main>
  );
}

export default function LookbookPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading lookbook...</div>
      </main>
    }>
      <LookbookContent />
    </Suspense>
  );
}
