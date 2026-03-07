// CredChain AI Complete Mock Data for Demo Mode

import type { WalletHistory } from '@/types/wallet';
import type { CredScore, AIReasoning } from '@/types/score';

// Demo Wallet - Sarah Chen (DeFi Developer)
export const DEMO_WALLET_ADDRESS = "Demo7xCredChainAI1234567890abcdef";

// Generate realistic dates
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const monthsAgo = (months: number) => new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000);

// Trading stats for demo wallet
const demoTradingStats: import('@/types/wallet').TradingStats = {
  totalTrades: 234,
  winRate: 0.71,
  totalProfit: 28450,
  totalVolume: 287450,
  averageTradeSize: 1228,
  avgHoldTime: 7.2,
  washTradingDetected: false,
  rugPullParticipation: false,
  tokensCreated: 0,
  averagePnl: "+12.4% monthly",
  riskScore: "MEDIUM",
  profitableTrades: 167,
  losingTrades: 67,
};

// Governance votes for demo wallet
const demoGovernanceVotes: import('@/types/wallet').GovernanceVote[] = Array.from({ length: 23 }, (_, i) => ({
  dao: ["Marinade", "Jito", "Jupiter", "Meteora"][i % 4],
  protocol: ["Marinade", "Jito", "Jupiter", "Meteora"][i % 4],
  proposalId: `PROP-${1000 + i}`,
  voteDate: daysAgo(20 + i * 10),
  timestamp: daysAgo(20 + i * 10).getTime(),
  voteChoice: ["For", "Against", "Abstain"][i % 3],
  votingPower: 100 + Math.random() * 500,
}));

export const DEMO_WALLET_HISTORY: WalletHistory = {
  walletAddress: DEMO_WALLET_ADDRESS,
  address: DEMO_WALLET_ADDRESS,
  displayName: "Sarah Chen (DeFi Developer)",
  walletAge: 547,
  totalTransactions: 1247,
  firstTransactionDate: daysAgo(547),
  lastTransactionDate: daysAgo(2),
  totalVolume: 287_450,
  stablecoinReserveRatio: 0.18,
  
  loans: [
    {
      protocol: "Marginfi",
      amount: 5000,
      currency: "USDC",
      repaid: true,
      status: 'repaid',
      borrowed: 5000,
      daysToRepay: 28,
      liquidated: false,
      loanDate: daysAgo(120),
      repaymentDate: daysAgo(92),
      interestRate: 5.2,
    },
    {
      protocol: "Marginfi",
      amount: 12000,
      currency: "USDC",
      repaid: true,
      status: 'repaid',
      borrowed: 12000,
      daysToRepay: 45,
      liquidated: false,
      loanDate: daysAgo(280),
      repaymentDate: daysAgo(235),
      interestRate: 4.8,
    },
    {
      protocol: "Solend",
      amount: 3000,
      currency: "USDC",
      repaid: true,
      status: 'repaid',
      borrowed: 3000,
      daysToRepay: 15,
      liquidated: false,
      loanDate: daysAgo(450),
      repaymentDate: daysAgo(435),
      interestRate: 6.1,
    },
    {
      protocol: "Kamino",
      amount: 8000,
      currency: "USDC",
      repaid: true,
      status: 'repaid',
      borrowed: 8000,
      daysToRepay: 60,
      liquidated: false,
      loanDate: daysAgo(365),
      repaymentDate: daysAgo(305),
      interestRate: 4.5,
    },
  ],
  
  lpPositions: [
    {
      protocol: "Meteora",
      pair: "SOL/USDC",
      durationDays: 87,
      feesEarned: 245,
      currentValue: 15245,
      impermanentLoss: -120,
      startDate: daysAgo(180),
      endDate: daysAgo(93),
      tvl: 15_000,
      apr: 12.5,
    },
    {
      protocol: "Orca",
      pair: "SOL/mSOL",
      durationDays: 134,
      feesEarned: 312,
      currentValue: 8812,
      impermanentLoss: -85,
      startDate: daysAgo(400),
      endDate: daysAgo(266),
      tvl: 8_500,
      apr: 15.2,
    },
    {
      protocol: "Raydium",
      pair: "BONK/SOL",
      durationDays: 23,
      feesEarned: 89,
      currentValue: 5289,
      impermanentLoss: -45,
      startDate: daysAgo(50),
      endDate: daysAgo(27),
      tvl: 5_200,
      apr: 28.4,
    },
  ],
  
  tradingStats: demoTradingStats,
  trading: demoTradingStats,
  
  governanceVotes: demoGovernanceVotes,
  governance: demoGovernanceVotes,
  
  nftHoldings: [
    {
      collection: "Mad Lads",
      mintAddress: "madlads123",
      acquiredDate: daysAgo(320),
      holdingDays: 320,
      purchasePrice: 45,
    },
    {
      collection: "Tensorians",
      mintAddress: "tensor456",
      acquiredDate: daysAgo(150),
      soldDate: daysAgo(80),
      holdingDays: 70,
      purchasePrice: 12,
      salePrice: 15,
    },
  ],
  
  transactions: [], // Would be populated with detailed transactions
  
  monthlyActivity: [
    { monthYear: "Jan 2026", transactionCount: 87, uniqueProtocols: 6, volume: 23_500 },
    { monthYear: "Dec 2025", transactionCount: 102, uniqueProtocols: 8, volume: 31_200 },
    { monthYear: "Nov 2025", transactionCount: 95, uniqueProtocols: 7, volume: 28_900 },
    { monthYear: "Oct 2025", transactionCount: 78, uniqueProtocols: 6, volume: 19_800 },
    { monthYear: "Sep 2025", transactionCount: 65, uniqueProtocols: 5, volume: 15_600 },
    { monthYear: "Aug 2025", transactionCount: 71, uniqueProtocols: 6, volume: 18_300 },
    { monthYear: "Jul 2025", transactionCount: 89, uniqueProtocols: 7, volume: 24_700 },
    { monthYear: "Jun 2025", transactionCount: 94, uniqueProtocols: 8, volume: 27_400 },
    { monthYear: "May 2025", transactionCount: 83, uniqueProtocols: 7, volume: 22_100 },
    { monthYear: "Apr 2025", transactionCount: 77, uniqueProtocols: 6, volume: 20_300 },
    { monthYear: "Mar 2025", transactionCount: 92, uniqueProtocols: 8, volume: 26_800 },
    { monthYear: "Feb 2025", transactionCount: 88, uniqueProtocols: 7, volume: 24_500 },
    { monthYear: "Jan 2025", transactionCount: 96, uniqueProtocols: 8, volume: 29_200 },
  ],
  
  protocolsUsed: [
    "Marginfi",
    "Solend",
    "Kamino",
    "Jupiter",
    "Raydium",
    "Orca",
    "Meteora",
    "Marinade",
    "Jito",
  ],
};

