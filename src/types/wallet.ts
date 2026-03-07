// CredChain AI Wallet Data Types

export interface LoanPosition {
  protocol: string;
  amount: number;
  currency: string;
  repaid: boolean;
  daysToRepay?: number;
  liquidated: boolean;
  liquidationDate?: Date;
  loanDate: Date;
  repaymentDate?: Date;
  interestRate?: number;
}

export interface LPPosition {
  protocol: string;
  pair: string;
  durationDays: number;
  feesEarned: number;
  startDate: Date;
  endDate?: Date;
  tvl?: number;
  apr?: number;
}

export interface TradingStats {
  totalTrades: number;
  washTradingDetected: boolean;
  rugPullParticipation: boolean;
  tokensCreated: number;
  averagePnl: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  profitableTrades: number;
  losingTrades: number;
}

export interface GovernanceVote {
  protocol: string;
  proposalId: string;
  voteDate: Date;
  voteChoice: string;
  votingPower: number;
}

export interface NFTHolding {
  collection: string;
  mintAddress: string;
  acquiredDate: Date;
  soldDate?: Date;
  holdingDays: number;
  purchasePrice?: number;
  salePrice?: number;
}

export interface Transaction {
  signature: string;
  type: 'swap' | 'transfer' | 'loan' | 'lp' | 'governance' | 'nft' | 'other';
  timestamp: Date;
  from: string;
  to: string;
  amount?: number;
  token?: string;
  protocol?: string;
  success: boolean;
}

export interface WalletActivity {
  monthYear: string;
  transactionCount: number;
  uniqueProtocols: number;
  volume: number;
}

export interface WalletHistory {
  address: string;
  displayName?: string;
  walletAge: number; // days since first transaction
  totalTransactions: number;
  loans: LoanPosition[];
  lpPositions: LPPosition[];
  tradingStats: TradingStats;
  governanceVotes: GovernanceVote[];
  nftHoldings: NFTHolding[];
  transactions: Transaction[];
  monthlyActivity: WalletActivity[];
  protocolsUsed: string[];
  totalVolume: number;
  stablecoinReserveRatio: number;
  firstTransactionDate: Date;
  lastTransactionDate: Date;
}

export interface WalletContext {
  history: WalletHistory;
  currentBalance: number;
  currentTokens: {
    mint: string;
    symbol: string;
    amount: number;
    usdValue: number;
  }[];
  activeLoanPositions: number;
  activeLPPositions: number;
  reputationScore?: number;
}

export interface ProtocolUsage {
  name: string;
  category: 'lending' | 'dex' | 'lp' | 'governance' | 'nft' | 'other';
  transactionCount: number;
  firstUsed: Date;
  lastUsed: Date;
  totalVolume: number;
}
