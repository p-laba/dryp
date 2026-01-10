import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/agents/orchestrator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id required' },
        { status: 400 }
      );
    }

    const lookbook = await orchestrator.getLookbook(id);

    if (!lookbook) {
      return NextResponse.json(
        { error: 'Lookbook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lookbook);
  } catch (error) {
    console.error('[API] Lookbook error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
