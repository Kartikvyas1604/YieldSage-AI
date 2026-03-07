'use client';

import React, { useEffect, useRef } from 'react';
import type { AIReasoning } from '@/types/score';
import { formatRelativeTime } from '@/lib/utils/format';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';

interface AIAnalysisStreamProps {
  reasoning: AIReasoning[];
  isStreaming?: boolean;
}

export function AIAnalysisStream({ reasoning, isStreaming = false }: AIAnalysisStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest entry
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reasoning]);

  const getIconAndColor = (category: string, impact: string) => {
    if (category === 'risk') {
      return {
        icon: AlertTriangle,
        color: 'var(--accent-red)',
        bg: 'rgba(224, 82, 82, 0.1)',
        borderColor: 'var(--accent-red)',
      };
    }
    if (category === 'final') {
      return {
        icon: CheckCircle,
        color: 'var(--accent-gold)',
        bg: 'rgba(201, 168, 76, 0.1)',
        borderColor: 'var(--accent-gold)',
      };
    }
    if (impact.startsWith('+')) {
      return {
        icon: TrendingUp,
        color: 'var(--accent-green)',
        bg: 'rgba(46, 204, 138, 0.1)',
        borderColor: 'var(--accent-green)',
      };
    }
    if (impact.startsWith('-')) {
      return {
        icon: TrendingDown,
        color: 'var(--accent-red)',
        bg: 'rgba(224, 82, 82, 0.1)',
        borderColor: 'var(--accent-red)',
      };
    }
    return {
      icon: Info,
      color: 'var(--accent-blue)',
      bg: 'rgba(59, 125, 216, 0.1)',
      borderColor: 'var(--accent-blue)',
    };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-text-primary">
            AI Analysis
          </h3>
          {isStreaming && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
              <span className="font-mono text-xs text-text-secondary">Thinking...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {reasoning.map((entry, index) => {
          const { icon: Icon, color, bg, borderColor } = getIconAndColor(
            entry.category,
            entry.impact
          );

          return (
            <div
              key={index}
              className="animate-slide-in-right"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'backwards',
              }}
            >
              <div
                className="rounded-lg p-4 border-l-4 transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: bg,
                  borderLeftColor: borderColor,
                }}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    size={20}
                    style={{ color, marginTop: '2px' }}
                    className="flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-mono text-xs uppercase tracking-wider font-semibold"
                        style={{ color }}
                      >
                        {entry.step.replace(/_/g, ' ')}
                      </span>
                      {entry.timestamp && (
                        <span className="font-mono text-xs text-text-muted">
                          {formatRelativeTime(entry.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <p className="font-body text-sm text-text-secondary leading-relaxed mb-2">
                      {entry.message}
                    </p>
                    
                    <div
                      className="inline-flex items-center gap-1 px-2 py-1 rounded font-mono text-xs font-bold"
                      style={{
                        backgroundColor: `${color}30`,
                        color,
                      }}
                    >
                      {entry.impact}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
