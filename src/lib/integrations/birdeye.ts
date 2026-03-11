/**
 * Birdeye Analytics Integration
 *
 * Birdeye: https://birdeye.so
 * Solana's leading token analytics — 500K+ tokens tracked
 * API Docs: https://docs.birdeye.so
 *
 * YieldSage uses Birdeye for:
 * 1. Real-time token prices for all held assets
 * 2. Portfolio USD valuation
 * 3. Price history for impermanent loss calculation
 * 4. Market trend data to inform AI strategy decisions
 */

const BIRDEYE_API = 'https://public-api.birdeye.so';

function getBirdeyeHeaders(): HeadersInit {
  const key = process.env.BIRDEYE_API_KEY;
  return key
    ? { 'X-API-KEY': key, 'x-chain': 'solana' }
    : { 'x-chain': 'solana' };
}

export interface TokenPrice {
  mint: string;
  symbol: string;
  priceUsd: number;
  change24hPct: number;
  volume24hUsd: number;
  lastUpdated: number;
}

export interface PortfolioValuation {
  totalUsd: number;
  tokens: Array<{
    mint: string;
    symbol: string;
    amount: number;
    valueUsd: number;
    priceUsd: number;
    change24hPct: number;
  }>;
  lastUpdated: number;
}

export interface PriceHistoryPoint {
  timestamp: number;
  priceUsd: number;
}

/**
 * Get real-time price for a single token.
 */
export async function getTokenPrice(mintAddress: string): Promise<TokenPrice> {
  try {
    const response = await fetch(
      `${BIRDEYE_API}/defi/price?address=${mintAddress}`,
      { headers: getBirdeyeHeaders(), next: { revalidate: 10 } }
    );

    if (!response.ok) throw new Error(`Birdeye price API ${response.status}`);

    const data = await response.json();
    const d = data.data ?? {};

    return {
      mint: mintAddress,
      symbol: d.symbol ?? 'UNKNOWN',
      priceUsd: d.value ?? 0,
      change24hPct: d.priceChange24h ?? 0,
      volume24hUsd: d.v24hUSD ?? 0,
      lastUpdated: Date.now(),
    };
  } catch {
    return { mint: mintAddress, symbol: 'UNKNOWN', priceUsd: 0, change24hPct: 0, volume24hUsd: 0, lastUpdated: Date.now() };
  }
}

/**
 * Get portfolio valuation for a wallet — all tokens with USD values.
 */
export async function getPortfolioValue(
  walletAddress: string
): Promise<PortfolioValuation> {
  try {
    const response = await fetch(
      `${BIRDEYE_API}/v1/wallet/token_list?wallet=${walletAddress}`,
      { headers: getBirdeyeHeaders(), next: { revalidate: 30 } }
    );

    if (!response.ok) throw new Error(`Birdeye portfolio API ${response.status}`);

    const data = await response.json();
    const items = data.data?.items ?? [];

    const tokens = items
      .filter((item: Record<string, unknown>) => (item.valueUsd as number) > 0.01)
      .map((item: Record<string, unknown>) => ({
        mint: item.address as string,
        symbol: item.symbol as string,
        amount: item.uiAmount as number,
        valueUsd: item.valueUsd as number,
        priceUsd: item.priceUsd as number,
        change24hPct: (item.priceChange24h as number) ?? 0,
      }));

    return {
      totalUsd: tokens.reduce((sum: number, t: { valueUsd: number }) => sum + t.valueUsd, 0),
      tokens,
      lastUpdated: Date.now(),
    };
  } catch {
    return { totalUsd: 0, tokens: [], lastUpdated: Date.now() };
  }
}

/**
 * Get price history for IL calculation and charting.
 */
export async function getPriceHistory(
  mintAddress: string,
  days: number = 30
): Promise<PriceHistoryPoint[]> {
  try {
    const from = Math.floor(Date.now() / 1000) - days * 86400;
    const to = Math.floor(Date.now() / 1000);

    const response = await fetch(
      `${BIRDEYE_API}/defi/history_price?address=${mintAddress}&address_type=token&type=1D&time_from=${from}&time_to=${to}`,
      { headers: getBirdeyeHeaders(), next: { revalidate: 300 } }
    );

    if (!response.ok) throw new Error(`Birdeye history API ${response.status}`);

    const data = await response.json();
    return (data.data?.items ?? []).map((item: Record<string, unknown>) => ({
      timestamp: (item.unixTime as number) * 1000,
      priceUsd: item.value as number,
    }));
  } catch {
    return [];
  }
}

/**
 * Get multi-token prices in one call for portfolio display.
 */
export async function getMultiTokenPrices(
  mintAddresses: string[]
): Promise<Record<string, number>> {
  if (mintAddresses.length === 0) return {};

  try {
    const response = await fetch(
      `${BIRDEYE_API}/defi/multi_price?list_address=${mintAddresses.join(',')}`,
      { headers: getBirdeyeHeaders(), next: { revalidate: 15 } }
    );

    if (!response.ok) throw new Error(`Birdeye multi-price API ${response.status}`);

    const data = await response.json();
    const prices: Record<string, number> = {};

    for (const [mint, info] of Object.entries(data.data ?? {})) {
      prices[mint] = (info as Record<string, unknown>).value as number ?? 0;
    }

    return prices;
  } catch {
    return {};
  }
}
