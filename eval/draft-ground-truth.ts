import fs from 'fs';
import path from 'path';
import { generateCompletion } from '../lib/azure-openai';
import { SEED_DEALS } from '../lib/seed-data';

async function draftGroundTruth() {
  console.log('[EVAL DRAFT] Generating draft ground-truth checklist from seed deal...');
  const targetDeal = SEED_DEALS.find((d) => d.id === 'deal-001') || SEED_DEALS[0];

  const interactionsText = targetDeal.interactions
    .map((int, idx) => `Interaction #${idx + 1} [${int.id}] (${int.timestamp}) - Context: ${int.context}:\n${int.content}`)
    .join('\n\n---\n\n');

  const prompt = `You are an expert sales intelligence auditor creating an objective ground-truth evaluation checklist.
Analyze the full interaction history for account "${targetDeal.name}" (${targetDeal.company}).

Extract 15 to 20 atomic, verifiable facts across the deal cycle.
Each fact must specify:
1. "id": unique string (e.g. "gt-stk-1", "gt-obj-1", "gt-pri-1")
2. "category": one of ["stakeholder", "objection", "competitor", "commitment", "change", "tactic"]
3. "fact": clear, verifiable single statement (e.g. "CFO Harish Iyer is skeptical of SaaS ROI due to 4.2% thin margins")
4. "first_knowable_interaction": integer (1-indexed interaction number where this fact first appears in notes)
5. "target_entity": name of person or company (optional)
6. "source_context": brief snippet reference

Account Interactions:
${interactionsText}

Return ONLY valid JSON matching this schema:
{
  "deal_id": "${targetDeal.id}",
  "deal_name": "${targetDeal.name}",
  "company": "${targetDeal.company}",
  "total_interactions": ${targetDeal.interactions.length},
  "items": [
    {
      "id": "gt-stk-1",
      "category": "stakeholder",
      "fact": "...",
      "first_knowable_interaction": 1,
      "target_entity": "...",
      "source_context": "..."
    }
  ]
}`;

  const response = await generateCompletion({
    messages: [
      { role: 'system', content: 'You are an objective auditor. Output valid JSON only.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.1,
    max_tokens: 2000,
  });

  const cleaned = response.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').replace(/```/g, '').trim();
  const draftPath = path.join(process.cwd(), 'eval', 'ground_truth.draft.json');
  fs.writeFileSync(draftPath, cleaned, 'utf8');
  console.log(`[EVAL DRAFT] Saved draft checklist to: ${draftPath}`);
}

draftGroundTruth().catch(console.error);
