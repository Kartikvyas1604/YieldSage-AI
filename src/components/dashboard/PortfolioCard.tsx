'use client';

import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { EarningsCounter } from '@/components/ui/EarningsCounter';
import { StrategyBadge } from '@/components/ui/StrategyBadge';
import type { UserStrategy } from '@/types/strategy';

interface Props {
  totalValue: number;
  totalEarned: number;
  strategy?: UserStrategy | null;
  change24h?: number;
}

export function PortfolioCard({ totalValue, totalEarned, strategy, change24h = 0 }: Props) {
  const pct = totalValue > 0 ? (totalEarned / totalValue) * 100 : 0;

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(91,140,90,0.12)' }}>
            <DollarSign size={16} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <span className="text-sm font-medium text-text-secondary">Portfolio Value</span>
        </div>
        {strategy && <StrategyBadge strategyId={strategy.strategyId} size="sm" />}
      </div>

      <EarningsCounter
        value={totalValue}
        className="text-3xl sm:text-4xl font-mono font-bold text-text-primary"
        prefix="$"
        decimals={2}
      />

      <div className="flex items-center gap-2 mt-2 mb-4">
        <TrendingUp size={14} style={{ color: change24h >= 0 ? 'var(--accent-sage)' : '#ef4444' }} />
        <span className="text-sm font-mono"
          style={{ color: change24h >= 0 ? 'var(--accent-sage)' : '#ef4444' }}>
          {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)} today
        </span>
      </div>

      {/* Earned bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-text-muted">
          <span>Total earned</span>
          <span className="font-mono" style={{ color: 'var(--accent-sage)' }}>+${totalEarned.toFixed(2)}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(pct * 5, 100)}%`, background: 'var(--accent-sage)' }} />
        </div>
      </div>
    </div>
  );
}
