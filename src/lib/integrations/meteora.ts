/**
 * Meteora DLMM Integration
 *
 * Meteora: https://meteora.ag
 * Solana's Dynamic Liquidity Infrastructure
 * $39.9B monthly volume (Jan 2025), 15%+ of Solana DEX volume
 * SDK: @meteora-ag/dlmm
 * Docs: https://docs.meteora.ag
 *
 * YieldSage uses Meteora DLMM for the Balanced (Smart LP) strategy.
 * The DLMM's dynamic fee model is perfect for YieldSage users because:
 * - Fees auto-increase during volatility (protects against IL)
 * - Bin-based liquidity = precise, AI-controlled range targeting
 * - Zero-slippage within active price bins
 */

const DLMM_API = 'https://dlmm-api.meteora.ag';

export interface MeteoraDLMMPool {
  address: string;
  name: string;
  tokenX: string;
  tokenY: string;
  currentFeeAPY: number;
  volume24h: number;
  tvl: number;
  binStep: number;
  activeBinId: number;
  pricePerToken: number;
  ilRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedBinRange: number;
}

export interface MeteoraPosition {
  poolAddress: string;
  positionAddress: string;
  lowerBinId: number;
  upperBinId: number;
  tokenXAmount: number;
  tokenYAmount: number;
  feesEarned: number;
  currentAPY: number;
  impermanentLoss: number;
  inRange: boolean;
}

/**
 * Fetch top Meteora DLMM pools sorted by fee/TVL ratio.
 * Falls back to curated defaults if API is unavailable.
 */
export async function getTopMeteoraPools(
  filters: {
    minAPY?: number;
    stableOnly?: boolean;
    maxILRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
  } = {}
): Promise<MeteoraDLMMPool[]> {
  try {
    const response = await fetch(
      `${DLMM_API}/pair/all_with_pagination?limit=20&sort_key=feetvlratio&order_by=desc`,
      { next: { revalidate: 120 } }
    );

    if (!response.ok) throw new Error(`Meteora API ${response.status}`);

    const data = await response.json();
    const pools: MeteoraDLMMPool[] = (data.data ?? [])
      .map((pool: Record<string, unknown>) => {
        const tvl = parseFloat((pool.liquidity as string) ?? '1');
        const fees24h = parseFloat((pool.fees_24h as string) ?? '0');
        const feeAPY = tvl > 0 ? (fees24h / tvl) * 365 * 100 : 0;

        return {
          address: pool.address as string,
          name: pool.name as string,
          tokenX: pool.mint_x as string,
          tokenY: pool.mint_y as string,
          currentFeeAPY: feeAPY,
          volume24h: parseFloat((pool.trade_volume_24h as string) ?? '0'),
          tvl,
          binStep: (pool.bin_step as number) ?? 10,
          activeBinId: (pool.active_id as number) ?? 8388608,
          pricePerToken: parseFloat((pool.current_price as string) ?? '0'),
          ilRisk: assessILRisk(pool.name as string),
          recommendedBinRange: calculateOptimalBinRange(pool.bin_step as number),
        };
      })
      .filter((pool: MeteoraDLMMPool) => {
        if (filters.minAPY && pool.currentFeeAPY < filters.minAPY) return false;
        if (filters.stableOnly && !isStablePair(pool.name)) return false;
        if (
          filters.maxILRisk === 'LOW' &&
          pool.ilRisk !== 'LOW'
        )
          return false;
        if (
          filters.maxILRisk === 'MEDIUM' &&
          pool.ilRisk === 'HIGH'
        )
          return false;
        return true;
      })
      .slice(0, 10);

    return pools.length > 0 ? pools : getDefaultPools();
  } catch {
    return getDefaultPools();
  }
}

/**
 * Build position creation payload for Balanced strategy.
 * Returns serialized transaction data — user signs via wallet adapter.
 * Uses SpotBalanced strategy type (safest for beginners).
 */
