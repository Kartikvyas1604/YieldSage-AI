// YieldSage AI — Strategy Definitions

import type { Strategy } from '@/types/strategy';

export const STRATEGIES: Record<string, Strategy> = {
  CONSERVATIVE: {
    id: 'conservative',
    name: 'Stable Yield',
    emoji: '🏦',
    description: 'Your money earns interest safely, like a high-yield savings account',
    plainEnglish: 'Lend your USDC to earn steady interest. Very safe.',
    requiredScoreTier: 'ANY',
    requiredSageTokens: 0,
    targetAPY: { min: 6, max: 12 },
    riskLevel: 1,
    protocols: ['Kamino Finance'],
    impermanentLossRisk: 'NONE',
    rebalanceFrequency: 'weekly',
    autoExitTriggers: {
      yieldDropBelow: 4,
      protocolRiskAlert: true,
    },
  },

  BALANCED: {
    id: 'balanced',
    name: 'Smart LP',
    emoji: '⚖️',
    description: 'Earn fees from trades happening on Solana DEXs',
    plainEnglish: 'Provide liquidity and earn fees every time someone trades. Medium risk.',
    requiredScoreTier: 'FAIR',
    requiredSageTokens: 1000,
    targetAPY: { min: 20, max: 45 },
    riskLevel: 3,
    protocols: ['Meteora DLMM'],
    impermanentLossRisk: 'MEDIUM',
    rebalanceFrequency: 'daily',
    autoExitTriggers: {
      impermanentLossAbove: 5,
      yieldDropBelow: 15,
      volumeDropBelow: 70,
    },
  },

  GROWTH: {
    id: 'growth',
    name: 'Turbo Yield',
    emoji: '🚀',
    description: 'Maximize returns using proven advanced strategies',
    plainEnglish: 'Use smart leverage to multiply your yield. Higher risk, higher reward.',
    requiredScoreTier: 'GOOD',
    requiredSageTokens: 10000,
    targetAPY: { min: 45, max: 120 },
    riskLevel: 5,
    protocols: ['Kamino Leverage', 'Meteora DLMM'],
    impermanentLossRisk: 'HIGH',
    rebalanceFrequency: '4hours',
    autoExitTriggers: {
      impermanentLossAbove: 8,
      drawdownAbove: 12,
      healthFactorBelow: 1.5,
    },
  },
};

export const STRATEGY_LIST = Object.values(STRATEGIES);

export function getStrategyById(id: string): Strategy | undefined {
  return STRATEGY_LIST.find(s => s.id === id);
}

export function estimateEarnings(capitalUsd: number, apy: number) {
  const daily   = (capitalUsd * apy) / 100 / 365;
  const weekly  = daily * 7;
  const monthly = daily * 30;
  const yearly  = capitalUsd * apy / 100;
  return {
    daily:   parseFloat(daily.toFixed(2)),
    weekly:  parseFloat(weekly.toFixed(2)),
    monthly: parseFloat(monthly.toFixed(2)),
    yearly:  parseFloat(yearly.toFixed(2)),
  };
}
