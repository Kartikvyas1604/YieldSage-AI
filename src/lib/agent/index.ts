/**
 * Main CredChain AI Agent orchestrator
 * Implements OBSERVE → THINK → SCORE → RETURN flow using Claude
 */

import { GoogleGenAI } from "@google/genai";
import { CredScore } from "@/types/score";
import { CREDCHAIN_SYSTEM_PROMPT } from "./prompts";
import { executeTool } from "./tools";
import { calculateCredScore } from "./scoring";
import { DEMO_CRED_SCORE } from "@/lib/data/mock";

// Lazy client — instantiated on first request so build-time static analysis
// doesn't fail when GEMINI_API_KEY is not set in the build environment.
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  return new GoogleGenAI({ apiKey });
}

export interface AgentAnalysisOptions {
  walletAddress: string;
  demoMode?: boolean;
  onReasoningUpdate?: (reasoning: string, category?: string) => void;
  onProgress?: (step: string) => void;
}

export interface AgentAnalysisResult {
  success: boolean;
  score?: CredScore;
  error?: string;
  reasoningSteps: Array<{
    category: string;
    reasoning: string;
    timestamp: number;
  }>;
}

/**
 * Run the complete CredChain AI analysis
 */
export async function runCredChainAgent(
  options: AgentAnalysisOptions
): Promise<AgentAnalysisResult> {
  const { walletAddress, demoMode = false, onReasoningUpdate, onProgress } = options;

  const reasoningSteps: Array<{
    category: string;
    reasoning: string;
    timestamp: number;
  }> = [];

  try {
    // Demo mode: Return pre-calculated score with simulated streaming
    if (demoMode) {
      return await runDemoAnalysis(
        walletAddress,
        onReasoningUpdate,
        onProgress
      );
    }

    // PHASE 1: OBSERVE — Gather wallet data
    onProgress?.("OBSERVE: Gathering wallet data...");

    const walletHistory = await executeTool(
      "fetch_transaction_history",
      { wallet_address: walletAddress },
      demoMode
    );

    const walletMaturity = await executeTool(
      "analyze_wallet_maturity",
      { wallet_address: walletAddress },
      demoMode
    );

    // PHASE 2: THINK — Let Gemini analyze without tool loops
    onProgress?.("THINK: AI analyzing patterns...");

    const prompt = `${CREDCHAIN_SYSTEM_PROMPT}\n\nAnalyze this Solana wallet and generate a comprehensive credit score: ${walletAddress}\n\nWallet History: ${JSON.stringify(walletHistory)}\n\nWallet Maturity: ${JSON.stringify(walletMaturity)}\n\nPlease analyze this data, then calculate a score from 0-850 based on the CredChain scoring methodology. Provide detailed reasoning for each category score.`;

    const response = await getAI().models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const reasoning = response.text || "No reasoning provided by Gemini.";

    // PHASE 3: SCORE — Calculate final score
    onProgress?.("SCORE: Calculating final credit score...");

    const credScore = calculateCredScore(walletHistory, {
      accountAgeDays: walletMaturity.accountAgeDays || 0,
      transactionConsistency: walletMaturity.transactionConsistency || 0,
      balanceVolatility: walletMaturity.balanceVolatility || 0,
    });

    onReasoningUpdate?.(reasoning, "final_analysis");

    reasoningSteps.push({
      category: "final_analysis",
      reasoning,
      timestamp: Date.now(),
    });

    // PHASE 4: RETURN — Build final CredScore object
    const finalScore: CredScore = {
      ...credScore,
      timestamp: Date.now(),
      history: [
        {
          date: Date.now(),
          score: credScore.score,
          change: 0,
        },
      ],
      benefits: [],
      aiReasoning: reasoningSteps.map((step) => ({
        category: step.category,
        reasoning: step.reasoning,
        impact: "positive",
        timestamp: step.timestamp,
      })),
    };

    onProgress?.("COMPLETE: Analysis finished!");

    return {
      success: true,
      score: finalScore,
      reasoningSteps,
    };
  } catch (error) {
    console.error("CredChain Agent Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      reasoningSteps,
    };
  }
}

