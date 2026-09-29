import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function POST(req: NextRequest) {
  try {
    const { dealId, content, context, timestamp, metadata } = await req.json();
    if (!dealId || !content) {
      return NextResponse.json({ error: 'dealId and content are required' }, { status: 400 });
    }

    const response = await memoryService.retain(
      dealId,
      content,
      context || 'call transcript',
      timestamp,
      metadata
    );

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to ingest content' }, { status: 500 });
  }
}
