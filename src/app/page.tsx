'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-6">
          <span className="text-6xl">👔</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          DRIP AGENT
        </h1>

        <p className="text-xl text-gray-400 mb-12">
          Your Twitter personality → Your perfect wardrobe
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
              @
            </span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="your_twitter_handle"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl py-4 px-12 text-xl focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !handle.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl text-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Find My Drip'
            )}
          </button>
        </form>

        {/* How it works */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-500">
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-medium text-gray-300">Scrape</div>
            <div className="text-xs mt-1">Reads your tweets</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="text-2xl mb-2">🧠</div>
            <div className="font-medium text-gray-300">Analyze</div>
            <div className="text-xs mt-1">Understands your vibe</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-medium text-gray-300">Match</div>
            <div className="text-xs mt-1">Maps to style archetypes</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-medium text-gray-300">Shop</div>
            <div className="text-xs mt-1">Finds perfect pieces</div>
          </div>
        </div>

        {/* Sponsors */}
        <div className="mt-16 text-xs text-gray-600">
          Powered by MongoDB | Fireworks AI | Voyage AI | Coinbase
        </div>
      </div>
    </main>
  );
}
