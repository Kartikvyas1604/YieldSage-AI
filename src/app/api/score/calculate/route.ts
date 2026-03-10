/**
 * POST /api/score/calculate
 * Synchronously calculates a real credit score (no streaming).
 */

import { NextRequest, NextResponse } from "next/server";
import { runCredChainAgent, validateSolanaAddress } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

    if (!validateSolanaAddress(walletAddress)) {
      return NextResponse.json({ error: "Invalid Solana wallet address" }, { status: 400 });
    }

    const result = await runCredChainAgent({ walletAddress });

    if (result.success && result.score) {
      return NextResponse.json({ success: true, score: result.score });
    }
    return NextResponse.json(
      { success: false, error: result.error ?? "Analysis failed" },
      { status: 422 }
    );
  } catch (err) {
    console.error("Score Calculation Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
