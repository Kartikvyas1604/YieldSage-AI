/**
 * Jupiter Swap Integration
 *
 * Jupiter: https://jup.ag
 * Solana's #1 DEX aggregator — $700M+ daily volume
 * API: https://quote-api.jup.ag/v6
 *
 * YieldSage uses Jupiter for:
 * 1. All token rebalancing swaps between strategy positions
 * 2. Emergency exits — fastest route out of any position
 * 3. Best rate across all Solana DEXs (saves users money)
 *
 * Fun fact: Polymarket integrated with Jupiter (Feb 2026) to bring
 * prediction markets natively to Solana.
 */

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6';

// Well-known token mints
export const MINTS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
} as const;

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inAmount: number;
  outAmount: number;
  priceImpactPct: number;
  routePlan: Array<{ swapInfo: { label: string } }>;
  estimatedFeeLamports: number;
}

export interface RebalanceCostEstimate {
  gasFeeUsd: number;
  swapFeeUsd: number;
  totalCostUsd: number;
  priceImpactPct: number;
  bestRoute: string;
}

/**
 * Get the best swap quote from Jupiter.
 * Used before any rebalancing action.
 */
export async function getSwapQuote(
  fromMint: string,
  toMint: string,
  amountLamports: number,
  slippageBps: number = 50
): Promise<SwapQuote | null> {
  try {
    const params = new URLSearchParams({
      inputMint: fromMint,
      outputMint: toMint,
      amount: amountLamports.toString(),
      slippageBps: slippageBps.toString(),
      onlyDirectRoutes: 'false',
      asLegacyTransaction: 'false',
    });

    const response = await fetch(`${JUPITER_QUOTE_API}/quote?${params}`);
    if (!response.ok) throw new Error(`Jupiter quote API ${response.status}`);

    const quote = await response.json();
    if (quote.error) throw new Error(quote.error);

    return {
      inputMint: fromMint,
      outputMint: toMint,
      inAmount: parseInt(quote.inAmount),
      outAmount: parseInt(quote.outAmount),
      priceImpactPct: parseFloat(quote.priceImpactPct),
      routePlan: quote.routePlan ?? [],
      estimatedFeeLamports: 5000,
    };
  } catch {
    return null;
  }
}

/**
 * Build serialized swap transaction for user to sign.
 * YieldSage never signs transactions — only builds them.
 */
export async function buildSwapTransaction(
  quoteResponse: Record<string, unknown>,
  userPublicKey: string
): Promise<string | null> {
  try {
    const response = await fetch(`${JUPITER_QUOTE_API}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true,
        prioritizationFeeLamports: 'auto',
      }),
    });

    if (!response.ok) throw new Error(`Jupiter swap API ${response.status}`);

    const { swapTransaction } = await response.json();
    return swapTransaction as string;
  } catch {
    return null;
  }
}

/**
 * Estimate full rebalancing cost before execution.
 * Shown to user in confirmation dialog.
 */
export async function estimateRebalanceCost(
  fromMint: string,
  toMint: string,
  amountUsd: number
): Promise<RebalanceCostEstimate> {
  const amountLamports = Math.floor(amountUsd * 1_000_000); // USDC = 6 decimals
  const quote = await getSwapQuote(fromMint, toMint, amountLamports);

  const bestRoute =
    quote?.routePlan?.[0]?.swapInfo?.label ?? 'Jupiter Aggregated Route';

  return {
    gasFeeUsd: 0.001,
    swapFeeUsd: amountUsd * 0.003,
    totalCostUsd: amountUsd * 0.003 + 0.001,
    priceImpactPct: quote?.priceImpactPct ?? 0.05,
    bestRoute,
  };
}

/**
 * Get token price in USD from Jupiter price API.
 */
export async function getTokenPriceUsd(mintAddress: string): Promise<number> {
  try {
    const response = await fetch(
      `https://price.jup.ag/v6/price?ids=${mintAddress}&vsToken=USDC`
    );
    if (!response.ok) return 0;
    const data = await response.json();
    return data.data?.[mintAddress]?.price ?? 0;
  } catch {
    return 0;
  }
}
