'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import {
  RefreshCw, Copy, Check, ExternalLink,
  TrendingUp, Shield, Zap, BarChart2,
  Clock, Wallet, ChevronRight, Brain,
} from 'lucide-react';
import { AIAnalysisStream } from '@/components/dashboard/AIAnalysisStream';
import { formatAddress } from '@/lib/utils/format';
import type { CredScore, AIReasoning } from '@/types/score';

function humanTier(score: number): string {
  if (score >= 750) return 'Platinum';
  if (score >= 650) return 'Gold';
  if (score >= 500) return 'Silver';
  return 'Bronze';
}

// ── Connect wallet prompt ─────────────────────────────────────
function ConnectPrompt() {
  const { setVisible } = useWalletModal();
  return (
    <div className="min-h-screen bg-bg-secondary pt-16 flex items-center justify-center">
      <div className="max-w-sm mx-auto px-6 text-center">
        <div className="w-14 h-14 border border-border rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Wallet size={26} className="text-text-muted" />
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary mb-3">
          Connect Your Wallet
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          Connect your Solana wallet to fetch your real on-chain credit score — powered by
          Gemini AI and live blockchain data.
        </p>
        <button onClick={() => setVisible(true)} className="btn-primary text-sm px-8 py-3">
          Connect Wallet
        </button>
      </div>
    </div>
  );
}