// AI Reasoning Stream for Demo
export const DEMO_AI_REASONING: AIReasoning[] = [
  {
    step: "loan_analysis",
    message: "Analyzed 4 loan positions across Marginfi, Solend, and Kamino. All 4 loans were repaid successfully with no liquidation events. Average repayment time of 37 days indicates responsible borrowing habits. This is excellent credit behavior — adding 228 points.",
    impact: "+228",
    category: "loans",
  },
  {
    step: "maturity_analysis",
    message: "Wallet is 547 days old with consistent activity across 16 of the last 18 months. I can see active usage even during the market downturn of Q3 2024, which indicates this isn't a bull-market-only wallet. Protocol diversity spans 9 unique reputable protocols. Adding 136 points for maturity.",
    impact: "+136",
    category: "maturity",
  },
  {
    step: "trading_analysis",
    message: "Reviewed 234 trading transactions. No wash trading patterns detected. No tokens created or rugged. P&L shows consistent positive performance with appropriate risk management. Win rate of 71% demonstrates trading discipline. No pump-and-dump participation detected in transaction history. Adding 136 points.",
    impact: "+136",
    category: "trading",
  },
  {
    step: "lp_analysis",
    message: "Found 3 LP positions with an average duration of 81 days. The Orca SOL/mSOL position was held for 134 days — excellent commitment. Only the BONK/SOL position (23 days) was below ideal. Overall pattern shows a committed liquidity provider rather than a mercenary LP. Adding 102 points.",
    impact: "+102",
    category: "lp",
  },
  {
    step: "community_analysis",
    message: "Governance participation rate of 74% is excellent (23 out of 31 available votes). NFT holdings show a mix of short and long-term positions. Mad Lads held for 320+ days demonstrates long-term conviction. Consistent stablecoin reserve maintained throughout history, never going below 15% in stables. Adding 89 points.",
    impact: "+89",
    category: "community",
  },
  {
    step: "risk_detection",
    message: "No red flags detected. Zero interactions with known scam contracts. No bot-like behavior patterns. No liquidation events. Trading patterns are organic and human-like. This wallet has a clean risk profile.",
    impact: "+0 (clean)",
    category: "risk",
  },
  {
    step: "final_calculation",
    message: "Final credit score: 742 / 850 — GOOD tier. This wallet demonstrates strong financial responsibility on-chain. Primary area for improvement is LP commitment consistency (the 23-day BONK position lowered the LP category score). With more consistent long-term LP positions, this score could reach EXCELLENT tier (750+). Generating credential NFT now.",
    impact: "FINAL: 742",
    category: "final",
  },
];

