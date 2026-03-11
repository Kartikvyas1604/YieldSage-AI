'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, RefreshCw, Leaf } from 'lucide-react';
import { PortfolioCard }   from '@/components/dashboard/PortfolioCard';
import { EarningsCard }    from '@/components/dashboard/EarningsCard';
import { AgentStatusCard } from '@/components/dashboard/AgentStatusCard';
import { CreditScoreCard } from '@/components/dashboard/CreditScoreCard';
import { StrategyCard }    from '@/components/dashboard/StrategyCard';
import { ActionFeed }      from '@/components/dashboard/ActionFeed';
import { EmergencyStop }   from '@/components/dashboard/EmergencyStop';
import { AIThinking }      from '@/components/ui/AIThinking';
import {
  DEMO_USER,
  EARNINGS_HISTORY,
  SCORE_BREAKDOWN,
  DEMO_ACTION_LOGS,
  DEMO_AI_STREAM,
} from '@/lib/data/yieldsage-mock';

function ConnectPrompt() {
  const { setVisible } = useWalletModal();
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(91,140,90,0.12)' }}>
          <Wallet size={28} style={{ color: 'var(--accent-sage)' }} />
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary mb-3">Connect to YieldSage</h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          Connect your Solana wallet to let the AI analyze your on-chain history and build your yield strategy.
        </p>
        <button onClick={() => setVisible(true)} className="btn-sage w-full py-3.5 justify-center">
          <Wallet size={16} /> Connect Wallet
        </button>
        <p className="text-xs text-text-muted mt-4">Read-only — AI never touches your funds without permission.</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { connected } = useWallet();
  const [isDemo, setIsDemo]         = useState(false);
  const [isPaused, setIsPaused]     = useState(false);
  const [streamIdx, setStreamIdx]   = useState(0);
  const [showStream, setShowStream] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem('ys_onboarded');
    const demo      = localStorage.getItem('ys_demo');
    if (demo === '1' || onboarded === '1') setIsDemo(!connected);
  }, [connected]);

  useEffect(() => {
    if (!isDemo) return;
    const t = setInterval(() => { setStreamIdx(i => (i + 1) % DEMO_AI_STREAM.length); }, 3000);
    return () => clearInterval(t);
  }, [isDemo]);

  if (!connected && !isDemo) return <ConnectPrompt />;

  const user = DEMO_USER;
  const earningsHistory = EARNINGS_HISTORY.map(e => ({ date: e.date, amount: e.cumulativeEarned }));
  const scoreCategories = SCORE_BREAKDOWN.map(b => ({ label: b.category, score: b.score, max: b.max, color: b.color }));

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">

        {isDemo && (
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm mb-6"
            style={{ background: 'rgba(91,140,90,0.08)', border: '1px solid rgba(91,140,90,0.18)' }}>
            <Leaf size={16} style={{ color: 'var(--accent-sage)', flexShrink: 0 }} />
            <span className="text-text-secondary">
              <strong className="text-text-primary">Demo mode</strong> — simulated data. Connect a wallet for live AI.
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">
              {isDemo ? `Hey, ${user.name} 👋` : 'Your Dashboard'}
            </h1>
            <p className="text-text-secondary text-sm mt-0.5">AI is watching your position 24/7</p>
          </div>
          <button onClick={() => setShowStream(s => !s)} className="btn-outline text-sm px-4 py-2 flex items-center gap-2">
            <RefreshCw size={14} /> {showStream ? 'Hide' : 'Show'} AI
          </button>
        </div>

        {showStream && (
          <div className="card p-5 mb-6 space-y-2 max-h-52 overflow-y-auto">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">Live Agent Stream</p>
            {DEMO_AI_STREAM.slice(0, streamIdx + 1).map((msg, i) => (
              <AIThinking key={i} messages={[msg]} />
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <PortfolioCard
              totalValue={user.portfolioValue}
              totalEarned={user.totalEarned}
              strategy={user.strategy}
              change24h={user.change24h}
            />
            <EarningsCard
              daily={user.earningsToday}
              weekly={user.earningsWeek}
              monthly={user.earningsMonth}
              allTime={user.totalEarned}
              history={earningsHistory}
            />
            <ActionFeed logs={DEMO_ACTION_LOGS} />
          </div>
          <div className="space-y-5">
            <AgentStatusCard
              status={isPaused ? 'paused' : 'monitoring'}
              lastAction={DEMO_ACTION_LOGS[0]}
              nextCheck={Date.now() + 18 * 60 * 1000}
              actionsToday={4}
            />
            <CreditScoreCard
              score={user.yieldScore}
              tier={user.scoreTier}
              tierColor={user.scoreTierColor}
              nextTier="GOOD"
              pointsToNext={73}
              categories={scoreCategories}
            />
            {user.strategy && (
              <StrategyCard
                strategy={user.strategy}
                currentAPY={user.strategy.currentAPY}
                onPause={() => setIsPaused(p => !p)}
              />
            )}
            <EmergencyStop
              isPaused={isPaused}
              onPause={() => setIsPaused(p => !p)}
              onWithdraw={() => alert('In production this initiates a safe withdrawal.')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
