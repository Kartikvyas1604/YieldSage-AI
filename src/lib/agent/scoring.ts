/**
 * Score calculation logic for CredChain AI
 * Implements the 20-signal scoring methodology across 5 categories
 */

import { CredScore, CategoryScore } from "@/types/score";
import {
  WalletHistory,
  LoanPosition,
  TradingStats,
  LPPosition,
  GovernanceVote,
} from "@/types/wallet";
import { getScoreTier } from "@/types/score";

/**
 * Calculate Loan Repayment score (maximum 255 points, 30% of total)
 */
export function calculateLoanRepaymentScore(loans: LoanPosition[]): {
  score: number;
  breakdown: Record<string, number>;
  reasoning: string[];
} {
  const breakdown: Record<string, number> = {};
  const reasoning: string[] = [];

  if (loans.length === 0) {
    return {
      score: 0,
      breakdown: {},
      reasoning: ["No loan history found"],
    };
  }

  // 1. Repayment Rate (0-100 points)
  const repaidLoans = loans.filter(
    (loan) => loan.status === "repaid" && !loan.liquidated
  );
  const repaymentRate = repaidLoans.length / loans.length;
  let repaymentScore = 0;
  if (repaymentRate === 1.0) {
    repaymentScore = 100;
    reasoning.push("Perfect repayment rate (100%)");
  } else if (repaymentRate >= 0.95) {
    repaymentScore = 85;
    reasoning.push(`Excellent repayment rate (${(repaymentRate * 100).toFixed(1)}%)`);
  } else if (repaymentRate >= 0.9) {
    repaymentScore = 70;
    reasoning.push(`Good repayment rate (${(repaymentRate * 100).toFixed(1)}%)`);
  } else {
    repaymentScore = Math.max(0, repaymentRate * 100);
    reasoning.push(`Fair repayment rate (${(repaymentRate * 100).toFixed(1)}%)`);
  }
  breakdown.repaymentRate = repaymentScore;

  // 2. Liquidation Count (0-60 points)
  const liquidations = loans.filter((loan) => loan.liquidated).length;
  let liquidationScore = 0;
  if (liquidations === 0) {
    liquidationScore = 60;
    reasoning.push("Zero liquidations");
  } else if (liquidations <= 2) {
    liquidationScore = 30;
    reasoning.push(`${liquidations} liquidation(s) - moderate risk`);
  } else {
    liquidationScore = 0;
    reasoning.push(`${liquidations} liquidations - high risk`);
  }
  breakdown.liquidationCount = liquidationScore;

  // 3. Debt-to-Income Ratio (0-50 points) - simplified calculation
  const activeLoans = loans.filter((loan) => loan.status === "active");
  const totalDebt = activeLoans.reduce((sum, loan) => sum + loan.borrowed, 0);
  // Estimate income as 10% of total borrowed over lifetime (simplified)
  const estimatedIncome = loans.reduce((sum, loan) => sum + loan.borrowed, 0) * 0.1;
  const debtToIncome = estimatedIncome > 0 ? totalDebt / estimatedIncome : 0;
  
  let dtiScore = 0;
  if (debtToIncome < 0.3) {
    dtiScore = 50;
    reasoning.push(`Low debt-to-income ratio (${(debtToIncome * 100).toFixed(0)}%)`);
  } else if (debtToIncome < 0.5) {
    dtiScore = 30;
    reasoning.push(`Moderate debt-to-income ratio (${(debtToIncome * 100).toFixed(0)}%)`);
  } else {
    dtiScore = 10;
    reasoning.push(`High debt-to-income ratio (${(debtToIncome * 100).toFixed(0)}%)`);
  }
  breakdown.debtToIncome = dtiScore;

  // 4. Loan Diversity (0-45 points)
  const protocols = new Set(loans.map((loan) => loan.protocol));
  let diversityScore = 0;
  if (protocols.size >= 3) {
    diversityScore = 45;
    reasoning.push(`Excellent loan diversity (${protocols.size} protocols)`);
  } else if (protocols.size === 2) {
    diversityScore = 30;
    reasoning.push(`Good loan diversity (${protocols.size} protocols)`);
  } else {
    diversityScore = 15;
    reasoning.push(`Limited loan diversity (${protocols.size} protocol)`);
  }
  breakdown.loanDiversity = diversityScore;

  const totalScore = repaymentScore + liquidationScore + dtiScore + diversityScore;

  return { score: totalScore, breakdown, reasoning };
}

