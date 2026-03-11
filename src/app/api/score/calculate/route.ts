/**
 * POST /api/score/calculate
 * Calculate YieldSage credit score from on-chain data
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateYieldSageScore } from '@/lib/scoring/yieldsage-score';
import { fetchWalletOnChainData } from '@/lib/agent/tools';

export async function POST(request: NextRequest) {
  let body: { walletAddress?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { walletAddress } = body;

  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'walletAddress required' }, { status: 400 });
  }

  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
    return NextResponse.json({ error: 'Invalid Solana address' }, { status: 400 });
  }

  try {
    const onChainData = await fetchWalletOnChainData(walletAddress);
    const result      = calculateYieldSageScore(onChainData);
    return NextResponse.json({ ...result, walletAddress, calculatedAt: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Score calculation failed' },
      { status: 500 },
    );
  }
}
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
