/**
 * Demo helper — provides static Polymarket risk data for the dashboard
 * without hitting the API during client-side render.
 */
import type { PolymarketRiskSummary } from './polymarket';

export function getDemoRiskData(): PolymarketRiskSummary {
  return {
    overallRisk: 'MEDIUM',
    recommendation:
      'Mild crash risk signal on Polymarket. Monitoring closely, no major action needed yet.',
    signals: [
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
        aiInterpretation: '62% chance of surge. Markets bullish — LP exposure looks good.',
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
        aiInterpretation: '4% systemic risk probability — very low. Stablecoin holdings are safe.',
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
        aiInterpretation: '71% rate cut probability — bullish signal for crypto yield strategies.',
        strategyAdjustment: 'INCREASE_RISK',
      },
    ],
  };
}
