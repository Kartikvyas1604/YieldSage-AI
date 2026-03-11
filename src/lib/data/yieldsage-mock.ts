// YieldSage AI — Complete Demo Mock Data

import type { AgentActionLog, StreamMessage } from '@/types/agent';
import type { ScoreTierLabel } from '@/types/strategy';

// ── Demo User ────────────────────────────────────────────────

export const DEMO_USER = {
  name: 'Alex',
  wallet: 'Demo...Sage',
  walletFull: 'Demo7xYieldSageAI1234567890abcdef',
  initialDeposit: 500,
  currentValue: 547.83,
  totalEarned: 47.83,
  percentGain: 9.57,
  daysActive: 67,

  strategy: 'conservative' as const,
  currentAPY: 8.4,
  protocol: 'Kamino Finance',
  safetyPercent: 94,

  creditScore: 452,
  creditTier: 'BUILDING' as ScoreTierLabel,
  scoreToNextTier: 198,
  nextTierName: 'Fair',
  nextTierScore: 650,

  sageBalance: 0,
  sageTier: 'Free',

  earningsToday: 0.71,
  earningsWeek: 4.97,
  earningsMonth: 19.40,

  lastChecked: '4 minutes ago',
  nextCheck: '26 minutes',
};

// ── Earnings History (30 days) ───────────────────────────────

export const EARNINGS_HISTORY: { date: string; value: number; earnings: number }[] = (() => {
  const data = [];
  let cumulative = 500;
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    const daily = 0.60 + Math.random() * 0.25;
    cumulative += daily;
    data.push({
      date: date.toISOString().slice(0, 10),
      value: parseFloat(cumulative.toFixed(2)),
      earnings: parseFloat(daily.toFixed(2)),
    });
  }
  return data;
})();

// ── Score Breakdown ──────────────────────────────────────────

export const SCORE_BREAKDOWN = {
  consistency: {
    score: 175,
    max: 297,
    label: 'Consistency',
    icon: '📅',
    trend: 'up' as const,
    description: 'How consistently you keep funds deployed',
    tip: 'Keep funds in for 2 more weeks to earn +35 points',
    color: '#5b8c5a',
  },
  patience: {
    score: 143,
    max: 212,
    label: 'Patience',
    icon: '⏳',
    trend: 'up' as const,
    description: 'How long you hold your positions',
    tip: 'Your patience score grows daily — keep it up!',
    color: '#4caf7d',
  },
  responsibility: {
    score: 78,
    max: 170,
    label: 'Responsibility',
    icon: '🛡️',
    trend: 'stable' as const,
    description: 'No panic withdrawals during market drops',
    tip: 'Stay the course during the next dip for +20 points',
    color: '#e8a43a',
  },
  engagement: {
    score: 56,
    max: 170,
    label: 'Engagement',
    icon: '⚡',
    trend: 'up' as const,
    description: 'Active on-chain, uses multiple protocols',
    tip: 'Try one more Solana protocol to earn +15 points',
    color: '#d4a843',
  },
};

// ── Score History (weekly snapshots) ────────────────────────

export const SCORE_HISTORY: { date: string; score: number }[] = [
  { date: '10 weeks ago', score: 210 },
  { date: '9 weeks ago',  score: 241 },
  { date: '8 weeks ago',  score: 268 },
  { date: '7 weeks ago',  score: 299 },
  { date: '6 weeks ago',  score: 321 },
  { date: '5 weeks ago',  score: 354 },
  { date: '4 weeks ago',  score: 381 },
  { date: '3 weeks ago',  score: 406 },
  { date: '2 weeks ago',  score: 429 },
  { date: 'Last week',    score: 452 },
];

// ── AI Action Logs ───────────────────────────────────────────

export const DEMO_ACTION_LOGS: AgentActionLog[] = [
  {
    id: 'act_1',
    timestamp: Date.now() - 2 * 3600 * 1000,
    type: 'monitor',
    plainEnglish: 'Checked your position — everything looks great! Earning at 8.4% APY.',
    reasoning: 'Regular 30-minute check. Kamino lending rate stable. No rebalancing needed.',
    impact: null,
    result: 'all_clear',
  },
  {
    id: 'act_2',
    timestamp: Date.now() - 3 * 86400 * 1000,
    type: 'rebalance',
    plainEnglish: 'Moved your funds to a slightly better rate (8.4% vs 7.9%). You\'ll earn an extra $0.42 this month.',
    reasoning: 'Detected a 0.5% APY improvement opportunity in a different Kamino lending pool. Capital reallocation cost $0.001 in gas.',
    impact: '+$0.42/month',
    result: 'success',
    amountUsd: 547,
  },
  {
    id: 'act_3',
    timestamp: Date.now() - 14 * 86400 * 1000,
    type: 'emergency_protect',
    plainEnglish: 'Detected a risk signal in Solana DeFi markets. Moved everything to maximum safety for 6 hours, then back when the risk passed. Protected about $12 in potential losses.',
    reasoning: 'Unusual liquidity withdrawal detected in primary lending pool. Precautionary exit to USDC. Risk resolved after 6 hours — position redeployed.',
    impact: 'Saved ~$12',
    result: 'success',
    amountUsd: 535,
  },
  {
    id: 'act_4',
    timestamp: Date.now() - 45 * 86400 * 1000,
    type: 'deploy',
    plainEnglish: 'Deployed your $500 into Kamino Finance lending. Your money is now safely earning 8.2% per year.',
    reasoning: 'Initial strategy deployment based on onboarding answers. Conservative profile matches Kamino USDC lending. Strategy locked and monitoring started.',
    impact: 'Started earning',
    result: 'success',
    amountUsd: 500,
  },
];

// ── AI Stream Messages ───────────────────────────────────────

export const DEMO_AI_STREAM: StreamMessage[] = [
  { type: 'observe', message: 'Scanning your wallet balance... $547.83 USDC ✓' },
  { type: 'observe', message: 'Checking Kamino lending rates... 8.4% APY ✓' },
  { type: 'observe', message: 'Looking for better opportunities on Meteora... not yet suitable for your score' },
  { type: 'think',   message: 'Analyzing current position performance...' },
  { type: 'think',   message: 'Current strategy is performing within optimal parameters' },
  { type: 'think',   message: 'Credit score increased by +3 points since last check' },
  { type: 'think',   message: 'No exit conditions triggered. All signals green.' },
  { type: 'act',     message: 'No rebalancing needed. Holding optimal position.' },
  { type: 'report',  message: 'All clear, Alex. You earned $0.71 today. 🌿' },
];

// ── Improvement Tips ─────────────────────────────────────────

export const IMPROVEMENT_TIPS = [
  {
    icon: '📅',
    title: 'Stay for 2 more weeks',
    description: 'Your consistency score will jump significantly if you keep funds deployed through the next 14 days.',
    points: '+35 points',
    priority: 'high' as const,
  },
  {
    icon: '⚡',
    title: 'Try one more protocol',
    description: 'Using another Solana DeFi protocol (like Marginfi for lending or Jupiter for swaps) boosts your engagement score.',
    points: '+15 points',
    priority: 'medium' as const,
  },
  {
    icon: '💎',
    title: 'Hold through next dip',
    description: 'Not withdrawing during the next market drop earns a major responsibility bonus.',
    points: '+20 points',
    priority: 'medium' as const,
  },
];
