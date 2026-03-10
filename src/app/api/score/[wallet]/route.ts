/**
 * GET /api/score/[wallet]
 * On-demand real credit score for any valid Solana wallet.
 * Used by external protocols to query scores.
 */

import { NextRequest, NextResponse } from "next/server";
import { runCredChainAgent, validateSolanaAddress } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  try {
    const { wallet: walletAddress } = await params;

    if (!validateSolanaAddress(walletAddress)) {
      return NextResponse.json({ error: "Invalid Solana wallet address" }, { status: 400 });
    }

    const result = await runCredChainAgent({ walletAddress });

    if (result.success && result.score) {
      return NextResponse.json({
        walletAddress,
        score:     result.score.score,
        tier:      result.score.tier,
        breakdown: result.score.breakdown,
        riskFlags: result.score.riskFlags,
        timestamp: result.score.timestamp,
      });
    }
    return NextResponse.json(
      { error: result.error ?? "Analysis failed", walletAddress },
      { status: 422 }
    );
  } catch (err) {
    console.error("Score Query Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
