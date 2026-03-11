'use client';

import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import type { PolymarketRiskSummary, PolymarketSignal } from '@/lib/integrations/polymarket';

interface Props {
  riskData: PolymarketRiskSummary;
}

const RISK_CONFIG = {
  LOW:     { emoji: '🟢', color: '#4caf7d', bg: 'rgba(76,175,125,0.1)',   border: 'rgba(76,175,125,0.25)' },
  MEDIUM:  { emoji: '🟡', color: '#e8a43a', bg: 'rgba(232,164,58,0.1)',   border: 'rgba(232,164,58,0.25)' },
  HIGH:    { emoji: '🟠', color: '#f97316', bg: 'rgba(249,115,22,0.1)',   border: 'rgba(249,115,22,0.25)' },
  EXTREME: { emoji: '🔴', color: '#e05c5c', bg: 'rgba(224,92,92,0.12)',   border: 'rgba(224,92,92,0.3)' },
};

const RELEVANCE_LABELS = {
  CRASH:    { emoji: '📉', label: 'Crash Risk' },
  SURGE:    { emoji: '📈', label: 'Surge Signal' },
  STABLE:   { emoji: '📊', label: 'Stable Market' },
  SYSTEMIC: { emoji: '⚠️', label: 'Systemic Risk' },
};

function SignalRow({ signal }: { signal: PolymarketSignal }) {
  const pct = Math.round(signal.yesPrice * 100);
  const rv = RELEVANCE_LABELS[signal.riskRelevance];
  const isHighProb = signal.yesPrice > 0.5;

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      {/* Question + relevance tag */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5">
        <p className="text-sm text-text-primary font-medium leading-snug pr-2">
          {signal.question}
        </p>
        <span
          className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full self-start flex-shrink-0"
          style={{
            background: 'rgba(91,140,90,0.1)',
            color: 'var(--accent-sage)',
            border: '1px solid rgba(91,140,90,0.2)',
          }}
        >
          {rv.emoji} {rv.label}
        </span>
      </div>

      {/* YES probability bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">YES probability</span>
          <span
            className="font-mono font-bold"
            style={{ color: isHighProb ? '#e05c5c' : '#4caf7d' }}
          >
            {pct}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: isHighProb
                ? 'linear-gradient(90deg, #f97316, #e05c5c)'
                : 'linear-gradient(90deg, var(--accent-sage), #4caf7d)',
            }}
          />
        </div>
      </div>

      {/* Volume + AI interpretation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
        <span className="text-[11px] text-text-muted">
          ${(signal.totalVolume / 1_000_000).toFixed(1)}M bet on this market
        </span>
        {signal.aiInterpretation && (
          <span
            className="text-[11px] flex items-start gap-1"
            style={{ color: 'var(--accent-warm)' }}
          >
            <span className="flex-shrink-0">🤖</span>
            <span>{signal.aiInterpretation}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export function PolymarketRiskPanel({ riskData }: Props) {
  const riskCfg = RISK_CONFIG[riskData.overallRisk];
  const displaySignals = riskData.signals.slice(0, 4);

  return (
    <div className="card p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-text-primary text-sm sm:text-base">
            🔮 Prediction Market Risk
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            AI reads crowd wisdom before moving your money
          </p>
        </div>

        {/* Polymarket attribution */}
        <a
          href="https://polymarket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 self-start flex-shrink-0"
          style={{
            background: 'rgba(0,102,255,0.08)',
            border: '1px solid rgba(0,102,255,0.2)',
            color: '#0066FF',
          }}
        >
          <span
            className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: '#0066FF', color: '#fff' }}
          >
            P
          </span>
          <span>Polymarket</span>
          <span
            className="flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px]"
            style={{ background: 'rgba(192,132,252,0.15)', color: '#C084FC' }}
          >
            <Zap size={8} />
            Solana
          </span>
          <ExternalLink size={10} />
        </a>
      </div>

      {/* Overall risk banner */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 rounded-xl mb-4"
        style={{ background: riskCfg.bg, border: `1px solid ${riskCfg.border}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{riskCfg.emoji}</span>
          <div>
            <p className="text-xs text-text-muted">Prediction Market Risk</p>
            <p className="text-sm font-bold" style={{ color: riskCfg.color }}>
              {riskData.overallRisk}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--accent-warm)' }}>
          <span className="flex-shrink-0">🤖</span>
          <p className="text-text-secondary leading-relaxed">{riskData.recommendation}</p>
        </div>
      </div>

      {/* Individual signals */}
      <div className="space-y-2.5 mb-4">
        {displaySignals.map((signal) => (
          <SignalRow key={signal.marketId} signal={signal} />
        ))}
      </div>

      {/* Feature explanation */}
      <div
        className="p-3 rounded-xl text-xs text-text-secondary leading-relaxed"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <strong className="text-text-primary">Why Polymarket?</strong>{' '}
        Polymarket traders bet <em>real money</em> on outcomes — making it{' '}
        <strong className="text-text-primary">94% accurate</strong> one month before
        resolution. Your AI reads these odds as macro risk signals before any strategy
        change.{' '}
        <a
          href="https://polymarket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: '#0066FF' }}
        >
          See live Solana markets →
        </a>
      </div>
    </div>
  );
}
