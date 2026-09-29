import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brief = await memoryService.generatePreCallBrief(params.id);
    return NextResponse.json({ brief });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate brief' }, { status: 500 });
  }
}
