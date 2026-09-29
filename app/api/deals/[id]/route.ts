import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = memoryService.getDealById(params.id);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ deal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch deal' }, { status: 500 });
  }
}
