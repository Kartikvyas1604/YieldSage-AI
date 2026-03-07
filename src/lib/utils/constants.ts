// CredChain AI Constants

// Scoring Configuration
export const SCORE_RANGES = {
  EXCELLENT: { min: 750, max: 850 },
  GOOD: { min: 650, max: 749 },
  FAIR: { min: 500, max: 649 },
  POOR: { min: 350, max: 499 },
  VERY_POOR: { min: 0, max: 349 },
} as const;

export const CATEGORY_MAX_SCORES = {
  loanRepayment: 255,
  walletMaturity: 170,
  tradingBehavior: 170,
  lpCommitment: 127.5,
  community: 127.5,
} as const;

// Token Gating
export const TOKEN_TIERS = {
  FREE: {
    minTokens: 0,
    name: 'Free',
    features: ['view_demo', 'basic_score_preview'],
    color: 'var(--text-secondary)',
  },
  STARTER: {
    minTokens: 1000,
    name: 'Starter',
    features: ['full_score', 'basic_breakdown'],
    color: 'var(--accent-blue)',
  },
  PRO: {
    minTokens: 10000,
    name: 'Pro',
    features: ['full_score', 'full_breakdown', 'ai_reasoning', 'nft_mint'],
    color: 'var(--accent-gold)',
  },
  ELITE: {
    minTokens: 50000,
    name: 'Elite',
    features: ['everything', 'api_access', 'score_history', 'improvement_plan'],
    color: 'var(--accent-gold-bright)',
  },
} as const;

// $CRED Token Costs
export const TOKEN_COSTS = {
  GENERATE_SCORE: 50,
  REFRESH_SCORE: 10,
  MINT_NFT: 100,
  DISPUTE_SCORE: 200,
  STAKE_REQUIREMENT: 1000,
} as const;

// Protocol Benefits
export const SCORE_BENEFITS = {
  EXCELLENT: [
    { protocol: 'Marginfi', benefit: 'Borrow $1000 with $700 collateral (70% LTV)', type: 'collateral' },
    { protocol: 'Marginfi', benefit: '1.0% interest rate reduction', type: 'rate' },
    { protocol: 'Solend', benefit: '0.75% interest rate reduction', type: 'rate' },
    { protocol: 'Jupiter', benefit: '50% fee reduction on swaps', type: 'fee' },
    { protocol: 'Kamino', benefit: 'Priority access to new vaults', type: 'access' },
  ],
  GOOD: [
    { protocol: 'Marginfi', benefit: 'Borrow $1000 with $800 collateral (80% LTV)', type: 'collateral' },
    { protocol: 'Marginfi', benefit: '0.5% interest rate reduction', type: 'rate' },
    { protocol: 'Solend', benefit: '0.35% interest rate reduction', type: 'rate' },
    { protocol: 'Jupiter', benefit: '25% fee reduction on swaps', type: 'fee' },
  ],
  FAIR: [
    { protocol: 'Marginfi', benefit: 'Standard collateral requirements (100% LTV)', type: 'collateral' },
    { protocol: 'Solend', benefit: 'Standard interest rates', type: 'rate' },
  ],
  POOR: [
    { protocol: 'All', benefit: 'Limited protocol access', type: 'access' },
  ],
} as const;

// Protocol List
export const PROTOCOLS = {
  LENDING: ['Marginfi', 'Solend', 'Kamino'],
  DEXES: ['Jupiter', 'Raydium', 'Orca'],
  LIQUIDITY: ['Meteora', 'Orca', 'Raydium'],
  GOVERNANCE: ['Realms', 'Tribeca'],
  NFT: ['Magic Eden', 'Tensor'],
} as const;

// API Endpoints
export const API_ROUTES = {
  ANALYZE: '/api/analyze',
  SCORE: '/api/score',
  WALLET_HISTORY: '/api/wallet/history',
  WALLET_LOANS: '/api/wallet/loans',
  WALLET_TRADES: '/api/wallet/trades',
  NFT_MINT: '/api/nft/mint',
  NFT_CHECK: '/api/nft/check',
} as const;

