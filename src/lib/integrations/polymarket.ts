/**
 * Polymarket Integration
 * Uses Polymarket prediction market odds as AI risk signals
 *
 * Polymarket: https://polymarket.com — World's largest prediction market
 * Now natively on Solana via Jupiter (Feb 2026)
 * API Docs: https://docs.polymarket.com
 *
 * Why we use Polymarket:
 * Polymarket is >94% accurate 1 month before resolution.
 * Crowd-sourced financial conviction = better risk signals than
 * any single analyst or algorithm.
 */

const POLYMARKET_GAMMA_API = 'https://gamma-api.polymarket.com';

export interface PolymarketSignal {
  marketId: string;
  question: string;
  yesPrice: number;       // 0–1, represents probability
  noPrice: number;
  volume24h: number;
  totalVolume: number;
  riskRelevance: 'CRASH' | 'SURGE' | 'STABLE' | 'SYSTEMIC';
  aiInterpretation: string;
  strategyAdjustment: 'REDUCE_RISK' | 'INCREASE_RISK' | 'MAINTAIN' | 'EXIT';
}

export interface PolymarketRiskSummary {
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  signals: PolymarketSignal[];
  recommendation: string;
}

// Solana/crypto-relevant market slugs to monitor
const MONITORED_SLUGS = [
  'will-solana-drop-30-in-30-days',
  'will-sol-hit-300-in-60-days',
  'will-usdc-depeg-in-30-days',
  'crypto-market-crash-50-percent-2025',
  'will-there-be-major-solana-defi-hack-90-days',
  'fed-rate-cut-next-meeting',
];

export async function fetchPolymarketSignals(): Promise<PolymarketSignal[]> {
  try {
    const url = `${POLYMARKET_GAMMA_API}/markets?active=true&closed=false&limit=20&tag=crypto`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }, // cache for 5 mins in Next.js
    });

    if (!response.ok) throw new Error(`Polymarket API ${response.status}`);

    const markets = await response.json();
    const results: PolymarketSignal[] = [];

    for (const market of Array.isArray(markets) ? markets : markets.results ?? []) {
      const signal = interpretMarketForDeFi(market);
      if (signal) results.push(signal);
    }

    return results.length > 0 ? results : getDemoSignals();
  } catch {
    // Return demo signals on API failure — never crash the UI
    return getDemoSignals();
  }
}

export async function getPolymarketRiskScore(): Promise<PolymarketRiskSummary> {
  const signals = await fetchPolymarketSignals();

  const crashSignals = signals.filter(
    (s) => s.riskRelevance === 'CRASH' && s.yesPrice > 0.3
  );
  const systemicSignals = signals.filter(
    (s) => s.riskRelevance === 'SYSTEMIC' && s.yesPrice > 0.1
  );

  let overallRisk: PolymarketRiskSummary['overallRisk'] = 'LOW';
  let recommendation = 'Prediction market signals look healthy. Maintaining current strategy.';

  if (systemicSignals.length > 0) {
    overallRisk = 'EXTREME';
    recommendation =
      'Polymarket shows elevated systemic risk. Moving to maximum safety allocation.';
  } else if (crashSignals.length >= 2) {
    overallRisk = 'HIGH';
    recommendation =
      'Multiple crash signals on Polymarket. Reducing LP exposure, rotating to stable yield.';
  } else if (crashSignals.length === 1) {
    overallRisk = 'MEDIUM';
    recommendation = 'Mild crash signal detected on Polymarket. Monitoring closely, no action yet.';
  }

  return { overallRisk, signals, recommendation };
}

