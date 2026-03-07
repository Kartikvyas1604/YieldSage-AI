/**
 * GET /api/score/[wallet]
 * Public endpoint for protocols to query credit scores
 */

import { NextRequest, NextResponse } from "next/server";
import { validateSolanaAddress } from "@/lib/agent";
import { DEMO_CRED_SCORE, DEMO_WALLET_ADDRESS } from "@/lib/data/mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const walletAddress = params.wallet;

    // Validate wallet address
    if (!validateSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid Solana wallet address" },
        { status: 400 }
      );
    }

    // Check if demo wallet
    if (walletAddress === DEMO_WALLET_ADDRESS) {
      return NextResponse.json({
        score: DEMO_CRED_SCORE.score,
        tier: DEMO_CRED_SCORE.tier,
        timestamp: DEMO_CRED_SCORE.timestamp,
        verified: true,
        demo: true,
      });
    }

    // TODO: Query from database/cache
    // const cachedScore = await redis.get(`score:${walletAddress}`);
    // if (cachedScore) return NextResponse.json(cachedScore);

    // Score not found
    return NextResponse.json(
      {
        error: "Score not found for this wallet. Please analyze first.",
        walletAddress,
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Score Query Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
