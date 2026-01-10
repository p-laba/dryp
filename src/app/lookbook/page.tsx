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
  };
  style: {
    primary_archetype: string;
    secondary_archetype: string;
    color_palette: string[];
    style_notes: string;
    avoid: string[];
  };
  products: {
    free_recommendations: Product[];
    premium_recommendations: Product[];
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
            Shop →
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
          <div className="text-4xl animate-bounce mb-4">👔</div>
          <div className="animate-pulse">Loading your lookbook...</div>
        </div>
      </main>
    );
  }

  if (!lookbook) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
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

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            @{lookbook.handle}&apos;s Drip
          </h1>
          <p className="text-xl text-gray-400 italic">&quot;{lookbook.vibe.energy}&quot;</p>
        </div>

        {/* Vibe Card */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800/50 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>🧠</span> Your Vibe
          </h2>
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

        {/* Color Palette */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>🎨</span> Your Colors
          </h2>
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

        {/* Free Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>👕</span> Recommended For You
          </h2>
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
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span>⭐</span> Premium Picks
                </h2>
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
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span> Style Notes
          </h2>
          <p className="text-gray-300 text-lg mb-6">{lookbook.style.style_notes}</p>

          <div className="border-t border-gray-800 pt-4">
            <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
              <span>🚫</span> Avoid
            </h3>
            <ul className="text-gray-400 space-y-1">
              {lookbook.style.avoid.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-red-500">•</span> {item}
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
              alert('Link copied!');
            }}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl mr-4 transition-colors"
          >
            Share 🔗
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