/**
 * Calculate Wallet Maturity score (maximum 170 points, 20% of total)
 */
export function calculateWalletMaturityScore(
  accountAgeDays: number,
  transactionCount: number,
  transactionConsistency: "daily" | "weekly" | "monthly" | "sporadic",
  balanceVolatility: number
): {
  score: number;
  breakdown: Record<string, number>;
  reasoning: string[];
} {
  const breakdown: Record<string, number> = {};
  const reasoning: string[] = [];

  // 1. Account Age (0-70 points)
  let ageScore = 0;
  if (accountAgeDays > 730) {
    // > 2 years
    ageScore = 70;
    reasoning.push(`Mature wallet (${Math.floor(accountAgeDays / 365)} years old)`);
  } else if (accountAgeDays > 365) {
    // 1-2 years
    ageScore = 50;
    reasoning.push(`Established wallet (${Math.floor(accountAgeDays / 365)} year old)`);
  } else if (accountAgeDays > 180) {
    // 6-12 months
    ageScore = 30;
    reasoning.push(`Growing wallet (${Math.floor(accountAgeDays / 30)} months old)`);
  } else {
    ageScore = 10;
    reasoning.push(`New wallet (${Math.floor(accountAgeDays / 30)} months old)`);
  }
  breakdown.accountAge = ageScore;

  // 2. Transaction Consistency (0-50 points)
  let consistencyScore = 0;
  switch (transactionConsistency) {
    case "daily":
      consistencyScore = 50;
      reasoning.push("Daily transaction activity");
      break;
    case "weekly":
      consistencyScore = 35;
      reasoning.push("Weekly transaction activity");
      break;
    case "monthly":
      consistencyScore = 20;
      reasoning.push("Monthly transaction activity");
      break;
    case "sporadic":
      consistencyScore = 5;
      reasoning.push("Sporadic transaction activity");
      break;
  }
  breakdown.transactionConsistency = consistencyScore;

  // 3. Balance Stability (0-30 points)
  let stabilityScore = 0;
  if (balanceVolatility < 0.2) {
    stabilityScore = 30;
    reasoning.push("Stable balance management");
  } else if (balanceVolatility < 0.5) {
    stabilityScore = 15;
    reasoning.push("Moderate balance volatility");
  } else {
    stabilityScore = 5;
    reasoning.push("High balance volatility");
  }
  breakdown.balanceStability = stabilityScore;

  // 4. Tenure Score (0-20 points) - continuity bonus
  const tenureScore = transactionConsistency === "daily" || transactionConsistency === "weekly" ? 20 : 10;
  breakdown.tenureScore = tenureScore;

  const totalScore = ageScore + consistencyScore + stabilityScore + tenureScore;

  return { score: totalScore, breakdown, reasoning };
}

/**
 * Calculate Trading Behavior score (maximum 170 points, 20% of total)
 */
