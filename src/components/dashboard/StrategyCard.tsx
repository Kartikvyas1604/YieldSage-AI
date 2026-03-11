'use client';

import React from 'react';
import { Zap, TrendingUp, Shield } from 'lucide-react';
import type { UserStrategy } from '@/types/strategy';

interface Props {
  strategy: UserStrategy;
  currentAPY: number;
  onPause?: () => void;
  onSwitch?: () => void;
}

const RISK_COLORS = ['', '#22c55e', '#86efac', '#f59e0b', '#f97316', '#ef4444'];

const STRATEGY_META: Record<string, { name: string; emoji: string; riskLevel: number }> = {
  conservative: { name: 'Stable Yield', emoji: '🏦', riskLevel: 1 },
  balanced:     { name: 'Smart LP',     emoji: '⚖️',  riskLevel: 3 },
  growth:       { name: 'Turbo Yield',  emoji: '🚀',  riskLevel: 5 },
};

export function StrategyCard({ strategy, currentAPY, onPause, onSwitch }: Props) {
  const meta = STRATEGY_META[strategy.strategyId] ?? { name: strategy.strategyId, emoji: '📊', riskLevel: 2 };
  const gainPct = strategy.principal > 0
    ? ((strategy.currentValue - strategy.principal) / strategy.principal) * 100
    : 0;

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <h3 className="font-semibold text-text-primary">{meta.name}</h3>
            <p className="text-xs text-text-muted">{strategy.protocol}</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            background: strategy.status === 'active' ? 'rgba(91,140,90,0.12)' : 'rgba(239,68,68,0.1)',
            color: strategy.status === 'active' ? 'var(--accent-sage)' : '#ef4444',
          }}>
          {strategy.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-base font-mono font-bold" style={{ color: 'var(--accent-sage)' }}>
            {currentAPY.toFixed(1)}%
          </p>
          <p className="text-xs text-text-muted mt-0.5">APY</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-base font-mono font-bold text-text-primary">
            ${strategy.principal.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted mt-0.5">Principal</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-base font-mono font-bold"
            style={{ color: gainPct >= 0 ? 'var(--accent-sage)' : '#ef4444' }}>
            {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%
          </p>
          <p className="text-xs text-text-muted mt-0.5">Gain</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-xs text-text-muted">Risk level:</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{
              background: i <= meta.riskLevel ? RISK_COLORS[meta.riskLevel] : 'var(--border)'
            }} />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {onPause && (
          <button onClick={onPause} className="btn-outline text-sm px-4 py-2 flex items-center gap-1 flex-1 justify-center">
            <Shield size={14} /> Pause
          </button>
        )}
        {onSwitch && (
          <button onClick={onSwitch} className="btn-outline text-sm px-4 py-2 flex items-center gap-1 flex-1 justify-center">
            <Zap size={14} /> Switch Strategy
          </button>
        )}
      </div>
    </div>
  );
}
