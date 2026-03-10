/**
 * CredChain AI Agent — Real on-chain analysis pipeline
 * OBSERVE (Helius/RPC) → THINK (Gemini 2.5) → SCORE (structured JSON) → RETURN
 */

import { GoogleGenAI } from "@google/genai";
import { CredScore, ScoreBreakdown, RiskFlag, ImprovementTip, ScoreTier, getScoreTier } from "@/types/score";
import { CREDCHAIN_SYSTEM_PROMPT } from "./prompts";
import { fetchWalletOnChainData } from "./tools";

// Lazy client — avoids build-time crash when env var is absent.
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  return new GoogleGenAI({ apiKey });
}

export interface AgentAnalysisOptions {
  walletAddress: string;
  onReasoningUpdate?: (reasoning: string, category?: string) => void;
  onProgress?: (step: string) => void;
}

export interface AgentAnalysisResult {
  success: boolean;
  score?: CredScore;
  error?: string;
  reasoningSteps: Array<{ category: string; reasoning: string; timestamp: number }>;
}

export async function runCredChainAgent(
  options: AgentAnalysisOptions
): Promise<AgentAnalysisResult> {
  const { walletAddress, onReasoningUpdate, onProgress } = options;
  const reasoningSteps: Array<{ category: string; reasoning: string; timestamp: number }> = [];

  try {
    // ── PHASE 1: OBSERVE ─────────────────────────────────────
    onProgress?.("OBSERVE: Fetching live on-chain data…");
    const walletData = await fetchWalletOnChainData(walletAddress);

    const observeSummary =
      `Wallet age: ${walletData.walletAgeDays} days | ` +
      `Transactions: ${walletData.totalTransactions} (${walletData.successfulTransactions} successful) | ` +
      `SOL balance: ${walletData.solBalance.toFixed(3)} SOL | ` +
      `Tokens held: ${walletData.tokenCount} | ` +
      `Lending protocols: ${walletData.defiActivity.lendingProtocols.join(', ') || 'none'} | ` +
      `DEXs used: ${walletData.defiActivity.dexProtocols.join(', ') || 'none'} | ` +
      `LP protocols: ${walletData.defiActivity.lpProtocols.join(', ') || 'none'} | ` +
      `Governance: ${walletData.defiActivity.governanceProtocols.join(', ') || 'none'}`;

    onProgress?.("OBSERVE: On-chain data collected.");
    onReasoningUpdate?.(observeSummary, "data_gathering");
    reasoningSteps.push({ category: "data_gathering", reasoning: observeSummary, timestamp: Date.now() });

    // ── PHASE 2: THINK ───────────────────────────────────────
    onProgress?.("THINK: Gemini AI analyzing patterns…");

    const dataPayload = {
      walletAddress,
      solBalance: walletData.solBalance,
      totalTransactions: walletData.totalTransactions,
      successfulTransactions: walletData.successfulTransactions,
      walletAgeDays: walletData.walletAgeDays,
      firstTxDate: walletData.firstTxDate,
      lastTxDate: walletData.lastTxDate,
      tokenCount: walletData.tokenCount,
      topTokenHoldings: walletData.tokenHoldings.slice(0, 10),
      defiActivity: walletData.defiActivity,
    };

    const prompt =
      `${CREDCHAIN_SYSTEM_PROMPT}\n\n` +
      `## Real On-Chain Data\n\n` +
      `\`\`\`json\n${JSON.stringify(dataPayload, null, 2)}\n\`\`\`\n\n` +
      `Generate the credit score JSON now. Return ONLY the JSON object.`;

    const response = await getAI().models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text ?? "";

    // ── PHASE 3: PARSE ───────────────────────────────────────
    onProgress?.("SCORE: Parsing AI score…");

    let parsed: Record<string, unknown>;
    try {
      const jsonMatch =
        rawText.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        rawText.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawText.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      throw new Error(`Gemini returned non-JSON: ${rawText.slice(0, 300)}`);
    }

    // Emit per-category reasoning
    for (const [cat, item] of Object.entries(parsed.breakdown ?? {})) {
      const r = (item as Record<string, unknown>).reasoning as string ?? "";
      onReasoningUpdate?.(r, cat);
      reasoningSteps.push({ category: cat, reasoning: r, timestamp: Date.now() });
    }

    const summary = parsed.summary as string | undefined;
    if (summary) {
      onReasoningUpdate?.(summary, "summary");
      reasoningSteps.push({ category: "summary", reasoning: summary, timestamp: Date.now() });
    }

    // ── PHASE 4: BUILD RESULT ────────────────────────────────
    const finalScore: CredScore = {
      walletAddress,
      score: Number(parsed.score),
      tier: (parsed.tier as ScoreTier) ?? getScoreTier(Number(parsed.score)),
      breakdown: parsed.breakdown as ScoreBreakdown | undefined,
      riskFlags: (parsed.riskFlags as RiskFlag[]) ?? [],
      positiveFactors: [],
      improvementTips: (parsed.improvementTips as ImprovementTip[]) ?? [],
      aiReasoning: reasoningSteps.map(s => ({
        category: s.category,
        reasoning: s.reasoning,
        impact: "positive",
        timestamp: s.timestamp,
      })),
      timestamp: Date.now(),
      history: [{ date: Date.now(), score: Number(parsed.score), change: 0 }],
      benefits: [],
    };

    onProgress?.("COMPLETE: Analysis finished!");
    return { success: true, score: finalScore, reasoningSteps };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      reasoningSteps,
    };
  }
}

/** Validate a Solana wallet address (base58, 32–44 chars). */
export function validateSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function getEstimatedAnalysisTime(): number {
  return 20_000; // ~20 s for real analysis
}