// Complete Demo Score Object
export const DEMO_CRED_SCORE: CredScore = {
  walletAddress: DEMO_WALLET_ADDRESS,
  score: 742,
  tier: "GOOD",
  
  breakdown: {
    loanRepayment: { score: 228, maxScore: 255, grade: "A+", trend: "stable" },
    walletMaturity: { score: 136, maxScore: 170, grade: "A", trend: "up" },
    tradingBehavior: { score: 136, maxScore: 170, grade: "A", trend: "stable" },
    lpCommitment: { score: 102, maxScore: 127.5, grade: "B+", trend: "up" },
    community: { score: 89, maxScore: 127.5, grade: "B", trend: "up" },
  },
  
  riskFlags: [], // Clean wallet - no risk flags
  
  positiveFactors: [
    {
      factor: "perfect_loan_repayment",
      type: "perfect_loan_repayment",
      description: "100% loan repayment rate across 4 loans with zero liquidations",
      impact: 50,
      category: "loans",
    },
    {
      factor: "long_term_activity",
      type: "long_term_activity",
      description: "Consistent activity for 547 days including bear market periods",
      impact: 30,
      category: "maturity",
    },
    {
      factor: "protocol_diversity",
      type: "protocol_diversity",
      description: "Active usage across 9 reputable DeFi protocols",
      impact: 25,
      category: "maturity",
    },
    {
      factor: "governance_participation",
      type: "governance_participation",
      description: "74% governance participation rate (above average)",
      impact: 20,
      category: "community",
    },
    {
      factor: "disciplined_trading",
      type: "disciplined_trading",
      description: "71% win rate with no wash trading or rug participation",
      impact: 35,
      category: "trading",
    },
    {
      factor: "committed_lp",
      type: "committed_lp",
      description: "Average LP position duration of 81 days",
      impact: 25,
      category: "lp",
    },
  ],
  
  aiReasoning: DEMO_AI_REASONING,
  
  improvementTips: [
    {
      category: "lpCommitment",
      suggestion: "Maintain all LP positions for at least 60 days",
      potentialGain: 15,
      currentState: "Average LP duration: 81 days, with one short 23-day position",
      targetState: "Maintain all LP positions for at least 60 days",
      estimatedImpact: 15,
      priority: "high",
      actions: [
        "Hold current LP positions for at least 60 days before exiting",
        "Avoid mercenary farming opportunities with high short-term APRs",
        "Focus on blue-chip pairs (SOL/USDC, SOL/mSOL) for long-term LP",
      ],
      timeframe: "2-3 months",
    },
    {
      category: "community",
      suggestion: "Increase governance participation to 90%+",
      potentialGain: 8,
      currentState: "Good governance participation (74%), but room for improvement",
      targetState: "Increase governance participation to 90%+",
      estimatedImpact: 8,
      priority: "medium",
      actions: [
        "Set up notifications for new governance proposals",
        "Participate in protocol forums and discussions",
        "Vote on all proposals for protocols you actively use",
      ],
      timeframe: "1-2 months",
    },
    {
      category: "loans",
      suggestion: "Maintain repayment streak with more frequent borrowing",
      potentialGain: 5,
      currentState: "Perfect repayment history, but limited recent activity",
      targetState: "Maintain repayment streak with more frequent borrowing",
      estimatedImpact: 5,
      priority: "low",
      actions: [
        "Take out 1-2 small loans per quarter and repay on time",
        "This proves continued creditworthiness over time",
        "Keep loan sizes manageable relative to collateral",
      ],
      timeframe: "3-6 months",
    },
  ],
  
  scoreHistory: [
    { date: monthsAgo(6), score: 695, tier: "GOOD", change: 0 },
    { date: monthsAgo(5), score: 708, tier: "GOOD", change: 13 },
    { date: monthsAgo(4), score: 715, tier: "GOOD", change: 7 },
    { date: monthsAgo(3), score: 722, tier: "GOOD", change: 7 },
    { date: monthsAgo(2), score: 730, tier: "GOOD", change: 8 },
    { date: monthsAgo(1), score: 738, tier: "GOOD", change: 8 },
    { date: now, score: 742, tier: "GOOD", change: 4 },
  ],
  
  benefitsUnlocked: [
    {
      protocol: "Marginfi",
      benefit: "Borrow $1000 with only $800 collateral (80% LTV)",
      requiresMinScore: 650,
      category: "collateral",
    },
    {
      protocol: "Marginfi",
      benefit: "0.5% interest rate reduction",
      requiresMinScore: 650,
      category: "rate",
    },
    {
      protocol: "Solend",
      benefit: "0.35% interest rate reduction",
      requiresMinScore: 650,
      category: "rate",
    },
    {
      protocol: "Jupiter",
      benefit: "25% fee reduction on swaps",
      requiresMinScore: 650,
      category: "fee",
    },
    {
      protocol: "Kamino",
      benefit: "Priority access to new vault launches",
      requiresMinScore: 700,
      category: "access",
    },
  ],
  
  lastUpdated: now,
  credentialNFT: "NFT_MOCK_ADDRESS_12345",
  credentialMinted: true,
};

// Other mock wallets for comparison
export const MOCK_WALLETS = {
  excellent: {
    address: "Excellent123456789",
    name: "Marcus (OG DeFi User)",
    score: 812,
    tier: "EXCELLENT" as const,
  },
  poor: {
    address: "Poor987654321",
    name: "New User",
    score: 423,
    tier: "POOR" as const,
  },
};

// Solana Average Score (for comparison)
export const SOLANA_AVERAGE_SCORE = 611;
