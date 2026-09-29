import { memoryService, HINDSIGHT_BANK_ID } from '../lib/memory';
import { SEED_DEALS, SEED_OBSERVATIONS, SEED_MENTAL_MODELS } from '../lib/seed-data';

async function runSeed() {
  console.log('====================================================');
  console.log('  DealMemory: Seeding Hindsight Sales Memory Bank   ');
  console.log('====================================================');
  console.log(`Target Memory Bank: "${HINDSIGHT_BANK_ID}"`);
  console.log('Applying Bank Mission, Directives & Disposition...\n');

  await memoryService.ensureBankConfig();

  let totalInteractions = 0;
  let totalFacts = 0;

  for (const deal of SEED_DEALS) {
    console.log(`[DEAL] Retaining "${deal.name}" (${deal.stage} - \$${deal.value.toLocaleString()})`);
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
      console.log(`  + Ingested "${int.title}" -> ${res.extractedFacts.length} facts, ${res.extractedEntities.length} entities`);
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`Successfully retained:`);
  console.log(`  • ${SEED_DEALS.length} Enterprise Deals`);
  console.log(`  • ${totalInteractions} Realistic Customer Interactions`);
  console.log(`  • ${totalFacts} Extracted Facts & Linked Entities`);
  console.log(`  • ${SEED_OBSERVATIONS.length} Consolidated Belief Evolutions`);
  console.log(`  • ${SEED_MENTAL_MODELS.length} Curated Mental Models & Playbooks`);
  console.log('----------------------------------------------------');
  console.log('Hindsight Memory Bank is primed and ready for queries.\n');
}

runSeed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