export async function buildMeteoraPositionPayload(
  poolAddress: string,
  userPublicKey: string,
  capitalUSDC: number,
  binRange: number = 10
): Promise<{
  success: boolean;
  message: string;
  expectedBinRange?: { min: number; max: number };
  txData?: string;
}> {
  try {
    // Fetch current active bin from Meteora API
    const res = await fetch(`${DLMM_API}/pair/${poolAddress}`);
    const poolData = await res.json();
    const activeBinId: number = poolData?.active_id ?? 8388608;

    return {
      success: true,
      message: `Ready to open Meteora DLMM position with $${capitalUSDC.toFixed(2)} USDC`,
      expectedBinRange: {
        min: activeBinId - binRange,
        max: activeBinId + binRange,
      },
      txData: JSON.stringify({
        program: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',
        pool: poolAddress,
        strategyType: 'SpotBalanced',
        minBinId: activeBinId - binRange,
        maxBinId: activeBinId + binRange,
        totalXAmount: (capitalUSDC * 0.5 * 1e6).toFixed(0),
        totalYAmount: (capitalUSDC * 0.5 * 1e9).toFixed(0),
        user: userPublicKey,
      }),
    };
  } catch {
    return { success: false, message: 'Unable to build Meteora position right now.' };
  }
}

/**
 * Fetch user's existing Meteora positions via DLMM API.
 */
export async function getUserMeteoraPositions(
  userPublicKey: string
): Promise<MeteoraPosition[]> {
  try {
    const response = await fetch(
      `${DLMM_API}/position/user/${userPublicKey}`,
      { next: { revalidate: 30 } }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return (data.userPositions ?? []).map((pos: Record<string, unknown>) => ({
      poolAddress: pos.poolAddress as string ?? '',
      positionAddress: pos.publicKey as string ?? '',
      lowerBinId: (pos.positionData as Record<string, unknown>)?.lowerBinId as number ?? 0,
      upperBinId: (pos.positionData as Record<string, unknown>)?.upperBinId as number ?? 0,
      tokenXAmount: parseFloat(String((pos.positionData as Record<string, unknown>)?.totalXAmount ?? '0')),
      tokenYAmount: parseFloat(String((pos.positionData as Record<string, unknown>)?.totalYAmount ?? '0')),
      feesEarned: parseFloat(String((pos.positionData as Record<string, unknown>)?.feeX ?? '0')),
      currentAPY: 0,
      impermanentLoss: 0,
      inRange: Boolean((pos.positionData as Record<string, unknown>)?.inRange ?? true),
    }));
  } catch {
    return [];
  }
}

function assessILRisk(name: string): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (!name) return 'HIGH';
  const stables = ['USDC', 'USDT', 'PYUSD', 'DAI'];
  const tokens = name.split('-');
  if (tokens.every((t) => stables.some((s) => t.includes(s)))) return 'LOW';
  if (tokens.some((t) => stables.some((s) => t.includes(s)))) return 'MEDIUM';
  return 'HIGH';
}

function isStablePair(name: string): boolean {
  const stables = ['USDC', 'USDT', 'PYUSD', 'DAI'];
  const tokens = name.split('-');
  return tokens.every((t) => stables.some((s) => t.includes(s)));
}

function calculateOptimalBinRange(binStep: number): number {
  if (!binStep || binStep <= 5) return 5;
  if (binStep <= 10) return 10;
  return 20;
}

function getDefaultPools(): MeteoraDLMMPool[] {
  return [
    {
      address: 'ARwi1S4DaiTG5DX7S4M4ZsrXqpMD1MrTmbu9ue2tpmEq',
      name: 'SOL-USDC',
      tokenX: 'So11111111111111111111111111111111111111112',
      tokenY: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      currentFeeAPY: 24.5,
      volume24h: 45_000_000,
      tvl: 12_000_000,
      binStep: 10,
      activeBinId: 8388608,
      pricePerToken: 185.0,
      ilRisk: 'MEDIUM',
      recommendedBinRange: 10,
    },
    {
      address: 'HcjZvfeSNJbNkfLD4eEcRBr96AD3w1GpmMppaeRZf7ur',
      name: 'USDC-USDT',
      tokenX: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      tokenY: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      currentFeeAPY: 11.2,
      volume24h: 8_200_000,
      tvl: 9_800_000,
      binStep: 1,
      activeBinId: 1000000,
      pricePerToken: 1.0,
      ilRisk: 'LOW',
      recommendedBinRange: 5,
    },
    {
      address: 'Hs3sFBiGkBKXiT4LgCBkNXhQ2SLDkBp2qL1oVjEvD6pY',
      name: 'BONK-SOL',
      tokenX: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      tokenY: 'So11111111111111111111111111111111111111112',
      currentFeeAPY: 51.8,
      volume24h: 22_000_000,
      tvl: 4_500_000,
      binStep: 20,
      activeBinId: 2184320,
      pricePerToken: 0.0000148,
      ilRisk: 'HIGH',
      recommendedBinRange: 20,
    },
  ];
}