function interpretMarketForDeFi(market: Record<string, unknown>): PolymarketSignal | null {
  const slug = (market.slug as string) ?? '';
  const question = (market.question as string) ?? slug;
  const outcomePrices = market.outcomePrices as string[] | undefined;
  const yesPrice = parseFloat(outcomePrices?.[0] ?? '0.5');
  const volume24h = parseFloat((market.volume24hr as string) ?? '0');
  const totalVolume = parseFloat((market.volume as string) ?? '0');

  // Only surface markets with meaningful volume (> $10k)
  if (totalVolume < 10000) return null;

  let riskRelevance: PolymarketSignal['riskRelevance'] = 'STABLE';
  let strategyAdjustment: PolymarketSignal['strategyAdjustment'] = 'MAINTAIN';
  let aiInterpretation = '';

  if (slug.includes('crash') || slug.includes('drop') || slug.includes('fall')) {
    riskRelevance = 'CRASH';
    if (yesPrice > 0.4) {
      strategyAdjustment = 'REDUCE_RISK';
      aiInterpretation = `${Math.round(yesPrice * 100)}% crash probability. Reducing LP exposure, holding more stables.`;
    } else if (yesPrice > 0.2) {
      strategyAdjustment = 'MAINTAIN';
      aiInterpretation = `${Math.round(yesPrice * 100)}% crash probability — elevated but manageable. Monitoring.`;
    }
  } else if (slug.includes('hit') || slug.includes('surge') || slug.includes('bull')) {
    riskRelevance = 'SURGE';
    if (yesPrice > 0.55) {
      strategyAdjustment = 'INCREASE_RISK';
      aiInterpretation = `${Math.round(yesPrice * 100)}% chance of surge. Markets bullish — increasing LP exposure.`;
    }
  } else if (slug.includes('hack') || slug.includes('depeg') || slug.includes('exploit')) {
    riskRelevance = 'SYSTEMIC';
    if (yesPrice > 0.1) {
      strategyAdjustment = 'EXIT';
      aiInterpretation = `${Math.round(yesPrice * 100)}% systemic risk probability. Safety-first: moving to stables.`;
    }
  }

  if (!aiInterpretation) return null;

  return {
    marketId: (market.conditionId as string) ?? market.id as string ?? slug,
    question,
    yesPrice,
    noPrice: 1 - yesPrice,
    volume24h,
    totalVolume,
    riskRelevance,
    aiInterpretation,
    strategyAdjustment,
  };
}

function getDemoSignals(): PolymarketSignal[] {
  return [
    {
      marketId: 'sol-drop-30-q1-2026',
      question: 'Will SOL drop 30%+ in the next 30 days?',
      yesPrice: 0.21,
      noPrice: 0.79,
      volume24h: 284000,
      totalVolume: 4200000,
      riskRelevance: 'CRASH',
      aiInterpretation: '21% crash probability — elevated but manageable. Monitoring.',
      strategyAdjustment: 'MAINTAIN',
    },
    {
      marketId: 'sol-hit-300-q2-2026',
      question: 'Will SOL reach $300 by May 2026?',
      yesPrice: 0.62,
      noPrice: 0.38,
      volume24h: 512000,
      totalVolume: 7800000,
      riskRelevance: 'SURGE',
      aiInterpretation: '62% chance of surge. Markets bullish — increasing LP exposure.',
      strategyAdjustment: 'INCREASE_RISK',
    },
    {
      marketId: 'usdc-depeg-30d',
      question: 'Will USDC depeg by more than 1% in 30 days?',
      yesPrice: 0.04,
      noPrice: 0.96,
      volume24h: 65000,
      totalVolume: 980000,
      riskRelevance: 'SYSTEMIC',
      aiInterpretation: '4% systemic risk — very low. No impact on strategy.',
      strategyAdjustment: 'MAINTAIN',
    },
    {
      marketId: 'fed-rate-cut-march',
      question: 'Will the Fed cut rates in March 2026?',
      yesPrice: 0.71,
      noPrice: 0.29,
      volume24h: 890000,
      totalVolume: 12400000,
      riskRelevance: 'SURGE',
      aiInterpretation: '71% rate cut probability — bullish for risk assets including crypto.',
      strategyAdjustment: 'INCREASE_RISK',
    },
  ];
}
