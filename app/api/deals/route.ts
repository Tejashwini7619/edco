import { NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function GET() {
  try {
    const deals = memoryService.getAllDeals();
    return NextResponse.json({ deals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch deals' }, { status: 500 });
  }
}
