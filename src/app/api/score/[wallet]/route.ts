/**
 * GET /api/score/[wallet]
 * On-demand YieldSage yield score for any valid Solana wallet.
 * Used by external protocols or the dashboard to query a wallet's score.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchWalletOnChainData } from "@/lib/agent/tools";
import { calculateYieldSageScore, getScoreTier } from "@/lib/scoring/yieldsage-score";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet: walletAddress } = await params;

    if (!isValidSolanaAddress(walletAddress)) {
      return NextResponse.json({ error: "Invalid Solana wallet address" }, { status: 400 });
    }

    const onChainData = await fetchWalletOnChainData(walletAddress);

    const score = calculateYieldSageScore({
      walletAgeDays: onChainData.walletAgeDays,
      daysInProtocol: onChainData.defiActivity.lpProtocols.length > 0
        ? Math.min(onChainData.walletAgeDays, 365)
        : 0,
      activeMonths: Math.min(Math.floor(onChainData.walletAgeDays / 30), 24),
      noPanicWithdrawals: !onChainData.defiActivity.liquidations,
      avgPositionDays: onChainData.walletAgeDays / Math.max(onChainData.totalTransactions / 10, 1),
      protocolsUsed:
        onChainData.defiActivity.lendingProtocols.length +
        onChainData.defiActivity.lpProtocols.length,
      hasGovernanceVotes: onChainData.defiActivity.hasGovernanceActivity,
    });

    const tier = getScoreTier(score.total);

    return NextResponse.json({
      walletAddress,
      score: score.total,
      tier: tier.tier,
      tierColor: tier.color,
      breakdown: score.breakdown,
      pointsToNextTier: score.pointsToNextTier,
      nextTierLabel: score.nextTierLabel,
      weeklyGain: score.weeklyGain,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("[score/wallet] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