// Solana Configuration
export const SOLANA_CONFIG = {
  NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
  HELIUS_RPC: process.env.HELIUS_RPC_URL,
  CRED_TOKEN_MINT: process.env.NEXT_PUBLIC_CRED_TOKEN_MINT || '',
} as const;

// Known Scam Addresses (sample - would be populated from database)
export const KNOWN_SCAM_ADDRESSES = new Set([
  // Add known scam addresses here
]);

// Analysis Timeouts
export const TIMEOUTS = {
  QUICK_ANALYSIS: 30000, // 30 seconds
  FULL_ANALYSIS: 120000, // 2 minutes
  SCORE_CACHE: 3600000, // 1 hour
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  SCORE_ANIMATION_DURATION: 2500,
  TOAST_DURATION: 5000,
  MAX_RECENT_ANALYSES: 10,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  INSUFFICIENT_TOKENS: 'Insufficient $CRED tokens for this action',
  ANALYSIS_FAILED: 'Failed to analyze wallet. Please try again.',
  NFT_MINT_FAILED: 'Failed to mint credential NFT',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_WALLET: 'Invalid wallet address',
  RATE_LIMITED: 'Too many requests. Please wait a moment.',
} as const;

// Demo Wallet Address
export const DEMO_WALLET_ADDRESS = 'Demo7xCredChainAI1234567890abcdef';

// Scoring Signals
export const SCORING_SIGNALS = {
  loanRepaymentRate: {
    weight: 0.12,
    description: "% of loans repaid without liquidation",
    thresholds: { excellent: 0.95, good: 0.85, fair: 0.70 }
  },
  liquidationCount: {
    weight: 0.10,
    description: "Number of liquidation events",
    thresholds: { excellent: 0, good: 1, fair: 3 }
  },
  repaymentSpeed: {
    weight: 0.08,
    description: "Average time to repay loans",
    thresholds: { excellent: -5, good: 0, fair: 10 } // days relative to due date
  },
  walletAge: {
    weight: 0.06,
    description: "Age of wallet in days",
    thresholds: { excellent: 365, good: 180, fair: 90 }
  },
  activityConsistency: {
    weight: 0.07,
    description: "Active months / total months",
    thresholds: { excellent: 0.80, good: 0.60, fair: 0.40 }
  },
  protocolDiversity: {
    weight: 0.07,
    description: "Number of unique reputable protocols used",
    thresholds: { excellent: 8, good: 5, fair: 3 }
  },
  washTradingDetected: {
    weight: 0.08,
    description: "Presence of wash trading patterns",
    penalty: true
  },
  rugPullCreation: {
    weight: 0.07,
    description: "Created tokens that were rugged",
    penalty: true
  },
  tradingDiscipline: {
    weight: 0.05,
    description: "P&L consistency and risk management",
    thresholds: { excellent: 0.70, good: 0.50, fair: 0.30 } // win rate
  },
  lpDuration: {
    weight: 0.08,
    description: "Average LP position duration",
    thresholds: { excellent: 30, good: 14, fair: 7 } // days
  },
  lpConsistency: {
    weight: 0.07,
    description: "Consistency of LP provision over time",
    thresholds: { excellent: 3, good: 2, fair: 1 } // number of positions
  },
  governanceParticipation: {
    weight: 0.05,
    description: "DAO governance voting history",
    thresholds: { excellent: 0.70, good: 0.30, fair: 0.10 } // participation rate
  },
  nftHoldingDuration: {
    weight: 0.05,
    description: "Average NFT holding period",
    thresholds: { excellent: 90, good: 30, fair: 7 } // days
  },
  stablecoinReserves: {
    weight: 0.05,
    description: "Maintains stable reserve buffer",
    thresholds: { excellent: 0.20, good: 0.10, fair: 0.05 } // % of portfolio
  },
} as const;