export function calculateTradingBehaviorScore(trading: TradingStats): {
  score: number;
  breakdown: Record<string, number>;
  reasoning: string[];
} {
  const breakdown: Record<string, number> = {};
  const reasoning: string[] = [];

  if (trading.totalTrades === 0) {
    return {
      score: 0,
      breakdown: {},
      reasoning: ["No trading history found"],
    };
  }

  // 1. Win Rate (0-60 points)
  const winRate = trading.winRate;
  let winRateScore = 0;
  if (winRate > 0.6) {
    winRateScore = 60;
    reasoning.push(`Excellent win rate (${(winRate * 100).toFixed(1)}%)`);
  } else if (winRate >= 0.5) {
    winRateScore = 40;
    reasoning.push(`Good win rate (${(winRate * 100).toFixed(1)}%)`);
  } else if (winRate >= 0.4) {
    winRateScore = 20;
    reasoning.push(`Fair win rate (${(winRate * 100).toFixed(1)}%)`);
  } else {
    winRateScore = 5;
    reasoning.push(`Poor win rate (${(winRate * 100).toFixed(1)}%)`);
  }
  breakdown.winRate = winRateScore;

  // 2. Risk-Adjusted Returns (0-50 points) - using profitability as proxy
  const profitability = trading.totalProfit / (trading.totalVolume || 1);
  let returnsScore = 0;
  if (profitability > 0.05) {
    // > 5% profit on volume
    returnsScore = 50;
    reasoning.push("Strong risk-adjusted returns");
  } else if (profitability > 0.02) {
    returnsScore = 30;
    reasoning.push("Good risk-adjusted returns");
  } else if (profitability > 0) {
    returnsScore = 15;
    reasoning.push("Modest risk-adjusted returns");
  } else {
    returnsScore = 5;
    reasoning.push("Negative returns");
  }
  breakdown.riskAdjustedReturns = returnsScore;

  // 3. Position Sizing (0-30 points) - consistency in trade sizes
  const avgTradeSize = trading.averageTradeSize;
  let positionSizingScore = 0;
  if (avgTradeSize > 100 && avgTradeSize < 10000) {
    // Reasonable trade sizes
    positionSizingScore = 30;
    reasoning.push("Consistent position sizing");
  } else if (avgTradeSize > 10) {
    positionSizingScore = 15;
    reasoning.push("Variable position sizing");
  } else {
    positionSizingScore = 5;
    reasoning.push("Erratic position sizing");
  }
  breakdown.positionSizing = positionSizingScore;

  // 4. Average Hold Time (0-30 points)
  const avgHoldDays = trading.avgHoldTime / (24 * 60 * 60 * 1000); // Convert ms to days
  let holdTimeScore = 0;
  if (avgHoldDays > 30) {
    holdTimeScore = 30;
    reasoning.push(`Long-term holder (${avgHoldDays.toFixed(0)} days avg)`);
  } else if (avgHoldDays > 7) {
    holdTimeScore = 20;
    reasoning.push(`Medium-term trader (${avgHoldDays.toFixed(0)} days avg)`);
  } else {
    holdTimeScore = 5;
    reasoning.push(`Short-term trader (${avgHoldDays.toFixed(0)} days avg)`);
  }
  breakdown.avgHoldTime = holdTimeScore;

  const totalScore = winRateScore + returnsScore + positionSizingScore + holdTimeScore;

  return { score: totalScore, breakdown, reasoning };
}

/**
 * Calculate LP Commitment score (maximum 128 points, 15% of total)
 */
