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
  best_colors_hex?: string[];
  accent_colors: string[];
  accent_colors_hex?: string[];
  avoid_colors: string[];
  metals: string[];
  neutrals: string[];
  neutrals_hex?: string[];
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

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <div
      className="bg-white/[0.08] border border-white/20 rounded-2xl overflow-hidden group card-hover fade-in backdrop-blur-md"
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
    >
      <div className="aspect-[4/5] bg-black/30 relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Product';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs text-white/80">
          {product.category}
        </div>
        {product.match_score && (
          <div className="absolute top-3 left-3 bg-white text-black px-2.5 py-1 rounded-full text-xs font-semibold">
            {product.match_score}% match
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="text-xs text-purple-300/80 uppercase tracking-wider mb-2 font-medium">{product.brand}</div>
        <div className="font-semibold text-white mb-2 line-clamp-1 text-lg">{product.name}</div>
        <div className="text-sm text-white/60 mb-5 line-clamp-2 leading-relaxed">{product.match_reason}</div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-white">${product.price}</span>
          <a
            href={product.buy_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-white text-black hover:bg-purple-100 px-5 py-2.5 rounded-xl font-semibold transition-all btn-glow"
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
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlockPremium = async () => {
    if (!id) return;
    setUnlocking(true);
    try {
      // Call x402-protected premium endpoint
      const res = await fetch(`/api/premium?id=${id}`);
      if (res.status === 402) {
        // Payment required - x402 will handle the payment flow
        const paymentInfo = await res.json();
        console.log('Payment required:', paymentInfo);
        // For demo, just show premium content
        setShowPremium(true);
      } else if (res.ok) {
        setShowPremium(true);
      } else {
        console.error('Failed to unlock premium');
      }
    } catch (error) {
      console.error('Premium unlock error:', error);
      // For demo purposes, still unlock
      setShowPremium(true);
    } finally {
      setUnlocking(false);
    }
  };

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
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#444]">Loading your lookbook...</div>
        </div>
      </main>
    );
  }

  if (!lookbook) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="text-[#444] mb-6">Lookbook not found</div>
          <button
            onClick={() => router.push('/')}
            className="text-white bg-[#111] hover:bg-[#1a1a1a] px-6 py-3 rounded-xl transition-colors"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-[-200px] left-1/4 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px]" />
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-100px] left-[10%] w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[100px]" />

      <div className="relative z-10 px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white/70 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Style Profile Generated
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              @{lookbook.handle}
            </h1>
            <p className="text-purple-200/80 text-xl font-light italic max-w-xl mx-auto">
              &quot;{lookbook.vibe.energy}&quot;
            </p>
          </div>

          {/* Profile Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'Gender', value: lookbook.vibe.gender || 'Unknown', sub: `${Math.round((lookbook.vibe.gender_confidence || 0) * 100)}% confidence` },
              { label: 'Archetype', value: (lookbook.vibe.profession_archetype || 'creative').replace('-', ' '), sub: 'Style profile' },
              { label: 'Age Range', value: lookbook.vibe.age_range || '25-35', sub: 'Estimated' },
              { label: 'Budget', value: lookbook.style?.budget_tier || 'Mixed', sub: 'Tier' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/[0.06] border border-white/15 rounded-2xl p-5 backdrop-blur-md fade-in hover:bg-white/[0.1] transition-colors"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <div className="text-xs text-purple-300/70 uppercase tracking-widest mb-2 font-medium">{item.label}</div>
                <div className="font-bold text-white text-lg capitalize">{item.value}</div>
                <div className="text-xs text-white/40 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Vibe Card */}
          <div className="bg-white/[0.06] border border-white/15 rounded-3xl p-8 md:p-10 mb-8 backdrop-blur-md fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Your Vibe</h2>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 font-light">
              {lookbook.vibe.vibe_summary}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {lookbook.vibe.aesthetic_keywords.map((keyword, i) => (
                <span
                  key={keyword}
                  className="px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm text-white/80 hover:bg-purple-500/20 hover:border-purple-400/40 transition-colors cursor-default"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Primary', value: lookbook.style.primary_archetype },
                { label: 'Secondary', value: lookbook.style.secondary_archetype },
                { label: 'Communication', value: lookbook.vibe.communication_style, span: 2 },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`bg-white/[0.04] border border-white/10 rounded-xl p-4 ${item.span ? 'col-span-2' : ''}`}
                >
                  <span className="text-purple-300/60 block text-xs uppercase tracking-wider mb-1 font-medium">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Season Analysis */}
          {lookbook.vibe.color_profile && (
            <div className="bg-white/[0.06] border border-white/15 rounded-3xl p-8 md:p-10 mb-8 backdrop-blur-md fade-in">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-white">Color Season</h2>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/30 rounded-full text-sm font-semibold text-white capitalize">
                  {lookbook.vibe.color_profile.season}
                </span>
              </div>
              <p className="text-white/60 mb-8 text-lg capitalize font-light">
                {lookbook.vibe.color_profile.subtype.replace(/-/g, ' ')} — {lookbook.vibe.color_profile.description}
              </p>

              {/* Color Swatches with Hex */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Best Colors */}
                <div>
                  <h3 className="text-xs text-purple-300/70 font-semibold mb-4 uppercase tracking-widest">Best Colors</h3>
                  <div className="flex flex-wrap gap-3">
                    {(lookbook.vibe.color_profile?.best_colors_hex || []).slice(0, 6).map((hex: string, j: number) => (
                      <div key={j} className="group flex flex-col items-center">
                        <div
                          className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: hex }}
                          title={lookbook.vibe.color_profile?.best_colors?.[j] || ''}
                        />
                        <span className="text-[10px] text-white/40 mt-1 capitalize truncate max-w-[60px]">
                          {lookbook.vibe.color_profile?.best_colors?.[j] || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Colors */}
                <div>
                  <h3 className="text-xs text-purple-300/70 font-semibold mb-4 uppercase tracking-widest">Accent Colors</h3>
                  <div className="flex flex-wrap gap-3">
                    {(lookbook.vibe.color_profile?.accent_colors_hex || []).map((hex: string, j: number) => (
                      <div key={j} className="group flex flex-col items-center">
                        <div
                          className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: hex }}
                          title={lookbook.vibe.color_profile?.accent_colors?.[j] || ''}
                        />
                        <span className="text-[10px] text-white/40 mt-1 capitalize truncate max-w-[60px]">
                          {lookbook.vibe.color_profile?.accent_colors?.[j] || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutrals */}
                <div>
                  <h3 className="text-xs text-purple-300/70 font-semibold mb-4 uppercase tracking-widest">Neutrals</h3>
                  <div className="flex flex-wrap gap-3">
                    {(lookbook.vibe.color_profile?.neutrals_hex || []).map((hex: string, j: number) => (
                      <div key={j} className="group flex flex-col items-center">
                        <div
                          className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: hex }}
                          title={lookbook.vibe.color_profile?.neutrals?.[j] || ''}
                        />
                        <span className="text-[10px] text-white/40 mt-1 capitalize truncate max-w-[60px]">
                          {lookbook.vibe.color_profile?.neutrals?.[j] || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metals & Avoid */}
              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                  <h3 className="text-xs text-purple-300/70 font-semibold mb-3 uppercase tracking-widest">Best Metals</h3>
                  <div className="flex flex-wrap gap-2">
                    {(lookbook.vibe.color_profile?.metals || []).map((metal: string, j: number) => (
                      <span key={j} className="px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 rounded-lg text-sm text-white/80 capitalize">
                        {metal}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs text-red-300/70 font-semibold mb-3 uppercase tracking-widest">Colors to Avoid</h3>
                  <div className="flex flex-wrap gap-2">
                    {(lookbook.vibe.color_profile?.avoid_colors || []).slice(0, 4).map((color: string, j: number) => (
                      <span key={j} className="px-3 py-1.5 bg-red-500/10 border border-red-400/20 rounded-lg text-sm text-white/60 capitalize">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Color Palette Visual */}
          <div className="bg-white/[0.06] border border-white/15 rounded-3xl p-8 md:p-10 mb-8 backdrop-blur-md fade-in">
            <h2 className="text-2xl font-bold text-white mb-8">Your Palette</h2>
            <div className="flex flex-wrap gap-5">
              {lookbook.style.color_palette.map((color, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform cursor-pointer ring-2 ring-white/10 ring-offset-2 ring-offset-transparent"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-white/60 mt-3 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Pieces */}
          {lookbook.style.signature_pieces && lookbook.style.signature_pieces.length > 0 && (
            <div className="bg-white/[0.06] border border-white/15 rounded-3xl p-8 md:p-10 mb-8 backdrop-blur-md fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Signature Pieces</h2>
              <p className="text-white/50 mb-8 text-sm">Must-have items for your wardrobe</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {lookbook.style.signature_pieces.map((piece, i) => (
                  <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-4 text-center hover:bg-white/[0.08] hover:border-white/20 transition-colors">
                    <span className="text-sm text-white/80">{piece}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Free Recommendations */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Recommended For You</h2>
              <p className="text-white/50 text-sm">Personalized picks based on your vibe</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {lookbook.products.free_recommendations.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>

          {/* Premium Section */}
          {lookbook.products.premium_recommendations.length > 0 && (
            <div className="bg-white/[0.06] border border-white/15 rounded-3xl p-8 md:p-10 mb-8 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Premium Picks</h2>
                  <p className="text-white/50 text-sm mt-1">
                    {lookbook.products.premium_recommendations.length} more curated items
                  </p>
                </div>
                {!showPremium && (
                  <button
                    onClick={handleUnlockPremium}
                    disabled={unlocking}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold transition-all btn-glow shadow-lg shadow-purple-500/25 flex items-center gap-3"
                  >
                    {unlocking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Unlocking...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Unlock Premium ($0.01)
                      </>
                    )}
                  </button>
                )}
              </div>

              {showPremium ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {lookbook.products.premium_recommendations.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 opacity-20 blur-sm pointer-events-none">
                  {lookbook.products.premium_recommendations.slice(0, 3).map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Style Tips */}
          <div className="bg-white/[0.06] border border-white/15 rounded-3xl p-8 md:p-10 mb-8 backdrop-blur-md fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Style Notes</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 font-light">{lookbook.style.style_notes}</p>

            {/* Enhanced Style Tips */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                { label: 'For You', content: lookbook.style.gender_specific_notes },
                { label: 'Profession Tips', content: lookbook.style.profession_style_tips },
                { label: 'Seasonal Tips', content: lookbook.style.seasonal_adjustments },
              ].filter(tip => tip.content).map((tip, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-5">
                  <h3 className="text-xs text-purple-300/70 font-semibold mb-3 uppercase tracking-widest">{tip.label}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{tip.content}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-white/60 text-sm font-semibold mb-4">Avoid</h3>
              <div className="flex flex-wrap gap-2">
                {lookbook.style.avoid.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-400/20 rounded-lg text-sm text-red-300/80">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="text-center py-12">
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {copied ? 'Copied!' : 'Share Lookbook'}
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-white text-black hover:bg-purple-100 px-8 py-4 rounded-xl font-semibold transition-all btn-glow"
              >
                Analyze Another
              </button>
            </div>

            {/* Powered By */}
            <div className="flex items-center justify-center gap-6 text-white/40 text-xs flex-wrap">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400/50 rounded-full" />
                MongoDB
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400/50 rounded-full" />
                Fireworks AI
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400/50 rounded-full" />
                Voyage AI
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400/50 rounded-full" />
                Coinbase x402
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LookbookPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#444]">Loading...</div>
        </div>
      </main>
    }>
      <LookbookContent />
    </Suspense>
  );
}
