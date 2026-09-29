import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const result = await memoryService.askDeal(params.id, question);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to query deal memory' }, { status: 500 });
  }
}
