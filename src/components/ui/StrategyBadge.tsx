'use client';

import React from 'react';
import type { StrategyId } from '@/types/strategy';

const STRATEGY_CONFIG: Record<StrategyId, { label: string; color: string; bg: string; emoji: string }> = {
  conservative: { label: 'Stable Yield',  color: '#4caf7d', bg: 'rgba(76,175,125,0.1)',  emoji: '🏦' },
  balanced:     { label: 'Smart LP',      color: '#5b8c5a', bg: 'rgba(91,140,90,0.1)',   emoji: '⚖️' },
  growth:       { label: 'Turbo Yield',   color: '#d4a843', bg: 'rgba(212,168,67,0.1)',  emoji: '🚀' },
};

interface StrategyBadgeProps {
  strategyId: StrategyId;
  size?: 'sm' | 'md' | 'lg';
}

export function StrategyBadge({ strategyId, size = 'md' }: StrategyBadgeProps) {
  const config = STRATEGY_CONFIG[strategyId] ?? STRATEGY_CONFIG.conservative;
  const sizeClasses = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]}`}
      style={{ color: config.color, background: config.bg }}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
