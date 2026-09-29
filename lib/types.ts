export type DealStage =
  | 'Discovery'
  | 'Solutioning'
  | 'Security Review'
  | 'Negotiation'
  | 'Procurement'
  | 'Closed Won'
  | 'Closed Lost';

export type DealRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DealRiskSignal {
  level: DealRiskLevel;
  score: number; // 0 - 100
  reason: string;
  contributingFactors: string[];
  lastAssessed: string;
}

export interface Stakeholder {
  name: string;
  role: string;
  email?: string;
  sentiment: 'Champion' | 'Positive' | 'Neutral' | 'Skeptical' | 'Blocker';
  lastContact: string;
  notes?: string;
  citationId?: string;
}

export interface ObjectionItem {
  id: string;
  category: 'Price' | 'Implementation Risk' | 'Security / Compliance' | 'Product Feature' | 'Competitor Preference' | 'Timing';
  objection: string;
  resolved: boolean;
  resolutionStrategy?: string;
  evidence: string;
  citationId?: string;
}

export interface CompetitorMention {
  competitor: string;
  claims: string;
  weaknessIdentified?: string;
  offeredFeatures?: string;
  citationId?: string;
}

export interface PricingHistoryItem {
  date: string;
  amount: string;
  tierOrTerms: string;
  reaction: string;
  citationId?: string;
}

export interface PreCallBrief {
  dealId: string;
  dealName: string;
  generatedAt: string;
  whereItStands: string[]; // 3 concise lines
  openObjections: ObjectionItem[];
  stakeholderMap: Stakeholder[];
  competitorsMentioned: CompetitorMention[];
  pricingHistory: PricingHistoryItem[];
  recommendedTalkTrack: string;
  suggestedQuestions: string[];
  citations: Record<string, SourceMemory>;
}

export interface SourceMemory {
  id: string;
  text: string;
  type: 'world' | 'experience' | 'observation';
  context?: string;
  timestamp?: string;
  documentId?: string;
  dealId?: string;
  author?: string;
  entities?: string[];
  metadata?: Record<string, string>;
}

export interface Interaction {
  id: string;
  dealId: string;
  type: 'discovery_call' | 'demo' | 'security_review' | 'email_thread' | 'pricing_call' | 'executive_sync' | 'crm_note' | 'procurement_meeting';
  title: string;
  timestamp: string;
  author: string;
  content: string;
  context: string;
  extractedFactsCount?: number;
  extractedEntities?: string[];
  documentId?: string;
}

export interface Deal {
  id: string;
  name: string;
  company: string;
  industry: string;
  stage: DealStage;
  value: number; // in USD
  owner: string;
  closeDate: string;
  lastContactDate: string;
  risk: DealRiskSignal;
  nextStep: string;
  competitors: string[];
  tags: string[];
  interactions: Interaction[];
  outcome?: {
    status: 'won' | 'lost';
    closedAt: string;
    primaryReason: string;
    winningOrLosingTactics: string;
  };
}

export interface BeliefStateChange {
  date: string;
  state: string;
  evidence: string;
  sourceContext: string;
  citationId?: string;
}

export interface MemoryObservation {
  id: string;
  dealId?: string;
  topic: string;
  summary: string;
  confidence: 'High' | 'Medium' | 'Low';
  firstObserved: string;
  lastUpdated: string;
  history: BeliefStateChange[];
  entities: string[];
}

export interface MentalModelSummary {
  id: string;
  name: string;
  category: 'objection_playbook' | 'competitor_battlecard' | 'procurement_guide';
  sourceQuery: string;
  summary: string;
  keyTactics: string[];
  winRateImpact?: string;
  tags: string[];
  lastRefreshed: string;
}

export interface WinningTactic {
  tactic: string;
  winRateImpact: string;
  recommendedWhen: string;
  evidenceDeals: string[];
  directQuote: string;
  citationId: string;
}

export interface PastDealEvidence {
  dealId: string;
  dealName: string;
  company: string;
  outcome: 'Won' | 'Lost';
  value: number;
  tacticUsed: string;
  lessonLearned: string;
  closedDate: string;
}

export interface TacticRecommendation {
  query: string;
  targetCategory: string;
  overallWinRateWithTactic: string;
  overallWinRateWithoutTactic: string;
  coreRecommendation: string;
  tactics: WinningTactic[];
  supportingDeals: PastDealEvidence[];
  citations: Record<string, SourceMemory>;
}

export interface IngestResponse {
  documentId: string;
  dealId: string;
  extractedFacts: Array<{
    id: string;
    text: string;
    type: 'world' | 'experience' | 'observation';
    confidence: number;
  }>;
  extractedEntities: Array<{
    name: string;
    type: 'PERSON' | 'ORG' | 'COMPETITOR' | 'PRICE' | 'OBJECTION' | 'CONCEPT';
  }>;
  memoryDefenseScrubbed: boolean;
  redactedItemsCount: number;
  status: 'retained' | 'processing';
}
