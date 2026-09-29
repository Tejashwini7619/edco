import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const recommendation = await memoryService.recommendTactics(query);
    return NextResponse.json(recommendation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to recommend tactics' }, { status: 500 });
  }
}
