import fs from 'fs';
import path from 'path';

export function calculateAgreementRate(): {
  totalSampled: number;
  agreedCount: number;
  agreementRatePct: number;
} {
  let csvPath = path.join(process.cwd(), 'eval', 'human_labels.csv');
  if (!fs.existsSync(csvPath)) {
    csvPath = path.join(process.cwd(), 'eval', 'human_sample.csv');
  }
  if (!fs.existsSync(csvPath)) {
    throw new Error('eval/human_labels.csv not found. Run npm run eval:sample first.');
  }

  const lines = fs.readFileSync(csvPath, 'utf8').split('\n').filter((l) => l.trim().length > 0);
  if (lines.length <= 1) {
    throw new Error('No data rows found in eval/human_sample.csv');
  }

  let total = 0;
  let agreed = 0;

  // Header is row 0
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    // Simple CSV parser for quoted rows
    const matches = row.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    if (matches && matches.length >= 13) {
      total++;
      const humanPresentAgree = matches[11]?.replace(/^[",\s]+|[",\s]+$/g, '').toUpperCase();
      const humanAccurateAgree = matches[12]?.replace(/^[",\s]+|[",\s]+$/g, '').toUpperCase();

      if ((humanPresentAgree === 'Y' || humanPresentAgree === 'YES') &&
          (humanAccurateAgree === 'Y' || humanAccurateAgree === 'YES')) {
        agreed++;
      }
    }
  }

  const rate = total > 0 ? (agreed / total) * 100 : 0;
  console.log('=====================================================');
  console.log('         HUMAN-JUDGE AGREEMENT METRICS               ');
  console.log('=====================================================');
  console.log(`Total Samples Evaluated: ${total}`);
  console.log(`Full Agreement Count:    ${agreed}`);
  console.log(`Human-Judge Agreement:   ${rate.toFixed(1)}%`);

  return {
    totalSampled: total,
    agreedCount: agreed,
    agreementRatePct: Number(rate.toFixed(1)),
  };
}

if (require.main === module) {
  calculateAgreementRate();
}
