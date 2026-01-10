import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/agents/orchestrator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId required' },
        { status: 400 }
      );
    }

    const job = await orchestrator.getJobStatus(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('[API] Status error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
