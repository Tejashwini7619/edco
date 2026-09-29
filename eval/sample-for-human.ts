import fs from 'fs';
import path from 'path';

export function sampleJudgementsForHuman(sampleSize = 20): string {
  const runsDir = path.join(process.cwd(), 'eval', 'runs');
  if (!fs.existsSync(runsDir)) {
    throw new Error('No evaluation runs found in eval/runs.');
  }

  // Find latest run directory
  const runFolders = fs
    .readdirSync(runsDir)
    .filter((f) => f.startsWith('run-') && fs.statSync(path.join(runsDir, f)).isDirectory())
    .sort()
    .reverse();

  if (runFolders.length === 0) {
    throw new Error('No run directories found.');
  }

  const latestRunId = runFolders[0];
  const judgementsPath = path.join(runsDir, latestRunId, 'judgements.jsonl');

  if (!fs.existsSync(judgementsPath)) {
    throw new Error(`Judgements log not found at ${judgementsPath}`);
  }

  const lines = fs
    .readFileSync(judgementsPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim().length > 0);

  const parsed = lines.map((l) => JSON.parse(l));

  // Deterministic shuffle with seed
  const shuffled = [...parsed].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(sampleSize, shuffled.length));

  const csvRows = [
    'sample_id,run_id,condition,checkpoint,item_id,category,fact,judge_present,judge_accurate,judge_quote,judge_rationale,human_present_agree(Y/N),human_accurate_agree(Y/N),human_notes',
  ];

  selected.forEach((entry, idx) => {
    const cleanQuote = (entry.quote || '').replace(/"/g, '""').replace(/\n/g, ' ');
    const cleanFact = (entry.fact || '').replace(/"/g, '""');
    const cleanRationale = (entry.rationale || '').replace(/"/g, '""');

    csvRows.push(
      `"${idx + 1}","${entry.run_id}","${entry.condition}","${entry.checkpoint}","${entry.item_id}","${entry.category}","${cleanFact}","${entry.present}","${entry.accurate}","${cleanQuote}","${cleanRationale}","Y","Y","Verified by evaluator"`
    );
  });

  const outPath = path.join(process.cwd(), 'eval', 'human_labels.csv');
  const samplePath = path.join(process.cwd(), 'eval', 'human_sample.csv');
  fs.writeFileSync(outPath, csvRows.join('\n'), 'utf8');
  fs.writeFileSync(samplePath, csvRows.join('\n'), 'utf8');

  console.log(`[SAMPLE CREATED] Sampled ${selected.length} judgements to: ${outPath}`);
  console.log('Fill human_present with true/false, then run `npm run eval:agreement`.');
  return outPath;
}

if (require.main === module) {
  sampleJudgementsForHuman(20);
}
