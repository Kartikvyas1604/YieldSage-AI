import {
  CredScore, getScoreTier,
  RiskFlag, ImprovementTip,
} from "@/types/score";
import { LoanPosition, LPPosition, TradingStats, GovernanceVote } from "@/types/wallet";
import { fetchWalletOnChainData, WalletOnChainData } from "./tools";
import {
  calculateLoanRepaymentScore,
  calculateWalletMaturityScore,
  calculateTradingBehaviorScore,
  calculateLPCommitmentScore,
  calculateCommunityScore,
} from "./scoring";

/**
 * Build a deterministic CredScore directly from raw on-chain data.
 * No AI model — same data always produces the same score.
 */
function scoreFromOnChain(data: WalletOnChainData): CredScore {
  const { walletAddress, walletAgeDays, totalTransactions, defiActivity, solBalance } = data;

  // ── Wallet Maturity ───────────────────────────────────────
  const txPerDay = totalTransactions / Math.max(walletAgeDays, 1);
  const consistency =
    txPerDay >= 0.7 ? 'daily' :
    txPerDay >= 0.15 ? 'weekly' :
    txPerDay >= 0.03 ? 'monthly' : 'sporadic';

  // Rough balance volatility estimate: low balance → more volatile spending
  const balanceVolatility = solBalance > 10 ? 0.15 : solBalance > 1 ? 0.35 : 0.65;

  const maturityResult = calculateWalletMaturityScore(
    walletAgeDays, totalTransactions, consistency, balanceVolatility
  );

  // ── Loan Repayment ─────────────────────────────────────────
  // We only know which lending protocols were used, not individual loan details.
  // Assume each seen protocol represents a successfully repaid loan
  // (a liquidated wallet typically stops using lending — still active means repaid).
  const syntheticLoans: LoanPosition[] = defiActivity.lendingProtocols.map(protocol => ({
    protocol,
    amount: 1000,
    currency: 'USDC',
    repaid: true,
    status: 'repaid' as const,
    borrowed: 1000,
    liquidated: false,
    loanDate: new Date(Date.now() - Math.floor(walletAgeDays / 2) * 86400000),
    repaymentDate: new Date(),
  }));

  const loanResult = calculateLoanRepaymentScore(syntheticLoans);

  // ── Trading Behavior ──────────────────────────────────────
  const tradingStats: TradingStats = {
    totalTrades: defiActivity.tradingTxCount,
    // Neutral 50% win-rate assumption since we don't have P&L data
    winRate: defiActivity.tradingTxCount > 0 ? 0.5 : 0,
    totalProfit: 0,
    totalVolume: defiActivity.tradingTxCount * 500,
    averageTradeSize: defiActivity.tradingTxCount > 0 ? 500 : 0,
    avgHoldTime: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    washTradingDetected: false,
    rugPullParticipation: false,
    tokensCreated: 0,
    averagePnl: '0%',
    riskScore: 'MEDIUM' as const,
    profitableTrades: Math.floor(defiActivity.tradingTxCount * 0.5),
    losingTrades: Math.ceil(defiActivity.tradingTxCount * 0.5),
  };

  const tradingResult = calculateTradingBehaviorScore(tradingStats);

  // ── LP Commitment ─────────────────────────────────────────
  const syntheticLP: LPPosition[] = defiActivity.lpProtocols.map(protocol => ({
    protocol,
    pair: 'SOL-USDC',
    durationDays: Math.min(walletAgeDays, 90),
    feesEarned: 50,
    currentValue: 1000,
    impermanentLoss: -10,
    startDate: new Date(Date.now() - Math.min(walletAgeDays, 90) * 86400000),
  }));

  const lpResult = calculateLPCommitmentScore(syntheticLP);

  // ── Community / Governance ────────────────────────────────
  const syntheticVotes: GovernanceVote[] = Array.from(
    { length: defiActivity.governanceTxCount },
    (_, i) => {
      const proto =
        defiActivity.governanceProtocols[i % Math.max(defiActivity.governanceProtocols.length, 1)] ||
        'Unknown';
      const ts = Date.now() - i * 7 * 86400000;
      return {
        dao: proto,
        protocol: proto,
        proposalId: `PROP-${i}`,
        voteDate: new Date(ts),
        timestamp: ts,
        voteChoice: 'For',
        votingPower: 100,
      };
    }
  );

  const communityResult = calculateCommunityScore(syntheticVotes);

  // ── Final score (max 850) ─────────────────────────────────
  const finalScore = Math.min(
    850,
    Math.round(
      loanResult.score +
      maturityResult.score +
      tradingResult.score +
      lpResult.score +
      communityResult.score
    )
  );

  const tier = getScoreTier(finalScore);

  // ── Risk flags ────────────────────────────────────────────
  const riskFlags: RiskFlag[] = [];
  if (walletAgeDays < 90) {
    riskFlags.push({ type: 'new_wallet', severity: 'medium', description: 'Wallet is less than 90 days old' });
  }
  if (solBalance < 0.05) {
    riskFlags.push({ type: 'low_balance', severity: 'low', description: 'Very low SOL balance' });
  }

  // ── Improvement tips ──────────────────────────────────────
  const improvementTips: ImprovementTip[] = [];
  if (defiActivity.lendingProtocols.length === 0) {
    improvementTips.push({ category: 'Loan Repayment', suggestion: 'Use a lending protocol (Marginfi, Kamino) and repay on time to build credit history', potentialGain: 80 });
  }
  if (defiActivity.governanceTxCount === 0) {
    improvementTips.push({ category: 'Community', suggestion: 'Participate in DAO governance via Realms to boost your community score', potentialGain: 40 });
  }
  if (defiActivity.lpProtocols.length === 0) {
    improvementTips.push({ category: 'LP Commitment', suggestion: 'Provide liquidity on Orca or Raydium to demonstrate on-chain commitment', potentialGain: 60 });
  }

  // ── Build reasoning log ───────────────────────────────────
  const now = Date.now();
  const aiReasoning = [
    { category: 'data_gathering',  reasoning: `Wallet age: ${walletAgeDays} days | Txns: ${totalTransactions} | SOL: ${solBalance.toFixed(3)} | Tokens: ${data.tokenCount} | Lending: ${defiActivity.lendingProtocols.join(', ') || 'none'} | DEXs: ${defiActivity.dexProtocols.join(', ') || 'none'} | LP: ${defiActivity.lpProtocols.join(', ') || 'none'} | Gov: ${defiActivity.governanceProtocols.join(', ') || 'none'}`, impact: 'positive' as const, timestamp: now },
    { category: 'walletMaturity',  reasoning: maturityResult.reasoning.join(' | '), impact: 'positive' as const, timestamp: now + 1 },
    { category: 'loanRepayment',   reasoning: loanResult.reasoning.join(' | '), impact: 'positive' as const, timestamp: now + 2 },
    { category: 'tradingBehavior', reasoning: tradingResult.reasoning.join(' | '), impact: 'positive' as const, timestamp: now + 3 },
    { category: 'lpCommitment',    reasoning: lpResult.reasoning.join(' | '), impact: 'positive' as const, timestamp: now + 4 },
    { category: 'community',       reasoning: communityResult.reasoning.join(' | '), impact: 'positive' as const, timestamp: now + 5 },
  ];

  return {
    walletAddress,
    score: finalScore,
    tier,
    breakdown: {
      loanRepayment:   { score: loanResult.score,     maxScore: 255, weight: 30, signals: loanResult.reasoning },
      walletMaturity:  { score: maturityResult.score,  maxScore: 170, weight: 20, signals: maturityResult.reasoning },
      tradingBehavior: { score: tradingResult.score,   maxScore: 170, weight: 20, signals: tradingResult.reasoning },
      lpCommitment:    { score: lpResult.score,        maxScore: 128, weight: 15, signals: lpResult.reasoning },
      community:       { score: communityResult.score, maxScore: 127, weight: 15, signals: communityResult.reasoning },
    },
    riskFlags,
    positiveFactors: [],
    improvementTips,
    aiReasoning,
    timestamp: now,
    history: [{ date: now, score: finalScore, change: 0 }],
    benefits: [],
  };
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
      `Txns: ${walletData.totalTransactions} (${walletData.successfulTransactions} ok) | ` +
      `SOL: ${walletData.solBalance.toFixed(3)} | ` +
      `Tokens: ${walletData.tokenCount} | ` +
      `Lending: ${walletData.defiActivity.lendingProtocols.join(', ') || 'none'} | ` +
      `DEXs: ${walletData.defiActivity.dexProtocols.join(', ') || 'none'} | ` +
      `LP: ${walletData.defiActivity.lpProtocols.join(', ') || 'none'} | ` +
      `Gov: ${walletData.defiActivity.governanceProtocols.join(', ') || 'none'}`;

    onProgress?.("OBSERVE: On-chain data collected.");
    onReasoningUpdate?.(observeSummary, "data_gathering");
    reasoningSteps.push({ category: "data_gathering", reasoning: observeSummary, timestamp: Date.now() });

    // ── PHASE 2: SCORE (deterministic, no AI) ────────────────
    onProgress?.("SCORE: Calculating credit score from on-chain data…");
    const credScore = scoreFromOnChain(walletData);

    for (const r of credScore.aiReasoning ?? []) {
      const text = r.reasoning ?? '';
      if (text) {
        onReasoningUpdate?.(text, r.category);
        reasoningSteps.push({ category: r.category, reasoning: text, timestamp: Date.now() });
      }
    }

    onProgress?.("COMPLETE: Analysis finished!");
    return { success: true, score: credScore, reasoningSteps };

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
  return 8_000; // ~8 s (no AI call, just RPC fetches)
}


