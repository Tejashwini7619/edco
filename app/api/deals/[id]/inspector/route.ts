import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const observations = memoryService.getObservations(params.id);
    const memories = await memoryService.recall('*', { dealId: params.id, budget: 'high' });
    
    return NextResponse.json({
      observations,
      memories,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch memory inspection data' }, { status: 500 });
  }
}
