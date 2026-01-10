import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/agents/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { handle, directInput } = body;

    if (!handle && !directInput) {
      return NextResponse.json(
        { error: 'Handle or directInput required' },
        { status: 400 }
      );
    }

    const cleanHandle = (handle || 'demo_user').replace('@', '').trim();

    console.log(`[API] Starting analysis for @${cleanHandle}`);

    const jobId = await orchestrator.startAnalysis(cleanHandle, directInput);

    return NextResponse.json({ jobId, handle: cleanHandle });
  } catch (error) {
    console.error('[API] Analysis error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
