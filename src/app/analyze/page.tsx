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

const AGENTS = [
  { name: 'Scraper Agent', desc: 'Collecting tweets', threshold: 25, working: 10 },
  { name: 'Vibe Agent', desc: 'Analyzing personality', threshold: 50, working: 30 },
  { name: 'Style Agent', desc: 'Matching archetypes', threshold: 70, working: 55 },
  { name: 'Shopping Agent', desc: 'Finding products', threshold: 90, working: 75 },
];

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
          setTimeout(() => {
            router.push(`/lookbook?id=${data.lookbook_id}`);
          }, 1000);
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

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 gradient-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl float" />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Handle */}
        <div className="fade-in">
          <p className="text-[#444] text-sm mb-3 tracking-widest uppercase font-light">Analyzing</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-10">
            @{handle || '...'}
          </h2>
        </div>

        {/* Status Message */}
        <p className="text-[#666] mb-12 text-xl font-light fade-in fade-in-delay-1">
          {job ? STATUS_MESSAGES[job.status] : 'Initializing...'}
        </p>

        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-12 fade-in fade-in-delay-2">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#111"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(job?.progress || 0) * 2.83} 283`}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-white">{job?.progress || 0}%</span>
          </div>
        </div>

        {/* Agent Activity */}
        <div className="bg-[#0a0a0a]/80 border border-[#151515] rounded-2xl p-6 text-left backdrop-blur-sm fade-in fade-in-delay-3">
          <h3 className="text-[#444] text-xs font-medium mb-6 uppercase tracking-widest">
            Agent Activity
          </h3>
          <div className="space-y-4">
            {AGENTS.map((agent, i) => {
              const status = getAgentStatus(agent.threshold, agent.working);
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between py-2 border-b border-[#111] last:border-0 transition-all ${
                    status === 'complete' ? 'opacity-100' :
                    status === 'working' ? 'opacity-100' :
                    'opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full transition-all ${
                      status === 'complete' ? 'bg-green-400' :
                      status === 'working' ? 'bg-white animate-pulse' :
                      'bg-[#333]'
                    }`} />
                    <div>
                      <span className="text-sm text-white">{agent.name}</span>
                      <span className="text-xs text-[#444] ml-2">{agent.desc}</span>
                    </div>
                  </div>
                  <span className="text-sm">
                    {status === 'complete' && (
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {status === 'working' && (
                      <span className="text-white/60">...</span>
                    )}
                    {status === 'waiting' && (
                      <span className="text-[#333]">-</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error State */}
        {job?.status === 'error' && (
          <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl fade-in">
            <h3 className="text-red-400 font-medium mb-2">Analysis Failed</h3>
            <p className="text-[#666] text-sm mb-6">{job.error || 'Something went wrong.'}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="text-sm bg-[#111] hover:bg-[#1a1a1a] border border-[#222] px-5 py-2.5 rounded-xl transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-sm bg-white text-black hover:bg-[#e5e5e5] px-5 py-2.5 rounded-xl font-medium transition-colors btn-glow"
              >
                Try Different Handle
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="mt-16 text-[#333] text-xs font-light">
          Analysis takes 30-60 seconds
        </p>
      </div>
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#444]">Loading...</div>
        </div>
      </main>
    }>
      <AnalyzeContent />
    </Suspense>
  );
}
