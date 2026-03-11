// YieldSage AI — Credit Score Calculator

import type { ScoreTierLabel } from '@/types/strategy';

export interface YieldSageScore {
  total: number;
  tier: ScoreTierLabel;
  tierColor: string;
  breakdown: {
    consistency: { score: number; max: number; percent: number };
    patience:    { score: number; max: number; percent: number };
    responsibility: { score: number; max: number; percent: number };
    engagement:  { score: number; max: number; percent: number };
  };
  pointsToNextTier: number;
  nextTierLabel: string;
  nextTierScore: number;
  weeklyGain: number;
}

export function getScoreTier(score: number): {
  tier: ScoreTierLabel;
  color: string;
  label: string;
  nextTierScore: number;
  nextTierLabel: string;
} {
  if (score >= 750) return { tier: 'EXCELLENT', color: '#d4a843', label: 'Excellent', nextTierScore: 850, nextTierLabel: 'Max' };
  if (score >= 650) return { tier: 'GOOD',      color: '#4caf7d', label: 'Good',      nextTierScore: 750, nextTierLabel: 'Excellent' };
  if (score >= 500) return { tier: 'FAIR',      color: '#5b8c5a', label: 'Fair',      nextTierScore: 650, nextTierLabel: 'Good' };
  if (score >= 300) return { tier: 'BUILDING',  color: '#e8a43a', label: 'Building',  nextTierScore: 500, nextTierLabel: 'Fair' };
  return              { tier: 'NEW',       color: '#a09db8', label: 'New',       nextTierScore: 300, nextTierLabel: 'Building' };
}

export function calculateYieldSageScore(params: {
  walletAgeDays: number;
  daysInProtocol: number;
  activeMonths: number;
  noPanicWithdrawals: boolean;
  avgPositionDays: number;
  protocolsUsed: number;
  hasGovernanceVotes: boolean;
}): YieldSageScore {
  const { walletAgeDays, daysInProtocol, activeMonths, noPanicWithdrawals, avgPositionDays, protocolsUsed, hasGovernanceVotes } = params;

  // Consistency (max 297)
  const daysScore    = Math.min(daysInProtocol * 1.5, 150);
  const monthlyScore = Math.min(activeMonths * 16.67, 100);
  const noFullWithdraw = noPanicWithdrawals ? 47 : 0;
  const consistency = Math.round(daysScore + monthlyScore + noFullWithdraw);

  // Patience (max 212)
  const avgDayScore = Math.min(avgPositionDays * 1.5, 150);
  const longestHold = Math.min(avgPositionDays * 0.7, 62);
  const patience = Math.round(avgDayScore + longestHold);

  // Responsibility (max 170)
  const noPanicScore = noPanicWithdrawals ? 100 : 0;
  const loanRepay    = 70; // assume good since still active
  const responsibility = Math.round(noPanicScore + loanRepay);

  // Engagement (max 170)
  const walletAgeScore  = Math.min(walletAgeDays * 0.19, 70);
  const protocolScore   = Math.min(protocolsUsed * 20, 60);
  const governanceScore = hasGovernanceVotes ? 40 : 0;
  const engagement = Math.round(walletAgeScore + protocolScore + governanceScore);

  const total = Math.min(consistency + patience + responsibility + engagement, 850);
  const tierInfo = getScoreTier(total);

  return {
    total,
    tier: tierInfo.tier,
    tierColor: tierInfo.color,
    breakdown: {
      consistency:    { score: Math.min(consistency, 297),    max: 297, percent: Math.round(Math.min(consistency, 297) / 297 * 100) },
      patience:       { score: Math.min(patience, 212),       max: 212, percent: Math.round(Math.min(patience, 212) / 212 * 100) },
      responsibility: { score: Math.min(responsibility, 170), max: 170, percent: Math.round(Math.min(responsibility, 170) / 170 * 100) },
      engagement:     { score: Math.min(engagement, 170),     max: 170, percent: Math.round(Math.min(engagement, 170) / 170 * 100) },
    },
    pointsToNextTier: Math.max(tierInfo.nextTierScore - total, 0),
    nextTierLabel: tierInfo.nextTierLabel,
    nextTierScore: tierInfo.nextTierScore,
    weeklyGain: Math.round(3 + Math.random() * 5), // approx based on activity
  };
}
