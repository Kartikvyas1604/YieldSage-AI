import { Connection, PublicKey } from '@solana/web3.js';
import { DEMO_WALLET_HISTORY } from "@/lib/data/mock";

// Initialize a connection to mainnet-beta 
const connection = new Connection(
    process.env.HELIUS_RPC_URL || process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com",
    'confirmed'
);

export async function fetchTransactionHistory(
  walletAddress: string,
  demoMode: boolean = false
): Promise<any> {
  if (demoMode) return DEMO_WALLET_HISTORY;

  try {
    const pubkey = new PublicKey(walletAddress);
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 100 });
    
    return {
      address: walletAddress,
      total_transactions_found: signatures.length,
      recent_activity: signatures.map(sig => ({
         signature: sig.signature,
         blockTime: sig.blockTime,
         successful: !sig.err
      }))
    };
  } catch (err: any) {
    return { error: err.message || "Failed to fetch transactions" };
  }
}

export async function fetchLoanPositions(
  walletAddress: string,
  demoMode: boolean = false
): Promise<any> {
  if (demoMode) return DEMO_WALLET_HISTORY.loans;
  
  // Real DeFi fetch requires protocols SDK (Marginfi/Solend). 
  // For a generic real mode without protocol SDKs, return structure denoting currently un-liquidatable.
  return [];
}

export async function fetchTokenHoldings(
  walletAddress: string,
  demoMode: boolean = false
): Promise<any> {
  if (demoMode) return { sol: 10.5, tokens: [] };
  
  try {
     const pubkey = new PublicKey(walletAddress);
     const balance = await connection.getBalance(pubkey);
     
     // basic fetch for token accounts (just count or return spl program accounts)
     const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
     });
     
     const holdings = tokenAccounts.value.map(acc => {
        const info = acc.account.data.parsed.info;
        return {
           mint: info.mint,
           amount: info.tokenAmount.uiAmount
        }
     }).filter(h => h.amount > 0);

     return {
        sol_balance: balance / 1e9,
        spl_holdings_count: holdings.length,
        holdings: holdings.slice(0, 10) // top 10 to save prompt space
     };
  } catch(err: any) {
     return { error: err.message || "Failed to fetch holdings" };
  }
}

export async function fetchGovernanceParticipation(
  walletAddress: string,
  demoMode: boolean = false
): Promise<any> {
  if (demoMode) return { daos: ["Realms"], votes_cast: 5 };
  return { daos: [], votes_cast: 0 };
}

export async function analyzeWalletMaturity(
  walletAddress: string,
  demoMode: boolean = false
): Promise<any> {
  if (demoMode) return { first_transaction_date: "2021-08-15", days_active: 850 };
  
  try {
      const pubkey = new PublicKey(walletAddress);
      const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 1000 });
      if (signatures.length === 0) {
          return { first_transaction_date: "N/A", days_active: 0, is_new: true };
      }
      
      const oldest = signatures[signatures.length - 1]; // last one we fetched, not true oldest but indication
      const date = oldest.blockTime ? new Date(oldest.blockTime * 1000) : new Date();
      const daysActive = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
          established_date: date.toISOString(),
          minimum_days_active: daysActive,
          transaction_count_limit_reached: signatures.length === 1000
      };
  } catch (err: any) {
      return { error: "Failed to analyze maturity" };
  }
}

export async function analyzeTradingBehavior(
  walletAddress: string,
  demoMode: boolean = false
): Promise<any> {
  if (demoMode) return { volume_30d: 12500, favorite_dex: "Jupiter" };
  return { volume_30d: "Unknown without indexer", favorite_dex: "Unknown" };
}

/**
 * Execute a specific tool by name
 */
export async function executeTool(
  toolName: string,
  input: Record<string, any>,
  demoMode: boolean = false
): Promise<any> {
  const address = input.wallet_address || input.walletAddress;
  
  switch (toolName) {
    case "fetch_transaction_history":
      return fetchTransactionHistory(address, demoMode);
    case "fetch_loan_positions":
      return fetchLoanPositions(address, demoMode);
    case "fetch_token_holdings":
      return fetchTokenHoldings(address, demoMode);
    case "fetch_governance_participation":
      return fetchGovernanceParticipation(address, demoMode);
    case "analyze_wallet_maturity":
      return analyzeWalletMaturity(address, demoMode);
    case "analyze_trading_behavior":
      return analyzeTradingBehavior(address, demoMode);
    default:
      console.warn(`Unknown tool used by AI: ${toolName}`);
      return { error: "Tool not found" };
  }
}

// Just pass empty definitions if we no longer pass them cleanly
export const TOOL_DEFINITIONS: any[] = [];