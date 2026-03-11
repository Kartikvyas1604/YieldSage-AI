'use client';

import React from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import type { SmartWalletSignal } from '@/lib/integrations/smart-wallet-tracker';

interface Props {
  signals: SmartWalletSignal[];
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const CONFIDENCE_COLORS = {
  HIGH: { bg: 'rgba(76,175,125,0.1)', border: 'rgba(76,175,125,0.3)', text: '#4caf7d' },
  MEDIUM: { bg: 'rgba(232,164,58,0.1)', border: 'rgba(232,164,58,0.3)', text: '#e8a43a' },
  LOW: { bg: 'rgba(160,157,184,0.08)', border: 'rgba(160,157,184,0.2)', text: '#a09db8' },
};

export function SmartSignalFeed({ signals }: Props) {
  const displaySignals = signals.slice(0, 5);

  return (
    <div className="card p-4 sm:p-5">
      {/* Header with MetEngine attribution */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-text-primary flex items-center gap-2 text-sm sm:text-base">
            🔍 Smart LP Signals
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Top Meteora LP wallets — AI verifies before acting
          </p>
        </div>

        {/* MetEngine attribution badge */}
        <a
          href="https://metengine.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 self-start sm:self-auto flex-shrink-0"
          style={{
            background: 'rgba(255,107,53,0.1)',
            border: '1px solid rgba(255,107,53,0.25)',
            color: '#FF6B35',
          }}
        >
          <span
            className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: '#FF6B35', color: '#fff' }}
          >
            M
          </span>
          <span>MetEngine</span>
          <span
            className="px-1 py-0.5 rounded text-[10px]"
            style={{ background: 'rgba(91,140,90,0.15)', color: 'var(--accent-sage)' }}
          >
            AI-Enhanced ✨
          </span>
          <ExternalLink size={10} />
        </a>
      </div>

      {/* Signal list */}
      <div className="space-y-2.5">
        {displaySignals.length === 0 ? (
          <div className="text-center py-6 text-text-muted text-sm">
            No signals in the last hour. Market is quiet.
          </div>
        ) : (
          displaySignals.map((signal, i) => {
            const colors = CONFIDENCE_COLORS[signal.confidence];
            return (
              <div
                key={`${signal.walletAddress}-${signal.timestamp}-${i}`}
                className="rounded-xl p-3 transition-all"
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* Signal header row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <span className="font-mono text-xs text-text-secondary">
                    {truncateAddress(signal.walletAddress)}
                  </span>

                  <span
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: signal.action === 'entered' ? '#4caf7d' : '#e05c5c' }}
                  >
                    {signal.action === 'entered' ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {signal.action === 'entered' ? 'Entered' : 'Exited'}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-text-muted ml-auto">
                    <Clock size={10} />
                    {timeAgo(signal.timestamp)}
                  </span>
                </div>

                {/* Pool info */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-text-primary">
                    {signal.pool} Pool
                  </span>
                  <span className="text-xs text-text-muted">
                    Hist. APY:{' '}
                    <span className="font-semibold" style={{ color: colors.text }}>
                      {signal.historicalReturnRate.toFixed(0)}%
                    </span>
                  </span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-full ml-auto"
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {signal.confidence}
                  </span>
                </div>

                {/* AI verdict */}
                <div
                  className="flex items-start gap-1.5 text-xs rounded-lg px-2.5 py-2"
                  style={{ background: 'rgba(26,26,46,0.04)' }}
                >
                  <span className="flex-shrink-0">🤖</span>
                  <span className="text-text-secondary">
                    {signal.confidence === 'HIGH'
                      ? 'AI is monitoring this signal and may act for Growth strategy users.'
                      : signal.confidence === 'MEDIUM'
                      ? 'Signal noted — evaluating against your risk profile.'
                      : 'Signal too old — marking as informational only.'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Explanation footer */}
      <div
        className="mt-4 p-3 rounded-xl text-xs text-text-secondary leading-relaxed"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <strong className="text-text-primary">💡 MetEngine vs YieldSage:</strong>{' '}
        <a
          href="https://metengine.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: '#FF6B35' }}
        >
          MetEngine
        </a>{' '}
        pioneered smart wallet LP copying via Telegram. YieldSage adds Claude AI
        reasoning — instead of blindly copying, we evaluate IF the signal matches
        YOUR risk profile before acting.
      </div>
    </div>
  );
}
