'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: handle.replace('@', '').trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to start analysis');
      }

      router.push(`/analyze?jobId=${data.jobId}&handle=${data.handle}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 gradient-bg relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Logo / Brand */}
        <div className="fade-in mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-[#888]">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered Style Analysis
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-14 fade-in fade-in-delay-1">
          <p className="text-[#666] text-xl md:text-2xl mb-6 tracking-wide font-light">
            What can you <span className="italic text-[#999] font-normal">wear</span>
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-tight">
            <span className="text-[#888]">Convert your Twitter into</span>
            <br />
            <span className="text-gradient">personalized style</span>
          </h1>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto fade-in fade-in-delay-2">
          <div className={`relative group ${focused ? 'glow' : ''}`}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#444] text-lg font-light">
                @
              </span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="your_twitter_handle"
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl py-5 pl-12 pr-6 text-lg text-white placeholder-[#333] focus:outline-none focus:border-[#333] focus:bg-[#0d0d0d] transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400/90 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !handle.trim()}
            className="w-full mt-5 bg-white text-[#0a0a0a] font-semibold py-5 px-8 rounded-2xl text-lg hover:bg-[#f0f0f0] disabled:opacity-30 disabled:cursor-not-allowed transition-all btn-glow"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Find My Style'
            )}
          </button>

          <p className="text-[#444] text-sm mt-6 font-light">
            We analyze your tweets to understand your vibe and curate clothes that match
          </p>
        </form>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto fade-in fade-in-delay-3">
          {[
            { label: 'Gender Detection', desc: 'Smart inference', icon: '◐' },
            { label: 'Color Season', desc: 'Your palette', icon: '◉' },
            { label: 'Profession Style', desc: 'Context aware', icon: '◈' },
            { label: 'Weather Aware', desc: 'Location based', icon: '◎' },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-[#0a0a0a]/80 border border-[#151515] rounded-2xl p-5 text-left card-hover backdrop-blur-sm"
            >
              <div className="text-[#333] text-2xl mb-3">{feature.icon}</div>
              <div className="text-[#e5e5e5] text-sm font-medium mb-1">{feature.label}</div>
              <div className="text-[#555] text-xs">{feature.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-24 fade-in fade-in-delay-4">
          <div className="flex items-center justify-center gap-6 text-[#333] text-xs">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#333] rounded-full" />
              MongoDB
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#333] rounded-full" />
              Fireworks AI
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#333] rounded-full" />
              Voyage AI
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