/**
 * Run demo analysis with simulated streaming
 */
async function runDemoAnalysis(
  walletAddress: string,
  onReasoningUpdate?: (reasoning: string, category?: string) => void,
  onProgress?: (step: string) => void
): Promise<AgentAnalysisResult> {
  const reasoningSteps: Array<{
    category: string;
    reasoning: string;
    timestamp: number;
  }> = [];

  // Simulate analysis steps with delays
  const steps = [
    {
      phase: "OBSERVE",
      category: "data_gathering",
      reasoning: "Fetching transaction history... Found 547 days of activity with 234 transactions.",
      delay: 800,
    },
    {
      phase: "OBSERVE",
      category: "loan_analysis",
      reasoning: "Analyzing loan positions... Detected 4 loans across Marginfi and Solend. All perfectly repaid with zero liquidations.",
      delay: 1000,
    },
    {
      phase: "THINK",
      category: "pattern_detection",
      reasoning: "Identifying behavioral patterns... Consistent weekly activity, stable balance management, disciplined trading.",
      delay: 1200,
    },
    {
      phase: "THINK",
      category: "risk_assessment",
      reasoning: "Assessing risk factors... No liquidations found. Mature wallet (1.5 years). Excellent repayment history (100% rate).",
      delay: 1000,
    },
    {
      phase: "SCORE",
      category: "loan_repayment",
      reasoning: "Loan Repayment: 255/255 points. Perfect repayment rate (100%), zero liquidations, low debt-to-income ratio, good protocol diversity.",
      delay: 900,
    },
    {
      phase: "SCORE",
      category: "wallet_maturity",
      reasoning: "Wallet Maturity: 145/170 points. Established wallet (547 days), weekly transaction consistency, stable balance.",
      delay: 900,
    },
    {
      phase: "SCORE",
      category: "trading_behavior",
      reasoning: "Trading Behavior: 140/170 points. Strong win rate (67%), profitable trading ($45K profit), medium-term holding strategy.",
      delay: 900,
    },
    {
      phase: "SCORE",
      category: "lp_commitment",
      reasoning: "LP Commitment: 115/128 points. Long-term LP provider (avg 245 days), profitable despite impermanent loss, high capital efficiency.",
      delay: 900,
    },
    {
      phase: "SCORE",
      category: "community",
      reasoning: "Community: 87/127 points. Active governance participant (23 votes across 5 DAOs), engaged community member.",
      delay: 900,
    },
    {
      phase: "RETURN",
      category: "final_score",
      reasoning: "Final Score: 742/850 (GOOD tier). Consistent, trustworthy DeFi participant with excellent lending history and strong community engagement.",
      delay: 1000,
    },
  ];

  for (const step of steps) {
    await new Promise((resolve) => setTimeout(resolve, step.delay));

    onProgress?.(`${step.phase}: ${step.reasoning.split("...")[0]}...`);
    onReasoningUpdate?.(step.reasoning, step.category);

    reasoningSteps.push({
      category: step.category,
      reasoning: step.reasoning,
      timestamp: Date.now(),
    });
  }

  // Return demo score with AI reasoning
  const demoScore: CredScore = {
    ...DEMO_CRED_SCORE,
    aiReasoning: reasoningSteps.map((step) => ({
      category: step.category,
      reasoning: step.reasoning,
      impact: "positive",
      timestamp: step.timestamp,
    })),
  };

  return {
    success: true,
    score: demoScore,
    reasoningSteps,
  };
}

/**
 * Validate wallet address format
 */
export function validateSolanaAddress(address: string): boolean {
  // Basic Solana address validation (base58, 32-44 chars)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

/**
 * Get estimated analysis time
 */
export function getEstimatedAnalysisTime(demoMode: boolean): number {
  return demoMode ? 8000 : 30000; // 8s for demo, 30s for live
}
