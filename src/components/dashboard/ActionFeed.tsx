'use client';

import React from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, RefreshCw, Shield } from 'lucide-react';
import type { AgentActionLog } from '@/types/agent';

interface Props {
  logs: AgentActionLog[];
  maxShown?: number;
}

const ACTION_ICONS: Record<string, React.FC<{ size: number }>> = {
  deposit:    ArrowUpRight,
  withdraw:   ArrowDownRight,
  rebalance:  RefreshCw,
  monitor:    Activity,
  emergency:  Shield,
};

const ACTION_COLORS: Record<string, string> = {
  deposit:    '#22c55e',
  withdraw:   '#ef4444',
  rebalance:  'var(--accent-amber)',
  monitor:    'var(--accent-sage)',
  emergency:  '#8b5cf6',
};

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)  return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function ActionFeed({ logs, maxShown = 6 }: Props) {
  const shown = logs.slice(0, maxShown);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(91,140,90,0.12)' }}>
          <Activity size={16} style={{ color: 'var(--accent-sage)' }} />
        </div>
        <span className="text-sm font-medium text-text-secondary">AI Action Feed</span>
      </div>

      {shown.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">No actions yet — agent is watching your position.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((log, idx) => {
            const Icon = ACTION_ICONS[log.type] ?? Activity;
            const color = ACTION_COLORS[log.type] ?? 'var(--accent-sage)';
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: color + '18' }}>
                  <Icon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium leading-snug">{log.plainEnglish}</p>
                  {log.txHash && (
                    <p className="text-xs font-mono text-text-muted mt-0.5 truncate">tx: {log.txHash.slice(0, 12)}…</p>
                  )}
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap flex-shrink-0">
                  {timeAgo(log.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
