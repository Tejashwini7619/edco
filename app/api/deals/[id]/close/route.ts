import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, primaryReason, winningOrLosingTactics } = await req.json();
    if (!status || !primaryReason || !winningOrLosingTactics) {
      return NextResponse.json(
        { error: 'status, primaryReason, and winningOrLosingTactics are required' },
        { status: 400 }
      );
    }

    const updatedDeal = await memoryService.closeDeal(
      params.id,
      status,
      primaryReason,
      winningOrLosingTactics
    );

    return NextResponse.json({ deal: updatedDeal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to close deal' }, { status: 500 });
  }
}
