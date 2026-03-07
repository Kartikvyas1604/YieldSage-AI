/**
 * POST /api/score/calculate
 * Calculate credit score without streaming (synchronous)
 */

import { NextRequest, NextResponse } from "next/server";
import { runCredChainAgent, validateSolanaAddress } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, demoMode = false } = body;

    // Validate wallet address
    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    if (!demoMode && !validateSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid Solana wallet address" },
        { status: 400 }
      );
    }

    // Run analysis
    const result = await runCredChainAgent({
      walletAddress,
      demoMode,
    });

    if (result.success && result.score) {
      return NextResponse.json({
        success: true,
        score: result.score,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Analysis failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Score Calculation Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
