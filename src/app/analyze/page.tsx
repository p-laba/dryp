'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface JobStatus {
  _id: string;
  handle: string;
  status: string;
  progress: number;
  error?: string;
  lookbook_id?: string;
}

const STATUS_MESSAGES: Record<string, string> = {
  pending: 'Starting analysis...',
  scraping: 'Reading your tweets...',
  analyzing_vibe: 'Understanding your vibe...',
  matching_style: 'Matching style archetypes...',
  finding_products: 'Finding perfect pieces...',
  complete: 'Your lookbook is ready!',
  error: 'Something went wrong',
};

const STATUS_ICONS: Record<string, string> = {
  pending: '⏳',
  scraping: '🔍',
  analyzing_vibe: '🧠',
  matching_style: '🎨',
  finding_products: '🛒',
  complete: '✨',
  error: '❌',
};

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('jobId');
  const handle = searchParams.get('handle');

  const [job, setJob] = useState<JobStatus | null>(null);

  useEffect(() => {
    if (!jobId) {
      router.push('/');
      return;
    }

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/status?jobId=${jobId}`);
        const data = await res.json();
        setJob(data);

        if (data.status === 'complete' && data.lookbook_id) {
          // Small delay for UX
          setTimeout(() => {
            router.push(`/lookbook?id=${data.lookbook_id}`);
          }, 1500);
        } else if (data.status !== 'error') {
          setTimeout(pollStatus, 1000);
        }
      } catch (error) {
        console.error('Poll error:', error);
        setTimeout(pollStatus, 2000);
      }
    };

    pollStatus();
  }, [jobId, router]);

  const getAgentStatus = (threshold: number, workingThreshold: number) => {
    if (!job) return 'waiting';
    if (job.progress >= threshold) return 'complete';
    if (job.progress >= workingThreshold) return 'working';
    return 'waiting';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-400';
      case 'working': return 'text-yellow-400 animate-pulse';
      default: return 'text-gray-600';
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="text-7xl mb-8 animate-bounce">
          {job ? STATUS_ICONS[job.status] || '👔' : '👔'}
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Analyzing @{handle || '...'}
        </h2>

        {/* Status Message */}
        <p className="text-gray-400 mb-8 text-lg">
          {job ? STATUS_MESSAGES[job.status] : 'Loading...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${job?.progress || 0}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 mb-12">
          {job?.progress || 0}% complete
        </p>

        {/* Agent Activity */}
        <div className="bg-gray-900 rounded-xl p-6 text-left">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
            Agent Activity
          </h3>
          <div className="space-y-3">
            <div className={`flex items-center gap-3 ${getStatusClass(getAgentStatus(25, 10))}`}>
              <span>🔍</span>
              <span>Scraper Agent</span>
              <span className="ml-auto text-xs">
                {getAgentStatus(25, 10) === 'complete' ? '✓' : getAgentStatus(25, 10) === 'working' ? '...' : '○'}
              </span>
            </div>
            <div className={`flex items-center gap-3 ${getStatusClass(getAgentStatus(50, 30))}`}>
              <span>🧠</span>
              <span>Vibe Agent</span>
              <span className="ml-auto text-xs">
                {getAgentStatus(50, 30) === 'complete' ? '✓' : getAgentStatus(50, 30) === 'working' ? '...' : '○'}
              </span>
            </div>
            <div className={`flex items-center gap-3 ${getStatusClass(getAgentStatus(70, 55))}`}>
              <span>🎨</span>
              <span>Style Agent</span>
              <span className="ml-auto text-xs">
                {getAgentStatus(70, 55) === 'complete' ? '✓' : getAgentStatus(70, 55) === 'working' ? '...' : '○'}
              </span>
            </div>
            <div className={`flex items-center gap-3 ${getStatusClass(getAgentStatus(90, 75))}`}>
              <span>🛒</span>
              <span>Shopping Agent</span>
              <span className="ml-auto text-xs">
                {getAgentStatus(90, 75) === 'complete' ? '✓' : getAgentStatus(90, 75) === 'working' ? '...' : '○'}
              </span>
            </div>
          </div>
        </div>

        {/* Error State */}
        {job?.status === 'error' && (
          <div className="mt-8 p-4 bg-red-900/30 border border-red-800 rounded-xl">
            <p className="text-red-400 mb-4">{job.error}</p>
            <button
              onClick={() => router.push('/')}
              className="text-sm text-white underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </main>
    }>
      <AnalyzeContent />
    </Suspense>
  );
}
