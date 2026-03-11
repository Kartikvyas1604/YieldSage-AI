/**
 * YieldSage AI — Demo Flow Orchestration
 * Pre-scripted demo scenario that simulates a user's first 30 days.
 * Used by the dashboard in demo mode to show realistic AI agent behavior.
 */

import type { AgentActionLog } from "@/types/agent";

export interface DemoEvent {
  dayOffset: number;      // days from "now" (negative = past)
  type: "discovery" | "deploy" | "monitor" | "rebalance" | "earn" | "score_up";
  title: string;
  description: string;
  log: AgentActionLog;
  portfolioValueDelta: number;  // USD change at this event
  scoreGain: number;
}

const DEMO_EVENTS: DemoEvent[] = [
  {
    dayOffset: -30,
    type: "discovery",
    title: "Agent deployed",
    description: "YieldSage AI analyzed your wallet and selected the Balanced Growth strategy.",
    portfolioValueDelta: 0,
    scoreGain: 0,
    log: {
      id: "demo_evt_1",
      timestamp: Date.now() - 30 * 86400000,
      type: "deploy",
      plainEnglish: "Analyzed your wallet and deployed $1,000 to Kamino USDC-SOL stable pool.",
      reasoning: "Your risk tolerance (2/5) and 6-month horizon made the conservative-leaning balanced strategy ideal. Kamino's stable pool offers 12.3% APY with near-zero impermanent loss.",
      impact: "+$10.14/month projected",
      result: "success",
      txSignature: "demo1111111111111111111111111111111111111111111111111111111111111111",
      amountUsd: 1000,
    },
  },
  {
    dayOffset: -21,
    type: "monitor",
    title: "First monitoring check",
    description: "Agent confirmed position health and compound interest calculation.",
    portfolioValueDelta: 8.20,
    scoreGain: 3,
    log: {
      id: "demo_evt_2",
      timestamp: Date.now() - 21 * 86400000,
      type: "monitor",
      plainEnglish: "All clear — position earning normally at 12.3% APY. No action needed.",
      reasoning: "SOL price stable within 3% of entry. Impermanent loss 0%. Pool volume healthy at $2.1M/day. Holding is optimal.",
      impact: "+$8.20 earned so far",
      result: "all_clear",
      txSignature: undefined,
      amountUsd: undefined,
    },
  },
  {
    dayOffset: -14,
    type: "rebalance",
    title: "Rebalanced to higher yield",
    description: "APY detected on Meteora SOL-USDC pool surpassed current position by 8%.",
    portfolioValueDelta: 3.10,
    scoreGain: 5,
    log: {
      id: "demo_evt_3",
      timestamp: Date.now() - 14 * 86400000,
      type: "rebalance",
      plainEnglish: "Moved 40% of position to Meteora DLMM SOL-USDC for +8% additional yield.",
      reasoning: "Meteora's DLMM fee spike detected — 22.4% APY vs our current 12.3%. Partial rebalance (40%) captures the opportunity while keeping 60% in stable Kamino position as safety base.",
      impact: "+$3.10 extra in first week",
      result: "success",
      txSignature: "demo3333333333333333333333333333333333333333333333333333333333333333",
      amountUsd: 400,
    },
  },
  {
    dayOffset: -7,
    type: "earn",
    title: "Auto-compounded fees",
    description: "Claimed and reinvested $6.84 in accumulated protocol fees.",
    portfolioValueDelta: 6.84,
    scoreGain: 2,
    log: {
      id: "demo_evt_4",
      timestamp: Date.now() - 7 * 86400000,
      type: "rebalance",
      plainEnglish: "Auto-compounded $6.84 in fees — reinvested back into position for compound growth.",
      reasoning: "Weekly auto-compound boosts effective APY from 14.2% to ~15.1% annually. Small compound, big long-term difference.",
      impact: "+0.9% effective APY boost",
      result: "success",
      txSignature: "demo4444444444444444444444444444444444444444444444444444444444444444",
      amountUsd: 6.84,
    },
  },
  {
    dayOffset: -3,
    type: "score_up",
    title: "Score milestone: GOOD tier",
    description: "Reached 650+ points — unlocked the Growth strategy option.",
    portfolioValueDelta: 0,
    scoreGain: 15,
    log: {
      id: "demo_evt_5",
      timestamp: Date.now() - 3 * 86400000,
      type: "improve",
      plainEnglish: "Crossed 650 points — you're now in the GOOD tier. Growth strategy unlocked!",
      reasoning: "21 consecutive days in protocol + no panic withdrawals + 2 protocols used pushed you past the 650 threshold. Patience pays.",
      impact: "Unlock Growth strategy (24% APY target)",
      result: "success",
      txSignature: undefined,
      amountUsd: undefined,
    },
  },
  {
    dayOffset: 0,
    type: "monitor",
    title: "Today — agent monitoring",
    description: "Watching for yield opportunities and protocol health signals.",
    portfolioValueDelta: 2.30,
    scoreGain: 1,
    log: {
      id: "demo_evt_6",
      timestamp: Date.now() - 30 * 60 * 1000,
      type: "monitor",
      plainEnglish: "Checked 3 pools. All positions healthy. Meteora APY now 19.8% — still above threshold.",
      reasoning: "No rebalance needed. Meteora DLMM in-range. Kamino health factor 2.4. Next compound scheduled in 3 days.",
      impact: "On track for $38.50 this month",
      result: "all_clear",
      txSignature: undefined,
      amountUsd: undefined,
    },
  },
];

/**
 * Get demo events sorted by recency (most recent first).
 */
export function getDemoEvents(): DemoEvent[] {
  return [...DEMO_EVENTS].sort((a, b) => b.dayOffset - a.dayOffset);
}

/**
 * Get cumulative portfolio value trajectory for charting.
 * Starting from $1000 baseline.
 */
export function getDemoPortfolioTimeline(): Array<{ day: number; value: number; label: string }> {
  let value = 1000;
  const timeline = [{ day: -31, value, label: "Before YieldSage" }];

  for (const event of DEMO_EVENTS.sort((a, b) => a.dayOffset - b.dayOffset)) {
    value += event.portfolioValueDelta;
    const label = event.dayOffset === 0 ? "Today" : `Day ${30 + event.dayOffset}`;
    timeline.push({ day: event.dayOffset, value: Math.round(value * 100) / 100, label });
  }

  return timeline;
}

/**
 * Get projected portfolio value for future months.
 */
export function getDemoProjection(
  currentValue: number,
  apyPercent: number,
  months = 6
): Array<{ month: number; value: number; label: string }> {
  const monthlyRate = apyPercent / 100 / 12;
  const results = [];

  for (let m = 0; m <= months; m++) {
    const value = currentValue * Math.pow(1 + monthlyRate, m);
    results.push({
      month: m,
      value: Math.round(value * 100) / 100,
      label: m === 0 ? "Now" : `+${m}mo`,
    });
  }

  return results;
}
