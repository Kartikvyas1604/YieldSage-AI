'use client';

import React from 'react';
import { STRATEGIES } from '@/lib/agent/strategies';

const RISK_DOTS = (level: number, max = 5) =>
  Array.from({ length: max }, (_, i) => (
    <span
      key={i}
      className="w-2 h-2 rounded-full inline-block mr-1"
      style={{ background: i < level ? 'var(--accent-sage)' : 'var(--border)' }}
    />
  ));

export function StrategyTiersSection() {
  const strategies = Object.values(STRATEGIES);

  return (
    <section id="strategies" className="py-24 px-6 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-text-muted uppercase tracking-widest mb-3">Strategy Tiers</p>
          <h2 className="font-display text-4xl font-bold text-text-primary mb-4">
            Three Strategies. AI Picks Yours.
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Start safe. Earn trust. Unlock better returns — automatically.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {strategies.map((strategy, i) => (
            <div
              key={strategy.id}
              className={`card card-hover p-6 relative overflow-hidden ${i === 0 ? 'border-accent-sage' : ''}`}
              style={i === 0 ? { borderColor: 'var(--accent-sage)' } : {}}
            >
              {i === 0 && (
                <div
                  className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--accent-sage)', color: '#fff' }}
                >
                  Start Here
                </div>
              )}
              <div className="text-3xl mb-4">{strategy.emoji}</div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">{strategy.name}</h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">{strategy.plainEnglish}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">Annual Return</span>
                  <span className="font-mono font-semibold text-sm" style={{ color: 'var(--accent-sage)' }}>
                    {strategy.targetAPY.min}–{strategy.targetAPY.max}% APY
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">Risk Level</span>
                  <span>{RISK_DOTS(strategy.riskLevel)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-muted">IL Risk</span>
                  <span className="text-xs font-mono text-text-secondary">{strategy.impermanentLossRisk}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-text-muted mb-2">Powered by</p>
                <div className="flex flex-wrap gap-2">
                  {strategy.protocols.map(p => (
                    <span key={p} className="text-xs px-2 py-1 rounded-md bg-bg-secondary text-text-secondary font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {strategy.requiredScoreTier !== 'ANY' && (
                <div className="mt-3 text-xs">
                  <span className="text-text-muted">Unlocks at </span>
                  <span style={{ color: 'var(--accent-gold)' }} className="font-semibold">
                    {strategy.requiredScoreTier} tier
                  </span>
                  {strategy.requiredSageTokens > 0 && (
                    <span className="text-text-muted"> · {strategy.requiredSageTokens.toLocaleString()} $SAGE</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