export function calculateLPCommitmentScore(lpPositions: LPPosition[]): {
  score: number;
  breakdown: Record<string, number>;
  reasoning: string[];
} {
  const breakdown: Record<string, number> = {};
  const reasoning: string[] = [];

  if (lpPositions.length === 0) {
    return {
      score: 0,
      breakdown: {},
      reasoning: ["No LP positions found"],
    };
  }

  // 1. Liquidity Duration (0-50 points)
  const avgDurationDays =
    lpPositions.reduce((sum, pos) => sum + pos.durationDays, 0) /
    lpPositions.length;
  let durationScore = 0;
  if (avgDurationDays > 180) {
    durationScore = 50;
    reasoning.push(`Long-term LP (${avgDurationDays.toFixed(0)} days avg)`);
  } else if (avgDurationDays > 90) {
    durationScore = 30;
    reasoning.push(`Medium-term LP (${avgDurationDays.toFixed(0)} days avg)`);
  } else {
    durationScore = 15;
    reasoning.push(`Short-term LP (${avgDurationDays.toFixed(0)} days avg)`);
  }
  breakdown.liquidityDuration = durationScore;

  // 2. Impermanent Loss Handling (0-38 points)
  const avgIL =
    lpPositions.reduce((sum, pos) => sum + pos.impermanentLoss, 0) /
    lpPositions.length;
  const totalFeesEarned = lpPositions.reduce(
    (sum, pos) => sum + pos.feesEarned,
    0
  );
  const totalValue = lpPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const netReturn = (totalFeesEarned + avgIL) / totalValue;

  let ilScore = 0;
  if (netReturn > 0.05) {
    ilScore = 38;
    reasoning.push("Profitable LP despite impermanent loss");
  } else if (netReturn > 0) {
    ilScore = 20;
    reasoning.push("Break-even LP performance");
  } else {
    ilScore = 5;
    reasoning.push("Negative LP returns");
  }
  breakdown.impermanentLossHandling = ilScore;

  // 3. Capital Efficiency (0-40 points)
  const totalLiquidity = lpPositions.reduce(
    (sum, pos) => sum + pos.currentValue,
    0
  );
  const capitalEfficiency = (totalFeesEarned / totalLiquidity) * 365; // Annualized

  let efficiencyScore = 0;
  if (capitalEfficiency > 0.15) {
    // > 15% APR
    efficiencyScore = 40;
    reasoning.push(`High capital efficiency (${(capitalEfficiency * 100).toFixed(1)}% APR)`);
  } else if (capitalEfficiency > 0.08) {
    efficiencyScore = 25;
    reasoning.push(`Good capital efficiency (${(capitalEfficiency * 100).toFixed(1)}% APR)`);
  } else {
    efficiencyScore = 10;
    reasoning.push(`Modest capital efficiency (${(capitalEfficiency * 100).toFixed(1)}% APR)`);
  }
  breakdown.capitalEfficiency = efficiencyScore;

  const totalScore = durationScore + ilScore + efficiencyScore;

  return { score: totalScore, breakdown, reasoning };
}

/**
 * Calculate Community score (maximum 127 points, 15% of total)
 */
export function calculateCommunityScore(governance: GovernanceVote[]): {
  score: number;
  breakdown: Record<string, number>;
  reasoning: string[];
} {
  const breakdown: Record<string, number> = {};
  const reasoning: string[] = [];

  if (governance.length === 0) {
    return {
      score: 15,
      breakdown: { baseScore: 15 },
      reasoning: ["No governance participation yet"],
    };
  }

  // 1. Governance Participation (0-60 points)
  const voteCount = governance.length;
  let participationScore = 0;
  if (voteCount > 20) {
    participationScore = 60;
    reasoning.push(`Active governance participant (${voteCount} votes)`);
  } else if (voteCount > 10) {
    participationScore = 40;
    reasoning.push(`Regular governance voter (${voteCount} votes)`);
  } else if (voteCount > 0) {
    participationScore = 20;
    reasoning.push(`Occasional governance voter (${voteCount} votes)`);
  }
  breakdown.governanceParticipation = participationScore;

  // 2. DAO Contributions (0-37 points)
  const daos = new Set(governance.map((vote) => vote.dao));
  let contributionScore = 0;
  if (daos.size >= 5) {
    contributionScore = 37;
    reasoning.push(`Contributors to ${daos.size} DAOs`);
  } else if (daos.size >= 3) {
    contributionScore = 25;
    reasoning.push(`Active in ${daos.size} DAOs`);
  } else {
    contributionScore = 10;
    reasoning.push(`Active in ${daos.size} DAO(s)`);
  }
  breakdown.daoContributions = contributionScore;

  // 3. Reputation (0-30 points) - based on consistency
  const recentVotes = governance.filter(
    (vote) => Date.now() - vote.timestamp < 90 * 24 * 60 * 60 * 1000
  ).length; // Last 90 days
  let reputationScore = 0;
  if (recentVotes > 5) {
    reputationScore = 30;
    reasoning.push("Actively engaged community member");
  } else if (recentVotes > 0) {
    reputationScore = 15;
    reasoning.push("Engaged community member");
  } else {
    reputationScore = 5;
    reasoning.push("Previously active community member");
  }
  breakdown.reputation = reputationScore;

  const totalScore = participationScore + contributionScore + reputationScore;

  return { score: totalScore, breakdown, reasoning };
}

