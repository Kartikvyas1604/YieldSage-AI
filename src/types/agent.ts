// YieldSage AI — Agent Type Definitions

import type { StrategyId } from './strategy';

export type AgentTrigger = 'onboard' | 'monitor' | 'manual' | 'emergency';
export type ActionType = 'deploy' | 'rebalance' | 'exit' | 'monitor' | 'improve' | 'emergency_protect';
export type StreamMessageType = 'observe' | 'think' | 'act' | 'report' | 'error';

export interface AgentPermissions {
  canMintNFT: boolean;
  canUpdateScore: boolean;
  accessLevel: 'demo' | 'basic' | 'full';
  agentPaused: boolean;
  autoApproveLimit: number;
  dailySpendLimit: number;
  leverageEnabled: boolean;
  approvedProtocols: string[];
  maxRiskLevel: number;
}

export interface AgentTool {
  name: string;
  description: string;
  input_schema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolUseBlock {
  id: string;
  type: 'tool_use';
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | Record<string, unknown>;
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string | Array<ToolUseBlock | ToolResultBlock | { type: 'text'; text: string }>;
}

export interface AgentAction {
  type: ActionType;
  protocol: string;
  amount?: number;
  strategyId?: StrategyId;
  riskLevel: number;
  reasoning: string;
  estimatedImpact?: string;
}

export interface AgentActionLog {
  id: string;
  timestamp: number;
  type: ActionType;
  plainEnglish: string;
  reasoning: string;
  impact: string | null;
  result: 'success' | 'pending' | 'failed' | 'all_clear';
  txSignature?: string;
  amountUsd?: number;
}

export interface StreamMessage {
  type: StreamMessageType;
  message: string;
  timestamp?: number;
}

export interface AgentDecision {
  recommendedStrategy: StrategyId;
  actionsToTake: AgentAction[];
  reasoning: string;
  userMessage: string;
  riskLevel: number;
  estimatedOutcome: {
    dailyEarningsUsd: number;
    monthlyEarningsUsd: number;
    apy: number;
  };
  creditScoreUpdate?: {
    delta: number;
    reason: string;
  };
}

export interface AgentAnalysisResult {
  success: boolean;
  decision?: AgentDecision;
  actionLogs: AgentActionLog[];
  newCreditScore?: number;
  streamMessages: StreamMessage[];
  error?: string;
}


export interface AgentTool {
  name: string;
  description: string;
  input_schema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolUseBlock {
  id: string;
  type: 'tool_use';
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultBlock {
  type: 'tool_result';
  tool_use_id: string;
  content: string | Record<string, unknown>;
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string | Array<ToolUseBlock | ToolResultBlock | { type: 'text'; text: string }>;
}

export interface AgentAnalysisStep {
  step: string;
  tool: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  reasoning: string;
}

export interface AgentAnalysisResult {
  success: boolean;
  score: number;
  tier: string;
  breakdown: Record<string, unknown>;
  steps: AgentAnalysisStep[];
  riskFlags: Array<{
    type: string;
    severity: string;
    description: string;
    impact: number;
  }>;
  positiveFactors: Array<{
    type: string;
    description: string;
    impact: number;
  }>;
  improvementTips: Array<{
    category: string;
    tip: string;
    estimatedImpact: number;
  }>;
  processingTime: number;
  tokenUsage?: {
    input: number;
    output: number;
  };
}

export interface StreamEvent {
  type: 'progress' | 'finding' | 'risk' | 'score' | 'complete' | 'error';
  step?: string;
  message: string;
  category?: string;
  finding?: string;
  impact?: string;
  final_score?: number;
  tier?: string;
  breakdown?: Record<string, unknown>;
  nft_address?: string;
  error?: string;
}

export interface AIAnalysisSession {
  sessionId: string;
  walletAddress: string;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  events: StreamEvent[];
  result?: AgentAnalysisResult;
}

export const CREDCHAIN_TOOLS: AgentTool[] = [
  {
    name: "analyze_loan_history",
    description: "Analyze the wallet's loan repayment history across Marginfi and Solend. Returns repayment rate, liquidation count, and creditworthiness score for this category.",
    input_schema: {
      type: "object",
      properties: {
        loans: { type: "array", description: "Array of loan events" },
        repayments: { type: "array", description: "Array of repayment events" },
        liquidations: { type: "array", description: "Array of liquidation events" }
      }
    }
  },
  {
    name: "analyze_trading_behavior",
    description: "Analyze trading patterns to detect wash trading, pump-and-dump participation, and overall trading discipline.",
    input_schema: {
      type: "object",
      properties: {
        trades: { type: "array" },
        tokens_created: { type: "array" },
        pnl_history: { type: "array" }
      }
    }
  },
  {
    name: "analyze_wallet_maturity",
    description: "Evaluate wallet age, consistency of activity, protocol diversity, and behavioral patterns over time.",
    input_schema: {
      type: "object",
      properties: {
        wallet_age_days: { type: "number" },
        monthly_activity: { type: "array" },
        protocols_used: { type: "array" }
      }
    }
  },
  {
    name: "analyze_lp_behavior",
    description: "Evaluate liquidity provision history — how long positions were held, whether user is a mercenary LP or committed provider.",
    input_schema: {
      type: "object",
      properties: {
        lp_positions: { type: "array" },
        avg_duration_days: { type: "number" },
        protocols: { type: "array" }
      }
    }
  },
  {
    name: "detect_risk_flags",
    description: "Detect any red flags: interaction with known scam contracts, rug pull participation, bot behavior patterns.",
    input_schema: {
      type: "object",
      properties: {
        transactions: { type: "array" },
        known_scam_addresses: { type: "array" }
      }
    }
  },
  {
    name: "calculate_final_score",
    description: "Calculate the final weighted credit score from 0-850 based on all category analyses.",
    input_schema: {
      type: "object",
      properties: {
        loan_score: { type: "number" },
        trading_score: { type: "number" },
        maturity_score: { type: "number" },
        lp_score: { type: "number" },
        risk_flags: { type: "array" },
        positive_factors: { type: "array" }
      }
    }
  },
  {
    name: "generate_improvement_tips",
    description: "Generate personalized, actionable tips for improving the credit score based on identified weaknesses.",
    input_schema: {
      type: "object",
      properties: {
        weak_categories: { type: "array" },
        current_score: { type: "number" },
        wallet_history: { type: "object" }
      }
    }
  }
];
