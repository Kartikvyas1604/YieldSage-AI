// YieldSage AI — Strategy Type Definitions

export type StrategyId = 'conservative' | 'balanced' | 'growth';
export type ScoreTierLabel = 'NEW' | 'BUILDING' | 'FAIR' | 'GOOD' | 'EXCELLENT';

export interface Strategy {
  id: StrategyId;
  name: string;
  emoji: string;
  description: string;
  plainEnglish: string;
  requiredScoreTier: ScoreTierLabel | 'ANY';
  requiredSageTokens: number;
  targetAPY: { min: number; max: number };
  riskLevel: 1 | 2 | 3 | 4 | 5;
  protocols: string[];
  impermanentLossRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  rebalanceFrequency: 'weekly' | 'daily' | '4hours';
  autoExitTriggers: {
    yieldDropBelow?: number;
    impermanentLossAbove?: number;
    volumeDropBelow?: number;
    drawdownAbove?: number;
    healthFactorBelow?: number;
    protocolRiskAlert?: boolean;
  };
}

export interface UserStrategy {
  strategyId: StrategyId;
  deployedAt: number;
  currentAPY: number;
  principal: number;
  currentValue: number;
  earned: number;
  protocol: string;
  poolAddress?: string;
  status: 'active' | 'paused' | 'exited';
  lastRebalance?: number;
  nextMonitor?: number;
}

export interface StrategyRecommendation {
  strategy: Strategy;
  reasoning: string;
  estimatedMonthlyEarnings: number;
  estimatedYearlyEarnings: number;
  confidence: number; // 0-1
  riskWarnings: string[];
}

export interface OnboardingAnswers {
  durationMonths: number;       // Q1: how long (3-24)
  lossTolerance: number;        // Q2: 1-5
  goal: 'safety' | 'growth' | 'max_growth'; // Q3
}
