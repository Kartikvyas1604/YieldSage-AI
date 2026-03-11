'use client';

import React from 'react';
import type { StreamMessage } from '@/types/agent';

interface AIThinkingProps {
  messages: StreamMessage[];
  isRunning?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  observe: 'var(--accent-sage)',
  think:   'var(--accent-warm)',
  act:     'var(--success)',
  report:  'var(--accent-gold)',
  error:   'var(--danger)',
};

const TYPE_ICONS: Record<string, string> = {
  observe: '👁️',
  think:   '🧠',
  act:     '⚡',
  report:  '✅',
  error:   '❌',
};

export function AIThinking({ messages, isRunning = false }: AIThinkingProps) {
  return (
    <div className="space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5 animate-fade-up text-sm"
          style={{ animationDelay: `${i * 50}ms`, opacity: 0, animationFillMode: 'forwards' }}
        >
          <span className="text-base leading-none mt-0.5">{TYPE_ICONS[msg.type] || '·'}</span>
          <span style={{ color: TYPE_COLORS[msg.type] || 'var(--text-secondary)' }} className="font-mono text-xs leading-relaxed">
            {msg.message}
          </span>
        </div>
      ))}
      {isRunning && (
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sage animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sage animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sage animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          AI is thinking...
        </div>
      )}
    </div>
  );
}

export function AIStatusDot({ active = true }: { active?: boolean }) {
  return (
    <span className="relative inline-flex">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
        style={{ background: active ? 'var(--accent-sage)' : 'var(--text-muted)' }}
      />
      <span
        className="relative inline-flex rounded-full h-2.5 w-2.5"
        style={{ background: active ? 'var(--accent-sage)' : 'var(--text-muted)' }}
      />
    </span>
  );
}
