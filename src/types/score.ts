// CredChain AI Score Type Definitions

export type ScoreTier = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'VERY_POOR';

export interface CategoryScore {
  score: number;
  maxScore: number;
  weight?: number;
  grade?: string;
  signals?: string[];
  trend?: 'up' | 'down' | 'stable';
}

export interface ScoreBreakdown {
  [key: string]: CategoryScore;
  loanRepayment: CategoryScore;
  walletMaturity: CategoryScore;
  tradingBehavior: CategoryScore;
  lpCommitment: CategoryScore;
  community: CategoryScore;
}

export interface RiskFlag {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact?: number;
  detected?: Date;
}

export interface PositiveFactor {
  factor: string;
  type?: string;
  description?: string;
  impact: string | number;
  category?: string;
}

export interface AIReasoning {
  step?: string;
  message?: string;
  reasoning?: string;
  impact: string;
  category: string;
  timestamp?: number | Date;
}

export interface ImprovementTip {
  category: string;
  suggestion: string;
  potentialGain: number;
  currentState?: string;
  targetState?: string;
  estimatedImpact?: number;
  priority?: 'high' | 'medium' | 'low';
  actions?: string[];
  timeframe?: string;
}

export interface ScoreHistory {
  date: number | Date;
  score: number;
  tier?: ScoreTier;
  change: number;
}

export interface BenefitUnlocked {
  protocol: string;
  benefit: string;
  requiresMinScore: number;
  category: 'collateral' | 'rate' | 'access' | 'fee';
}

export interface CredScore {
  walletAddress: string;
  score: number;
  tier: ScoreTier;
  categories?: Record<string, CategoryScore>;
  breakdown?: ScoreBreakdown;
  riskFlags: RiskFlag[];
  positiveFactors: PositiveFactor[];
  aiReasoning: AIReasoning[];
  improvementTips: ImprovementTip[];
  history?: ScoreHistory[];
  scoreHistory?: ScoreHistory[];
  benefits?: BenefitUnlocked[];
  benefitsUnlocked?: BenefitUnlocked[];
  timestamp?: number;
  lastUpdated?: Date;
  credentialNFT?: string;
  credentialMinted?: boolean;
}

export interface ScoreProjection {
  timeframe: '30d' | '60d' | '90d';
  conservative: number;
  optimistic: number;
  actions: string[];
}

export const SCORE_TIER_CONFIG = {
  EXCELLENT: { min: 750, max: 850, color: 'var(--score-excellent)', label: 'Excellent' },
  GOOD: { min: 650, max: 749, color: 'var(--score-good)', label: 'Good' },
  FAIR: { min: 500, max: 649, color: 'var(--score-fair)', label: 'Fair' },
  POOR: { min: 350, max: 499, color: 'var(--score-poor)', label: 'Poor' },
  VERY_POOR: { min: 0, max: 349, color: 'var(--score-poor)', label: 'Very Poor' },
};

export const CATEGORY_WEIGHTS = {
  loanRepayment: 0.30,
  walletMaturity: 0.20,
  tradingBehavior: 0.20,
  lpCommitment: 0.15,
  community: 0.15,
};

export function getScoreTier(score: number): ScoreTier {
  if (score >= 750) return 'EXCELLENT';
  if (score >= 650) return 'GOOD';
  if (score >= 500) return 'FAIR';
  if (score >= 350) return 'POOR';
  return 'VERY_POOR';
}

export function getScoreColor(score: number): string {
  const tier = getScoreTier(score);
  return SCORE_TIER_CONFIG[tier].color;
}
