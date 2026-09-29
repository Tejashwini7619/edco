export type FactCategory =
  | 'objection'
  | 'stakeholder'
  | 'competitor'
  | 'commitment'
  | 'change'
  | 'tactic';

export interface GroundTruthItem {
  id: string;
  category: FactCategory;
  fact: string;
  first_knowable_interaction: number; // 1-indexed interaction number where fact first appears
  target_entity?: string;
  source_context?: string;
}

export interface GroundTruthFile {
  deal_id: string;
  deal_name: string;
  company: string;
  total_interactions: number;
  items: GroundTruthItem[];
}

export interface CrossDealTruthRule {
  id: string;
  criterion: string;
  weight: number; // 1 point each
  check: 'recommends_security' | 'cites_win_loss_ratio' | 'warns_against_discounting' | 'cites_valid_past_deal_ids';
}

export interface CrossDealTruthFile {
  scenario: string;
  competitor: string;
  objection_type: string;
  rules: CrossDealTruthRule[];
  expected_valid_deal_ids: string[];
}

export interface JudgeDecision {
  item_id: string;
  category: FactCategory;
  fact: string;
  present: boolean;
  accurate: boolean;
  quote: string | null;
  rationale: string;
}

export interface ClaimVerification {
  claim: string;
  contradicts_seed: boolean;
  explanation: string;
}

export interface CitationVerification {
  claim: string;
  has_citation: boolean;
  resolvable_source_id: string | null;
  citation_valid: boolean;
}

export interface CheckpointRunResult {
  run_index: number;
  condition: 'ON' | 'OFF' | 'STUFFED';
  checkpoint: number;
  raw_brief: string;
  prompt_token_count: number;
  duration_ms: number;
  knowable_items_count: number;
  present_accurate_count: number;
  recall_score: number; // present_accurate / knowable_items
  hallucination_count: number;
  citation_rate: number; // for ON only (valid / total)
  judgements: JudgeDecision[];
  claims_verified: ClaimVerification[];
  citations_verified: CitationVerification[];
}

export interface AggregatedCheckpointMetric {
  checkpoint: number;
  interactions_count: number;
  knowable_items_count: number;
  mean_recall: number;
  min_recall: number;
  max_recall: number;
  mean_hallucinations: number;
  mean_citation_rate: number;
  mean_tokens: number;
  runs: CheckpointRunResult[];
}

export interface Experiment1Results {
  deal_id: string;
  deal_name: string;
  checkpoints: number[];
  repeats_per_condition: number;
  conditions: {
    ON: AggregatedCheckpointMetric[];
    OFF: AggregatedCheckpointMetric[];
    STUFFED: AggregatedCheckpointMetric[];
  };
}

export interface CrossDealRunResult {
  closed_deals_count: number;
  condition: 'MEMORY_ON' | 'STUFFED';
  raw_response: string;
  prompt_tokens: number;
  duration_ms: number;
  fits_in_context: boolean;
  recommends_security: boolean;
  cites_win_loss_ratio: boolean;
  warns_against_discounting: boolean;
  cites_valid_deal_ids: boolean;
  cited_deal_ids: string[];
  total_score: number; // 0 to 4
  max_possible_score: number;
}

export interface Experiment2Results {
  scenario: string;
  closed_deal_increments: number[];
  memory_runs: CrossDealRunResult[];
  stuffed_runs: CrossDealRunResult[];
}

export interface EvaluationRunSummary {
  run_id: string;
  timestamp: string;
  ground_truth_hash: string;
  generator_model: string;
  judge_model: string;
  fallback_model: string;
  is_quick_run: boolean;
  duration_seconds: number;
  total_llm_calls: number;
  human_agreement_pct?: number;
  experiment_1: Experiment1Results;
  experiment_2: Experiment2Results;
}
