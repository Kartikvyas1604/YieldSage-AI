/**
 * POST /api/agent/deploy
 * Deploy a strategy for a connected wallet (stub — records intent, real deployment via Solana programs)
 */

import { NextRequest, NextResponse } from 'next/server';
import { STRATEGIES } from '@/lib/agent/strategies';
import type { StrategyId } from '@/types/strategy';

export async function POST(request: NextRequest) {
  let body: { walletAddress?: string; strategyId?: StrategyId; capitalUsd?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { walletAddress, strategyId, capitalUsd } = body;

  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'walletAddress required' }, { status: 400 });
  }
  if (!strategyId || !STRATEGIES[strategyId.toUpperCase()]) {
    return NextResponse.json({ error: 'Invalid strategyId' }, { status: 400 });
  }
  if (!capitalUsd || capitalUsd <= 0) {
    return NextResponse.json({ error: 'capitalUsd required' }, { status: 400 });
  }

  const strategy = STRATEGIES[strategyId.toUpperCase()];

  // In production: initiate Solana transaction to deploy funds to protocol
  // For now: return the deployment intent
  return NextResponse.json({
    success: true,
    deploymentId: `dep_${Date.now()}`,
    strategy:     { id: strategy.id, name: strategy.name, protocol: strategy.protocols[0] },
    capitalUsd,
    message: `Strategy "${strategy.name}" deployment queued. Agent will monitor every ${strategy.rebalanceFrequency}.`,
    nextMonitorAt: Date.now() + 30 * 60 * 1000,
  });
}
