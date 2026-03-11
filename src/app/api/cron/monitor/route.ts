/**
 * GET /api/cron/monitor
 * Vercel Cron job handler — monitors active positions and triggers rebalance if needed.
 * Called every 4 hours. Vercel cron schedule: "0 * /4 * * *" (remove space)
 * 
 * Requires Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Demo: simulate active positions from in-memory store (real app: Postgres/Redis)
const DEMO_POSITIONS = [
  {
    walletAddress: "Demo1111111111111111111111111111111111111111",
    strategyId: "balanced",
    protocol: "Kamino Finance",
    principal: 1000,
    currentAPY: 14.2,
    lastRebalance: Date.now() - 4 * 60 * 60 * 1000,
  },
];

interface CheckResult {
  wallet: string;
  action: "rebalanced" | "all_clear" | "paused";
  reason: string;
}

async function checkPosition(position: (typeof DEMO_POSITIONS)[0]): Promise<CheckResult> {
  const hoursSinceRebalance =
    (Date.now() - position.lastRebalance) / (1000 * 60 * 60);

  // Trigger rebalance if APY dropped or it's been more than 4 hours
  if (position.currentAPY < 8 || hoursSinceRebalance >= 4) {
    return {
      wallet: position.walletAddress,
      action: "rebalanced",
      reason: `APY at ${position.currentAPY}% — rebalanced to higher yield pool`,
    };
  }

  return {
    wallet: position.walletAddress,
    action: "all_clear",
    reason: `APY ${position.currentAPY}% healthy — no action needed`,
  };
}

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const results: CheckResult[] = [];

  for (const position of DEMO_POSITIONS) {
    const result = await checkPosition(position);
    results.push(result);
  }

  const rebalanced = results.filter((r) => r.action === "rebalanced").length;
  const allClear = results.filter((r) => r.action === "all_clear").length;

  return NextResponse.json({
    success: true,
    checkedAt: new Date(startedAt).toISOString(),
    durationMs: Date.now() - startedAt,
    positionsChecked: results.length,
    rebalanced,
    allClear,
    results,
  });
}
