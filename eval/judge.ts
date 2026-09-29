import { generateCompletion } from '../lib/azure-openai';
import { GroundTruthItem, JudgeDecision, ClaimVerification, CitationVerification } from './types';

// Fallback & primary model configuration
const PRIMARY_JUDGE_MODEL = process.env.JUDGE_MODEL || process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
const FALLBACK_JUDGE_MODEL = process.env.FALLBACK_JUDGE_MODEL || 'openai/gpt-oss-20b';

/**
 * Clean and parse JSON safely from LLM output
 */
export function repairAndParseJSON<T>(raw: string, fallback: T): T {
  try {
    const cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*$/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    // Attempt relaxed regex extraction if structured JSON is wrapped
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {}
    }
    return fallback;
  }
}

/**
 * Make an LLM call with retry and fallback model support
 */
async function callLLMWithRetry(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  temperature = 0.0,
  maxRetries = 3
): Promise<string> {
  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxRetries) {
    attempt++;
    const modelToUse = attempt === maxRetries ? FALLBACK_JUDGE_MODEL : PRIMARY_JUDGE_MODEL;
    try {
      const resp = await generateCompletion({
        messages,
        temperature,
        modelOverride: modelToUse,
      });
      if (resp && resp.trim().length > 0) {
        return resp;
      }
    } catch (e: any) {
      lastError = e;
      // Exponential backoff
      const delayMs = Math.min(1000 * Math.pow(2, attempt), 6000);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  // Fallback to standard provider
  return await generateCompletion({
    messages,
    temperature,
  });
}

/**
 * Judge single checklist fact against a generated sales brief
 */
export async function judgeFactAgainstBrief(
  item: GroundTruthItem,
  briefText: string
): Promise<JudgeDecision> {
  const systemPrompt = `You are a strict, objective evaluation judge assessing whether an AI-generated sales briefing contains a specific ground-truth deal fact.

STRICT SCORING RULES:
1. "present": TRUE if the brief explicitly conveys this specific fact. Vague, generic, or boilerplate statements get NO credit (present: false).
2. "accurate": TRUE if the claim is factual and does not contradict the ground truth. FALSE if it states an incorrect number, wrong stakeholder role, or fabricated claim.
3. "quote": Extract the exact verbatim snippet from the brief that proves presence, or null if not present.
4. "rationale": Brief 1-sentence explanation of your verdict.

Return ONLY valid JSON in this exact format:
{
  "present": boolean,
  "accurate": boolean,
  "quote": string | null,
  "rationale": string
}`;

  const userPrompt = `GROUND-TRUTH FACT:
Category: ${item.category}
Fact: "${item.fact}"
Target Entity: ${item.target_entity || 'N/A'}

GENERATED BRIEF TO EVALUATE:
"""
${briefText}
"""`;

  const rawOutput = await callLLMWithRetry([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  const parsed = repairAndParseJSON<{
    present: boolean;
    accurate: boolean;
    quote: string | null;
    rationale?: string;
  }>(rawOutput, {
    present: false,
    accurate: false,
    quote: null,
    rationale: 'Failed to parse structured judge response.',
  });

  return {
    item_id: item.id,
    category: item.category,
    fact: item.fact,
    present: !!parsed.present,
    accurate: !!parsed.accurate,
    quote: parsed.quote || null,
    rationale: parsed.rationale || (parsed.present ? 'Fact identified in brief.' : 'Fact not found in brief text.'),
  };
}

/**
 * Batched Judge Evaluation: Evaluates all knowable facts in a single structured LLM call
 */
export async function judgeAllFactsAgainstBrief(
  items: GroundTruthItem[],
  briefText: string
): Promise<JudgeDecision[]> {
  if (items.length === 0) return [];

  const systemPrompt = `You are a strict, objective evaluation judge assessing whether an AI-generated sales briefing contains specific ground-truth deal facts.

STRICT SCORING RULES:
1. "present": TRUE if the brief explicitly conveys this specific fact. Vague, generic, or boilerplate statements get NO credit (present: false).
2. "accurate": TRUE if the claim is factual and does not contradict the ground truth. FALSE if it states an incorrect number, wrong stakeholder role, or fabricated claim.
3. "quote": Extract the exact verbatim snippet from the brief that proves presence, or null if not present.
4. "rationale": Brief 1-sentence explanation of your verdict.

Return ONLY valid JSON in this exact format:
{
  "decisions": [
    {
      "item_id": string,
      "present": boolean,
      "accurate": boolean,
      "quote": string | null,
      "rationale": string
    }
  ]
}`;

  const factsList = items
    .map(
      (item) =>
        `Item ID: ${item.id}\nCategory: ${item.category}\nFact: "${item.fact}"\nTarget Entity: ${item.target_entity || 'N/A'}`
    )
    .join('\n\n---\n\n');

  const userPrompt = `GROUND-TRUTH CHECKLIST:
${factsList}

GENERATED BRIEF TO EVALUATE:
"""
${briefText}
"""`;

  try {
    const rawOutput = await callLLMWithRetry([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const parsed = repairAndParseJSON<{
      decisions: Array<{
        item_id: string;
        present: boolean;
        accurate: boolean;
        quote: string | null;
        rationale?: string;
      }>;
    }>(rawOutput, { decisions: [] });

    if (parsed.decisions && parsed.decisions.length > 0) {
      return items.map((item) => {
        const d = parsed.decisions.find((dec) => dec.item_id === item.id);
        if (d) {
          return {
            item_id: item.id,
            category: item.category,
            fact: item.fact,
            present: !!d.present,
            accurate: !!d.accurate,
            quote: d.quote || null,
            rationale: d.rationale || (d.present ? 'Fact identified in brief.' : 'Fact not found in brief text.'),
          };
        }
        return {
          item_id: item.id,
          category: item.category,
          fact: item.fact,
          present: false,
          accurate: false,
          quote: null,
          rationale: 'Fact omitted from brief.',
        };
      });
    }
  } catch (err) {
    console.warn('Batched judge call failed, falling back to sequential:', err);
  }

  // Fallback to sequential
  const decisions: JudgeDecision[] = [];
  for (const item of items) {
    decisions.push(await judgeFactAgainstBrief(item, briefText));
  }
  return decisions;
}

/**
 * Second judge pass: Extract factual claims from brief and check against deal history to detect hallucinations
 */
export async function judgeHallucinationsInBrief(
  briefText: string,
  fullDealHistoryText: string
): Promise<ClaimVerification[]> {
  const verifyPrompt = `You are a strict fact-checking auditor.
Inspect the following AI-generated sales briefing against the True Deal History.
Extract all concrete factual claims made in the brief (stakeholders, dollar amounts, dates, competitor quotes, objections, commitments) and determine if each claim CONTRADICTS the True Deal History or invents unstated facts/numbers (hallucination).

True Deal History:
"""
${fullDealHistoryText}
"""

Generated Brief:
"""
${briefText}
"""

Return ONLY valid JSON format:
{
  "verifications": [
    {
      "claim": string,
      "contradicts_seed": boolean,
      "explanation": string
    }
  ]
}`;

  const rawVerification = await callLLMWithRetry([
    { role: 'system', content: 'You are an objective auditor. Output JSON only.' },
    { role: 'user', content: verifyPrompt },
  ]);

  const parsedVerifications = repairAndParseJSON<{
    verifications: Array<{ claim: string; contradicts_seed: boolean; explanation: string }>;
  }>(rawVerification, { verifications: [] });

  return (parsedVerifications.verifications || []).map((v) => ({
    claim: v.claim,
    contradicts_seed: !!v.contradicts_seed,
    explanation: v.explanation || '',
  }));
}

/**
 * Verify citation rate for ON condition (claims with valid resolvable sources)
 */
export function verifyCitations(briefText: string): CitationVerification[] {
  // Extract citations in format [int-001-X] or [#1], [int-...]
  const citationRegex = /\[(int-[a-zA-Z0-9_-]+|\d+)\]/g;
  const matches = [...briefText.matchAll(citationRegex)];

  const claimsWithCitations: CitationVerification[] = [];

  // Split lines
  const lines = briefText.split('\n').filter((l) => l.trim().length > 10);
  for (const line of lines) {
    const hasCite = citationRegex.test(line);
    const citeMatch = line.match(/\[(int-[a-zA-Z0-9_-]+|\d+)\]/);

    claimsWithCitations.push({
      claim: line.trim(),
      has_citation: hasCite,
      resolvable_source_id: citeMatch ? citeMatch[1] : null,
      citation_valid: hasCite,
    });
  }

  return claimsWithCitations;
}