/**
 * Main function to calculate complete CredScore
 */
export function calculateCredScore(
  walletHistory: WalletHistory,
  walletMaturity: {
    accountAgeDays: number;
    transactionConsistency: "daily" | "weekly" | "monthly" | "sporadic";
    balanceVolatility: number;
  }
): Omit<CredScore, "timestamp" | "history" | "benefits"> {
  // Calculate each category
  const loanRepayment = calculateLoanRepaymentScore(walletHistory.loans);
  const walletMaturityScore = calculateWalletMaturityScore(
    walletMaturity.accountAgeDays,
    walletHistory.transactions.length,
    walletMaturity.transactionConsistency,
    walletMaturity.balanceVolatility
  );
  const tradingBehavior = calculateTradingBehaviorScore(walletHistory.trading);
  const lpCommitment = calculateLPCommitmentScore(walletHistory.lpPositions);
  const community = calculateCommunityScore(walletHistory.governance);

  // Calculate final score (0-850)
  const finalScore = Math.min(
    850,
    Math.round(
      loanRepayment.score +
        walletMaturityScore.score +
        tradingBehavior.score +
        lpCommitment.score +
        community.score
    )
  );

  const tier = getScoreTier(finalScore);

  // Build category breakdown
  const categories: Record<string, CategoryScore> = {
    loanRepayment: {
      score: loanRepayment.score,
      maxScore: 255,
      weight: 30,
      signals: loanRepayment.reasoning,
    },
    walletMaturity: {
      score: walletMaturityScore.score,
      maxScore: 170,
      weight: 20,
      signals: walletMaturityScore.reasoning,
    },
    tradingBehavior: {
      score: tradingBehavior.score,
      maxScore: 170,
      weight: 20,
      signals: tradingBehavior.reasoning,
    },
    lpCommitment: {
      score: lpCommitment.score,
      maxScore: 128,
      weight: 15,
      signals: lpCommitment.reasoning,
    },
    community: {
      score: community.score,
      maxScore: 127,
      weight: 15,
      signals: community.reasoning,
    },
  };

  // Detect risk flags
  const riskFlags = [];
  if (walletHistory.loans.some((loan) => loan.liquidated)) {
    riskFlags.push({
      type: "liquidation" as const,
      severity: "high" as const,
      description: "Past liquidations detected",
    });
  }
  if (walletMaturity.accountAgeDays < 90) {
    riskFlags.push({
      type: "new_wallet" as const,
      severity: "medium" as const,
      description: "Wallet is less than 90 days old",
    });
  }

  // Identify positive factors
  const positiveFactors = [];
  if (loanRepayment.score >= 240) {
    positiveFactors.push({
      factor: "Perfect loan repayment history",
      impact: "Excellent creditworthiness",
    });
  }
  if (walletMaturity.accountAgeDays > 730) {
    positiveFactors.push({
      factor: "Long-term Solana participant",
      impact: "Proven reliability",
    });
  }
  if (community.score > 80) {
    positiveFactors.push({
      factor: "Active governance participant",
      impact: "Strong community reputation",
    });
  }

  // Generate improvement tips
  const improvementTips = [];
  if (loanRepayment.score < 200 && walletHistory.loans.length > 0) {
    improvementTips.push({
      category: "Loan Repayment",
      suggestion: "Focus on timely loan repayments to build trust",
      potentialGain: 50,
    });
  }
  if (community.score < 50) {
    improvementTips.push({
      category: "Community",
      suggestion: "Participate in DAO governance to boost your score",
      potentialGain: 40,
    });
  }
  if (lpCommitment.score < 50 && walletHistory.lpPositions.length === 0) {
    improvementTips.push({
      category: "LP Commitment",
      suggestion: "Provide liquidity on DEXes to demonstrate commitment",
      potentialGain: 60,
    });
  }

  return {
    walletAddress: walletHistory.walletAddress,
    score: finalScore,
    tier,
    categories,
    riskFlags,
    positiveFactors,
    improvementTips,
    aiReasoning: [],
  };
}
