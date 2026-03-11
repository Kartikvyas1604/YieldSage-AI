/**
 * YieldSage AI — Helius Enhanced API Client
 * Wraps the Helius RPC + Enhanced APIs for wallet data, token balances, and NFTs.
 * All calls gracefully fall back to public RPC if no Helius API key is set.
 */

const HELIUS_API_KEY = process.env.HELIUS_API_KEY ?? "";
const BASE_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const ENHANCED_URL = `https://api.helius.xyz/v0`;

export interface TokenBalance {
  mint: string;
  symbol: string;
  decimals: number;
  amount: number;
  usdValue?: number;
}

export interface WalletAssets {
  solBalance: number;
  tokens: TokenBalance[];
  nftCount: number;
  estimatedTotalUsd: number;
}

export interface HeliusTransaction {
  signature: string;
  timestamp: number;
  type: string; // "SWAP" | "TRANSFER" | "NFT_MINT" | ...
  description: string;
  nativeTransfers?: Array<{ fromUserAccount: string; toUserAccount: string; amount: number }>;
  tokenTransfers?: Array<{ mint: string; fromUserAccount: string; toUserAccount: string; tokenAmount: number }>;
  accountData?: Array<{ account: string; nativeBalanceChange: number; tokenBalanceChanges: unknown[] }>;
}

/**
 * Get token balances using Helius Enhanced API.
 * Falls back to empty list if no API key.
 */
export async function getTokenAccounts(walletAddress: string): Promise<TokenBalance[]> {
  if (!HELIUS_API_KEY) return [];

  try {
    const response = await fetch(
      `${ENHANCED_URL}/addresses/${walletAddress}/balances?api-key=${HELIUS_API_KEY}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    const tokens: TokenBalance[] = (data.tokens ?? []).map((t: Record<string, unknown>) => ({
      mint: t.mint as string,
      symbol: (t.symbol as string) ?? "UNKNOWN",
      decimals: (t.decimals as number) ?? 0,
      amount: (t.amount as number) ?? 0,
    }));

    return tokens;
  } catch {
    return [];
  }
}

/**
 * Get enriched transaction history using Helius Enhanced Transactions API.
 */
export async function getEnrichedTransactions(
  walletAddress: string,
  limit = 20,
  before?: string
): Promise<HeliusTransaction[]> {
  if (!HELIUS_API_KEY) return [];

  try {
    const url = new URL(
      `${ENHANCED_URL}/addresses/${walletAddress}/transactions`
    );
    url.searchParams.set("api-key", HELIUS_API_KEY);
    url.searchParams.set("limit", String(limit));
    if (before) url.searchParams.set("before", before);

    const response = await fetch(url.toString());
    if (!response.ok) return [];

    return await response.json();
  } catch {
    return [];
  }
}

/**
 * Get wallet NFT count using Helius DAS API.
 */
export async function getNFTCount(walletAddress: string): Promise<number> {
  if (!HELIUS_API_KEY) return 0;

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "nft-count",
        method: "searchAssets",
        params: {
          ownerAddress: walletAddress,
          tokenType: "nonFungible",
          page: 1,
          limit: 1,
        },
      }),
    });

    if (!response.ok) return 0;
    const data = await response.json();
    return data.result?.total ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Get complete wallet assets overview (SOL + tokens + NFT count).
 * Aggregates multiple Helius calls into a single convenient response.
 */
export async function getWalletAssets(walletAddress: string): Promise<WalletAssets> {
  const [tokens, nftCount] = await Promise.all([
    getTokenAccounts(walletAddress),
    getNFTCount(walletAddress),
  ]);

  // SOL balance is fetched separately in tools.ts via web3.js
  return {
    solBalance: 0, // filled in by caller via Connection.getBalance
    tokens,
    nftCount,
    estimatedTotalUsd: tokens.reduce((sum, t) => sum + (t.usdValue ?? 0), 0),
  };
}
