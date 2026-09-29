import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export function calculateFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf8');
  // Normalize line endings to LF before hashing for cross-platform determinism
  const normalized = content.replace(/\r\n/g, '\n').trim();
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

export function lockGroundTruth(): string {
  const gtPath = path.join(process.cwd(), 'eval', 'ground_truth.json');
  const lockPath = path.join(process.cwd(), 'eval', 'ground_truth.lock');

  if (!fs.existsSync(gtPath)) {
    throw new Error(`Ground truth file not found at ${gtPath}`);
  }

  const hash = calculateFileHash(gtPath);
  fs.writeFileSync(lockPath, hash + '\n', 'utf8');
  console.log(`[LOCK] Ground truth locked successfully.`);
  console.log(`[HASH] SHA-256: ${hash}`);
  return hash;
}

export function verifyGroundTruthLock(): { valid: boolean; currentHash: string; lockedHash: string } {
  const gtPath = path.join(process.cwd(), 'eval', 'ground_truth.json');
  const lockPath = path.join(process.cwd(), 'eval', 'ground_truth.lock');

  if (!fs.existsSync(gtPath)) {
    throw new Error(`Ground truth file not found at ${gtPath}`);
  }
  if (!fs.existsSync(lockPath)) {
    throw new Error(`Ground truth lock file missing at ${lockPath}. Run 'npm run eval:lock' after freezing.`);
  }

  const currentHash = calculateFileHash(gtPath);
  const lockedHash = fs.readFileSync(lockPath, 'utf8').trim();

  return {
    valid: currentHash === lockedHash,
    currentHash,
    lockedHash,
  };
}

if (require.main === module) {
  lockGroundTruth();
}
