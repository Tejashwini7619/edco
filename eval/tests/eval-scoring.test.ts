import { verifyGroundTruthLock } from '../lock-ground-truth';
import { verifyCitations, repairAndParseJSON } from '../judge';
import { GroundTruthItem } from '../types';

describe('Evaluation Harness Unit Tests', () => {
  test('Ground Truth Lock Integrity Verification', () => {
    const lockStatus = verifyGroundTruthLock();
    expect(lockStatus.valid).toBe(true);
    expect(lockStatus.currentHash).toBe(lockStatus.lockedHash);
    expect(lockStatus.currentHash.length).toBe(64); // SHA-256 length
  });

  test('Checkpoint Knowability Logic', () => {
    const sampleItems: GroundTruthItem[] = [
      { id: '1', category: 'stakeholder', fact: 'Fact 1', first_knowable_interaction: 1 },
      { id: '2', category: 'objection', fact: 'Fact 2', first_knowable_interaction: 2 },
      { id: '3', category: 'competitor', fact: 'Fact 3', first_knowable_interaction: 4 },
      { id: '4', category: 'tactic', fact: 'Fact 4', first_knowable_interaction: 6 },
    ];

    const cp1Items = sampleItems.filter((i) => i.first_knowable_interaction <= 1);
    expect(cp1Items.length).toBe(1);
    expect(cp1Items[0].id).toBe('1');

    const cp3Items = sampleItems.filter((i) => i.first_knowable_interaction <= 3);
    expect(cp3Items.length).toBe(2);

    const cp6Items = sampleItems.filter((i) => i.first_knowable_interaction <= 6);
    expect(cp6Items.length).toBe(4);
  });

  test('JSON Repair and Extraction Resilience', () => {
    const markdownWrapped = '```json\n{"present": true, "accurate": true, "quote": "CFO capped at 25L"}\n```';
    const parsed = repairAndParseJSON(markdownWrapped, { present: false, accurate: false });
    expect(parsed.present).toBe(true);
    expect(parsed.accurate).toBe(true);

    const brokenWrapped = 'Here is the result: {"present": true, "accurate": false} hope this helps!';
    const parsedBroken = repairAndParseJSON(brokenWrapped, { present: false, accurate: false });
    expect(parsedBroken.present).toBe(true);
    expect(parsedBroken.accurate).toBe(false);
  });

  test('Citation Extraction and Verification Rate', () => {
    const briefWithCitations = `
Deal Status Summary:
- CFO Harish Iyer rejected 45L quote and capped budget at 25L [int-001-3].
- BlueDart reference demonstrated 1.14 Cr recovery in 92 days [int-001-4].
- Legal drafting 30-day milestone acceptance criteria [int-001-6].
    `;

    const res = verifyCitations(briefWithCitations);
    const validCount = res.filter((r) => r.citation_valid).length;

    expect(validCount).toBe(3);
    expect(res.length).toBe(3);
    expect(validCount / res.length).toBe(1.0);
  });
});
