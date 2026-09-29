import { NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';
import { SEED_DEALS } from '@/lib/seed-data';

export async function POST() {
  try {
    await memoryService.ensureBankConfig();
    let totalFacts = 0;
    let totalInteractions = 0;

    for (const deal of SEED_DEALS) {
      const interactionsToSeed = [...deal.interactions];
      for (const int of interactionsToSeed) {
        totalInteractions++;
        const res = await memoryService.retain(
          deal.id,
          int.content,
          int.context,
          int.timestamp,
          {
            dealName: deal.name,
            industry: deal.industry,
            stage: deal.stage,
          }
        );
        totalFacts += res.extractedFacts.length;
      }
    }

    return NextResponse.json({
      success: true,
      dealsCount: SEED_DEALS.length,
      interactionsCount: totalInteractions,
      factsCount: totalFacts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Seeding failed' }, { status: 500 });
  }
}
