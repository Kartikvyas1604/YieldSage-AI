'use client';

import React from 'react';
import { Zap, TrendingUp, Shield, ExternalLink } from 'lucide-react';
import type { UserStrategy } from '@/types/strategy';

interface Props {
  strategy: UserStrategy;
  currentAPY: number;
  onPause?: () => void;
  onSwitch?: () => void;
}

const RISK_COLORS = ['', '#22c55e', '#86efac', '#f59e0b', '#f97316', '#ef4444'];

interface ProtocolBadge {
  name: string;
  url: string;
  stat: string;
  color: string;
  letter: string;
}

const STRATEGY_META: Record<string, {
  name: string;
  emoji: string;
  riskLevel: number;
  protocols: ProtocolBadge[];
  poolInfo?: { name: string; apy: string; tvl: string; ilRisk: string };
}> = {
  conservative: {
    name: 'Stable Yield',
    emoji: '🏦',
    riskLevel: 1,
    protocols: [
      { name: 'Kamino Finance', url: 'https://kamino.finance', stat: '$2.8B TVL', color: '#C4A000', letter: 'K' },
    ],
  },
  balanced: {
    name: 'Smart LP',
    emoji: '⚖️',
    riskLevel: 3,
    protocols: [
      { name: 'Meteora DLMM', url: 'https://meteora.ag', stat: '$39.9B/mo vol', color: '#8B5CF6', letter: 'M' },
      { name: 'Jupiter', url: 'https://jup.ag', stat: 'Best swap rates', color: '#C084FC', letter: 'J' },
    ],
    poolInfo: { name: 'SOL-USDC', apy: '24.5%', tvl: '$12M', ilRisk: 'Medium IL' },
  },
  growth: {
    name: 'Turbo Yield',
    emoji: '🚀',
    riskLevel: 5,
    protocols: [
      { name: 'Meteora DLMM', url: 'https://meteora.ag', stat: '$39.9B/mo vol', color: '#8B5CF6', letter: 'M' },
      { name: 'Kamino Finance', url: 'https://kamino.finance', stat: '$2.8B TVL', color: '#C4A000', letter: 'K' },
      { name: 'Jupiter', url: 'https://jup.ag', stat: 'Best swap rates', color: '#C084FC', letter: 'J' },
    ],
  },
};

export function StrategyCard({ strategy, currentAPY, onPause, onSwitch }: Props) {
  const meta = STRATEGY_META[strategy.strategyId] ?? { name: strategy.strategyId, emoji: '📊', riskLevel: 2, protocols: [] };
  const gainPct = strategy.principal > 0
    ? ((strategy.currentValue - strategy.principal) / strategy.principal) * 100
    : 0;

  return (
    <div className="card p-4 sm:p-6">
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

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="p-2 sm:p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-sm sm:text-base font-mono font-bold" style={{ color: 'var(--accent-sage)' }}>
            {currentAPY.toFixed(1)}%
          </p>
          <p className="text-xs text-text-muted mt-0.5">APY</p>
        </div>
        <div className="p-2 sm:p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-sm sm:text-base font-mono font-bold text-text-primary">
            ${strategy.principal.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted mt-0.5">Principal</p>
        </div>
        <div className="p-2 sm:p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-sm sm:text-base font-mono font-bold"
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

      {/* AI-selected pool info (Balanced strategy) */}
      {meta.poolInfo && (
        <div
          className="mb-4 p-3 rounded-xl"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5">
            🤖 AI Selected Pool
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-text-primary">{meta.poolInfo.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(91,140,90,0.1)', color: 'var(--accent-sage)' }}>
              {meta.poolInfo.apy} fee APY
            </span>
            <span className="text-xs text-text-muted">{meta.poolInfo.tvl} TVL</span>
            <span className="text-xs text-text-muted">{meta.poolInfo.ilRisk}</span>
          </div>
        </div>
      )}

      {/* Protocol attribution badges */}
      {meta.protocols && meta.protocols.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
            Powered by
          </p>
          <div className="flex flex-wrap gap-2">
            {meta.protocols.map((protocol) => (
              <a
                key={protocol.name}
                href={protocol.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
                style={{
                  background: `rgba(${hexToRgbStr(protocol.color)}, 0.08)`,
                  border: `1px solid rgba(${hexToRgbStr(protocol.color)}, 0.2)`,
                  color: protocol.color,
                }}
              >
                <span
                  className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: protocol.color }}
                >
                  {protocol.letter}
                </span>
                <span className="font-medium">{protocol.name}</span>
                <span className="text-[10px] opacity-70 hidden sm:inline">{protocol.stat}</span>
                <ExternalLink size={9} className="opacity-60" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {onPause && (
          <button onClick={onPause} className="btn-outline text-sm px-3 sm:px-4 py-2 flex items-center gap-1 flex-1 justify-center">
            <Shield size={14} /> Pause
          </button>
        )}
        {onSwitch && (
          <button onClick={onSwitch} className="btn-outline text-sm px-3 sm:px-4 py-2 flex items-center gap-1 flex-1 justify-center">
            <Zap size={14} /> Switch Strategy
          </button>
        )}
      </div>
    </div>
  );
}

function hexToRgbStr(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '91,140,90';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
