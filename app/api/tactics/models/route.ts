import { NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function GET() {
  try {
    const mentalModels = memoryService.getMentalModels();
    return NextResponse.json({ mentalModels });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch mental models' }, { status: 500 });
  }
}
