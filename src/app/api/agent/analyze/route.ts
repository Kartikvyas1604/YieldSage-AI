/**
 * POST /api/agent/analyze
 * YieldSage AI — streams wallet analysis and yield score as Server-Sent Events
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { YIELDSAGE_SYSTEM_PROMPT } from '@/lib/agent/prompts';
import { calculateYieldSageScore } from '@/lib/scoring/yieldsage-score';
import { fetchWalletOnChainData } from '@/lib/agent/tools';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

export async function POST(request: NextRequest) {
  let body: { walletAddress?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { walletAddress } = body;

  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 });
  }

  if (!isValidSolanaAddress(walletAddress)) {
    return NextResponse.json({ error: 'Invalid Solana address' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  const encoder = new TextEncoder();
  const stream  = new TransformStream();
  const writer  = stream.writable.getWriter();

  const send = (obj: object) =>
    writer.write(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

  (async () => {
    try {
      await send({ type: 'progress', step: 'Fetching on-chain data…' });

      // Fetch on-chain data
      const onChainData = await fetchWalletOnChainData(walletAddress).catch(() => null);

      await send({ type: 'progress', step: 'Calculating YieldSage score…' });

      // Calculate score from on-chain data
      const scoreResult = onChainData
        ? calculateYieldSageScore({
            walletAgeDays:        onChainData.walletAgeDays,
            daysInProtocol:       onChainData.defiActivity.lendingTxCount + onChainData.defiActivity.lpTxCount,
            activeMonths:         Math.min(Math.round(onChainData.walletAgeDays / 30), 24),
            noPanicWithdrawals:   onChainData.successfulTransactions > 10,
            avgPositionDays:      Math.round(onChainData.walletAgeDays / Math.max(onChainData.defiActivity.lpTxCount, 1)),
            protocolsUsed:        onChainData.defiActivity.lendingProtocols.length + onChainData.defiActivity.lpProtocols.length,
            hasGovernanceVotes:   onChainData.defiActivity.governanceTxCount > 0,
          })
        : null;

      await send({ type: 'progress', step: 'Running AI analysis…' });

      const anthropic = new Anthropic({ apiKey });

      const userMessage = `Analyze this Solana wallet for YieldSage AI:
Wallet: ${walletAddress}
On-chain data: ${JSON.stringify(onChainData ?? 'unavailable', null, 2)}
Current Score: ${scoreResult?.total ?? 'unknown'} / 850
Score Tier: ${scoreResult?.tier ?? 'NEW'}

Provide:
1. Which YieldSage strategy is recommended (conservative/balanced/growth) and why
2. Key risk observations
3. Plain-English explanation of top 3 score factors
4. Estimated monthly earnings for a $1000 deposit`;

      const aiResponse = await anthropic.messages.create({
        model:      'claude-3-5-haiku-20241022',
        max_tokens: 800,
        system:     YIELDSAGE_SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: userMessage }],
      });

      const aiText = aiResponse.content
        .filter(b => b.type === 'text')
        .map(b => (b as { type: 'text'; text: string }).text)
        .join('\n');

      await send({ type: 'ai_analysis', text: aiText });

      if (scoreResult) {
        await send({ type: 'score', score: scoreResult.total, tier: scoreResult.tier, breakdown: scoreResult.breakdown });
      }

      await send({ type: 'done' });
    } catch (err) {
      await send({ type: 'error', error: err instanceof Error ? err.message : 'Analysis failed' });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
