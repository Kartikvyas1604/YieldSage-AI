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
    const result      = calculateYieldSageScore({
      walletAgeDays:      onChainData.walletAgeDays,
      daysInProtocol:     onChainData.defiActivity.lendingTxCount + onChainData.defiActivity.lpTxCount,
      activeMonths:       Math.min(Math.round(onChainData.walletAgeDays / 30), 24),
      noPanicWithdrawals: onChainData.successfulTransactions > 10,
      avgPositionDays:    Math.round(onChainData.walletAgeDays / Math.max(onChainData.defiActivity.lpTxCount, 1)),
      protocolsUsed:      onChainData.defiActivity.lendingProtocols.length + onChainData.defiActivity.lpProtocols.length,
      hasGovernanceVotes: onChainData.defiActivity.governanceTxCount > 0,
    });
    return NextResponse.json({ ...result, walletAddress, calculatedAt: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Score calculation failed' },
      { status: 500 },
    );
  }
}