// ── Analyzing state ───────────────────────────────────────────
function AnalyzingState({ progress, reasoning }: { progress: string; reasoning: AIReasoning[] }) {
  return (
    <div className="min-h-screen bg-bg-secondary pt-16 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-6 py-16 text-center w-full">
        <div className="w-14 h-14 border border-border rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <Brain size={26} className="text-text-primary animate-pulse" />
        </div>
        <h2 className="font-display text-xl font-bold text-text-primary mb-2">
          Analyzing Your Wallet
        </h2>
        <p className="font-mono text-xs text-text-muted mb-8 min-h-[1rem]">
          {progress || 'Starting analysis…'}
        </p>
        <div className="text-left border border-border rounded-lg bg-bg-card p-4 max-h-56 overflow-y-auto">
          {reasoning.length === 0 ? (
            <p className="text-xs text-text-muted font-mono">Fetching on-chain data…</p>
          ) : (
            <AIAnalysisStream reasoning={reasoning} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────
export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const [score,     setScore]     = useState<CredScore | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress,  setProgress]  = useState('');
  const [reasoning, setReasoning] = useState<AIReasoning[]>([]);
  const [error,     setError]     = useState<string | null>(null);
  const [copied,    setCopied]    = useState(false);

  const address = publicKey?.toBase58() ?? '';

  const analyze = useCallback(async (addr: string) => {
    if (!addr || analyzing) return;
    setAnalyzing(true);
    setError(null);
    setScore(null);
    setReasoning([]);
    setProgress('Starting…');

    try {
      const res = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ walletAddress: addr }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
        throw new Error(err.error || 'Analysis failed');
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'progress')  setProgress(event.step);
            if (event.type === 'reasoning') {
              setReasoning(prev => [...prev, {
                category:  event.category,
                reasoning: event.reasoning,
                impact:    'positive',
                timestamp: event.timestamp,
              }]);
            }
            if (event.type === 'score')  setScore(event.score);
            if (event.type === 'error')  throw new Error(event.error);
          } catch (parseErr) {
            // Skip malformed event lines; rethrow real errors
            if (parseErr instanceof Error && parseErr.message !== 'JSON Parse error') {
              throw parseErr;
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }, [analyzing]);

  // Auto-analyze when wallet first connects
  useEffect(() => {
    if (connected && address && !score && !analyzing && !error) {
      analyze(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, address]);

  const handleCopy = useCallback(async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [address]);

  const handleRefresh = useCallback(() => {
    if (address) analyze(address);
  }, [address, analyze]);

  const handleExplorer = useCallback(() => {
    window.open(`https://solscan.io/account/${address}`, '_blank', 'noopener noreferrer');
  }, [address]);

  if (!connected)                   return <ConnectPrompt />;
  if (analyzing || (!score && !error)) return <AnalyzingState progress={progress} reasoning={reasoning} />;

  if (error) {
    return (
      <div className="min-h-screen bg-bg-secondary pt-16 flex items-center justify-center">
        <div className="max-w-sm mx-auto px-6 text-center">
          <p className="font-mono text-xs text-text-muted mb-3 uppercase tracking-wider">Analysis error</p>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">{error}</p>
          <button onClick={handleRefresh} className="btn-primary gap-2 text-sm">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!score) return null;

  const tier = humanTier(score.score);

  return (
    <div className="min-h-screen bg-bg-secondary pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold border border-border rounded bg-bg-card text-text-secondary uppercase tracking-wider">
                Live
              </span>
              <span className="text-xs text-text-muted font-mono">{tier} Tier</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-bold text-text-primary">Credit Dashboard</h1>
              <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-text-secondary">
                <Wallet size={12} className="text-text-muted" />
                {formatAddress(address, 6)}
                <button onClick={handleCopy} className="text-text-muted hover:text-text-primary transition-colors">
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                </button>
                <button onClick={handleExplorer} className="text-text-muted hover:text-text-primary transition-colors">
                  <ExternalLink size={11} />
                </button>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/history" className="btn-outline text-xs py-1.5 px-3 gap-1">
              <Clock size={13} /> History
            </Link>
            <button
              onClick={handleRefresh}
              disabled={analyzing}
              className="btn-primary text-xs py-1.5 px-3 gap-1"
            >
              <RefreshCw size={13} className={analyzing ? 'animate-spin' : ''} />
              {analyzing ? 'Updating…' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: BarChart2, label: 'Credit Score',  value: String(score.score),             sub: '/ 850' },
            { icon: TrendingUp,label: 'Risk Flags',    value: score.riskFlags?.length === 0 ? 'Clean' : `${score.riskFlags?.length ?? 0} flags`, sub: 'assessed' },
            { icon: Shield,    label: 'Tier Status',   value: score.tier,                       sub: 'on-chain' },
            { icon: Zap,       label: 'Borrow Tier',   value: tier,                             sub: 'unlocked' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="p-4 border border-border rounded-lg bg-bg-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{label}</p>
                <Icon size={13} className="text-text-muted" />
              </div>
              <p className="font-display text-xl font-bold text-text-primary">{value}</p>
              <p className="text-[10px] text-text-muted mt-0.5 font-mono">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Score Breakdown */}
          <div className="lg:col-span-2 border border-border rounded-lg bg-bg-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-sm text-text-primary">Score Breakdown</h2>
              <Link
                href="/dashboard/score"
                className="text-xs font-mono text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
              >
                Full Report <ChevronRight size={11} />
              </Link>
            </div>

            <div className="p-5 flex items-center gap-8">
              {/* Score ring */}
              <div className="shrink-0 relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="9" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="var(--text-primary)" strokeWidth="9"
                    strokeDasharray={`${(score.score / 850) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-bold text-text-primary">{score.score}</span>
                  <span className="text-[9px] font-mono text-text-muted">/ 850</span>
                </div>
              </div>

              {/* Category bars */}
              <div className="flex-1 w-full space-y-3">
                {score.breakdown && Object.entries(score.breakdown).map(([category, item]) => (
                  <div key={category}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize text-text-primary font-medium">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-mono text-text-muted">{item.score}/{item.maxScore}</span>
                    </div>
                    <div className="h-1 w-full bg-bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-text-primary rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (item.score / item.maxScore) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Intelligence */}
          <div
            className="border border-border rounded-lg bg-bg-card flex flex-col overflow-hidden"
            style={{ maxHeight: 320 }}
          >
            <div className="px-5 py-3.5 border-b border-border shrink-0">
              <h2 className="font-semibold text-sm text-text-primary">AI Intelligence</h2>
              <p className="text-[10px] text-text-muted mt-0.5 font-mono">Gemini 2.5 Flash — live analysis</p>
            </div>
            <div className="flex-1 p-3 overflow-y-auto">
              <AIAnalysisStream reasoning={score.aiReasoning ?? []} />
            </div>
          </div>
        </div>

        {/* ── Action Cards ── */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              title: 'View Full Report',
              desc:  'Detailed breakdown across all 5 vectors.',
              href:  '/dashboard/score',
              cta:   'Open Report',
              external: false,
            },
            {
              title: 'Score History',
              desc:  'Track credit score progress over time.',
              href:  '/dashboard/history',
              cta:   'View History',
              external: false,
            },
            {
              title: 'View on Solscan',
              desc:  'Inspect wallet on the block explorer.',
              href:  `https://solscan.io/account/${address}`,
              cta:   'Open Explorer',
              external: true,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-4 border border-border rounded-lg bg-bg-card hover:border-text-primary transition-colors flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold text-sm text-text-primary">{card.title}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{card.desc}</p>
              </div>
              {card.external ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs py-1.5 px-3 gap-1 shrink-0"
                >
                  {card.cta} <ExternalLink size={11} />
                </a>
              ) : (
                <Link href={card.href} className="btn-outline text-xs py-1.5 px-3 gap-1 shrink-0">
                  {card.cta} <ChevronRight size={11} />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* ── Improvement Tips (if any) ── */}
        {score.improvementTips && score.improvementTips.length > 0 && (
          <div className="border border-border rounded-lg bg-bg-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h2 className="font-semibold text-sm text-text-primary">How to Improve Your Score</h2>
            </div>
            <div className="divide-y divide-border">
              {score.improvementTips.slice(0, 4).map((tip, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-text-primary capitalize">
                      {tip.category.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">{tip.suggestion}</p>
                  </div>
                  <span className="font-mono text-xs text-text-muted shrink-0">
                    +{tip.potentialGain} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
