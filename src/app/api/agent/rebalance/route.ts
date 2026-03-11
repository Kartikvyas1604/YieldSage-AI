/**
 * POST /api/agent/rebalance
 * Trigger a manual rebalance for a wallet position
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body: { walletAddress?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { walletAddress, reason = 'manual' } = body;

  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'walletAddress required' }, { status: 400 });
  }

  // In production: trigger AI agent to evaluate and execute rebalance
  return NextResponse.json({
    success:   true,
    jobId:     `rebal_${Date.now()}`,
    message:   `Rebalance job queued for ${walletAddress.slice(0, 8)}…`,
    reason,
    estimatedCompletionMs: 30_000,
  });
}
