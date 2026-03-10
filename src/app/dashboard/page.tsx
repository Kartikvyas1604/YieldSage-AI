'use client';

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import {
  RefreshCw, Copy, Check, ExternalLink,
  TrendingUp, Shield, Zap, BarChart2,
  Clock, Wallet, ChevronRight
} from 'lucide-react';
import { AIAnalysisStream } from '@/components/dashboard/AIAnalysisStream';
import { DEMO_CRED_SCORE } from '@/lib/data/mock';
import { formatAddress } from '@/lib/utils/format';

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const [score] = useState(DEMO_CRED_SCORE);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const address = publicKey?.toBase58() ?? score.walletAddress;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [address]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRefreshing(false);
  }, []);

  const handleExplorer = useCallback(() => {
    window.open(`https://solscan.io/account/${address}`, '_blank', 'noopener noreferrer');
  }, [address]);

  const tier =
    score.score >= 750 ? 'Platinum' :
    score.score >= 650 ? 'Gold' :
    score.score >= 500 ? 'Silver' : 'Bronze';

  return (
    <div className="min-h-screen bg-bg-secondary pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-xs font-mono font-semibold border border-border rounded bg-bg-card text-text-secondary uppercase tracking-wider">
                {connected ? 'Live' : 'Demo'}
              </span>
              <span className="text-xs text-text-muted font-mono">
                {tier} Tier
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-1">
              Credit Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <Wallet size={13} className="text-text-muted" />
              <span className="font-mono text-sm text-text-secondary">
                {formatAddress(address, 8)}
              </span>
              <button onClick={handleCopy} className="text-text-muted hover:text-text-primary transition-colors ml-1">
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              <button onClick={handleExplorer} className="text-text-muted hover:text-text-primary transition-colors">
                <ExternalLink size={13} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/history" className="btn-outline text-sm py-2 px-4 gap-1.5">
              <Clock size={14} /> History
            </Link>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary text-sm py-2 px-4 gap-1.5"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: BarChart2, label: 'Credit Score', value: String(score.score), sub: 'out of 850' },
            { icon: TrendingUp, label: '30-Day Change', value: '+24 pts', sub: 'improving' },
            { icon: Shield, label: 'Risk Level', value: 'Low', sub: 'verified' },
            { icon: Zap, label: 'Borrow Tier', value: tier, sub: 'unlocked' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="p-5 border border-border rounded-lg bg-bg-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider">{label}</p>
                <Icon size={14} className="text-text-muted" />
              </div>
              <p className="font-display text-2xl font-bold text-text-primary">{value}</p>
              <p className="text-xs text-text-muted mt-0.5 font-mono">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Score Breakdown */}
          <div className="lg:col-span-2 border border-border rounded-lg bg-bg-card overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">Score Breakdown</h2>
              <Link href="/dashboard/score" className="text-xs font-mono text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors">
                Full Report <ChevronRight size={12} />
              </Link>
            </div>

            <div className="p-6 flex flex-col md:flex-row items-center gap-10">
              {/* Ring */}
              <div className="shrink-0 relative w-44 h-44">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="var(--text-primary)" strokeWidth="8"
                    strokeDasharray={`${(score.score / 850) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-4xl font-bold text-text-primary">{score.score}</span>
                  <span className="text-[10px] font-mono text-text-muted mt-0.5">/ 850</span>
                </div>
              </div>

              {/* Bars */}
              <div className="flex-1 w-full space-y-4">
                {score.breakdown && Object.entries(score.breakdown).map(([category, item]) => (
                  <div key={category}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="capitalize text-text-primary font-medium">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-mono text-text-muted">{item.score}/{item.maxScore}</span>
                    </div>
                    <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-text-primary rounded-full transition-all duration-700"
                        style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Intelligence */}
          <div className="border border-border rounded-lg bg-bg-card flex flex-col overflow-hidden min-h-[400px]">
            <div className="px-6 py-5 border-b border-border">
              <h2 className="font-semibold text-text-primary">AI Intelligence</h2>
              <p className="text-xs text-text-muted mt-0.5 font-mono">Gemini 2.5 Flash analysis</p>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <AIAnalysisStream reasoning={score.aiReasoning} />
            </div>
          </div>
        </div>

        {/* ── Action Cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'View Full Report',
              desc: 'Detailed score breakdown across all 5 vectors.',
              href: '/dashboard/score',
              cta: 'Open Report',
            },
            {
              title: 'Score History',
              desc: 'Track your credit score progress over time.',
              href: '/dashboard/history',
              cta: 'View History',
            },
            {
              title: 'View on Solscan',
              desc: 'Inspect your wallet on the Solana block explorer.',
              href: `https://solscan.io/account/${address}`,
              cta: 'Open Explorer',
              external: true,
            },
          ].map((card) => (
            <div key={card.title} className="p-6 border border-border rounded-lg bg-bg-card hover:border-text-primary transition-colors group">
              <h3 className="font-semibold text-text-primary mb-1.5">{card.title}</h3>
              <p className="text-sm text-text-secondary mb-5">{card.desc}</p>
              {card.external ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs py-1.5 px-3 gap-1"
                >
                  {card.cta} <ExternalLink size={11} />
                </a>
              ) : (
                <Link href={card.href} className="btn-outline text-xs py-1.5 px-3 gap-1">
                  {card.cta} <ChevronRight size={11} />
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
