'use client';

import React from 'react';
import { Bot, CheckCircle, Clock, Pause } from 'lucide-react';
import { AIStatusDot } from '@/components/ui/AIThinking';
import type { AgentActionLog } from '@/types/agent';

type AgentStatus = 'idle' | 'monitoring' | 'rebalancing' | 'paused';

interface Props {
  status: AgentStatus;
  lastAction?: AgentActionLog | null;
  nextCheck?: number; // unix ms
  actionsToday?: number;
}

const STATUS_LABEL: Record<AgentStatus, string> = {
  idle: 'Standing by',
  monitoring: 'Monitoring position',
  rebalancing: 'Rebalancing portfolio',
  paused: 'Paused by you',
};

const STATUS_COLOR: Record<AgentStatus, string> = {
  idle: 'var(--text-muted)',
  monitoring: 'var(--accent-sage)',
  rebalancing: 'var(--accent-amber)',
  paused: '#ef4444',
};

export function AgentStatusCard({ status, lastAction, nextCheck, actionsToday = 0 }: Props) {
  const minutesUntilNext = nextCheck
    ? Math.max(0, Math.round((nextCheck - Date.now()) / 60000))
    : null;

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(91,140,90,0.12)' }}>
            <Bot size={16} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <span className="text-sm font-medium text-text-secondary">AI Agent</span>
        </div>
        <AIStatusDot active={status !== 'paused'} />
      </div>

      <p className="text-lg sm:text-xl font-semibold text-text-primary mb-1" style={{ color: STATUS_COLOR[status] }}>
        {STATUS_LABEL[status]}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-text-muted">
        {minutesUntilNext !== null && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Next check in {minutesUntilNext}m
          </span>
        )}
        <span className="flex items-center gap-1">
          <CheckCircle size={12} />
          {actionsToday} actions today
        </span>
      </div>

      {lastAction && (
        <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-text-muted text-xs mb-1">Last action</p>
          <p className="text-text-primary font-medium">{lastAction.plainEnglish}</p>
          {lastAction.reasoning && (
            <p className="text-text-muted text-xs mt-1 line-clamp-1">{lastAction.reasoning}</p>
          )}
        </div>
      )}
    </div>
  );
}
