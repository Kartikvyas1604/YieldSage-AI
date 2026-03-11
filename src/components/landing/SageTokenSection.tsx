'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

const SAGE_TIERS = [
  { tokens: '0',        tier: 'Free',    strategies: 'Stable Yield',           monitor: 'Every 60 min', cap: '$1,000' },
  { tokens: '1,000',    tier: 'Starter', strategies: 'Stable Yield + Smart LP', monitor: 'Every 30 min', cap: '$10,000' },
  { tokens: '10,000',   tier: 'Pro',     strategies: 'All 3 Strategies',        monitor: 'Every 10 min', cap: '$100,000' },
  { tokens: '50,000',   tier: 'Elite',   strategies: 'All + Undercollateralized loans', monitor: 'Every 5 min', cap: 'Unlimited' },
];

export function SageTokenSection() {
  return (
    <section id="sage-token" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ background: 'linear-gradient(135deg, var(--accent-sage), var(--accent-sage-dark))' }}>
            <Leaf size={24} color="white" />
          </div>
          <p className="text-sm font-mono text-text-muted uppercase tracking-widest mb-3">$SAGE Token</p>
          <h2 className="font-display text-4xl font-bold text-text-primary mb-4">
            Hold $SAGE. Unlock More.
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            $SAGE is the protocol token. Hold it to unlock advanced strategies, faster monitoring, and higher capital limits.
          </p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="text-left p-4 text-xs font-mono text-text-muted uppercase tracking-wider">$SAGE Required</th>
                  <th className="text-left p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Tier</th>
                  <th className="text-left p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Strategies</th>
                  <th className="text-left p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Monitoring</th>
                  <th className="text-left p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Max Capital</th>
                </tr>
              </thead>
              <tbody>
                {SAGE_TIERS.map((t, i) => (
                  <tr key={t.tier} className={`border-b border-border transition-colors hover:bg-bg-secondary ${i === 2 ? 'bg-bg-secondary' : ''}`}>
                    <td className="p-4">
                      <span className="font-mono font-semibold text-text-primary">{t.tokens}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: i === 0 ? 'var(--bg-secondary)' : i === 1 ? 'rgba(232,164,58,0.15)' : i === 2 ? 'rgba(91,140,90,0.15)' : 'rgba(212,168,67,0.15)',
                          color: i === 0 ? 'var(--text-muted)' : i === 1 ? 'var(--warning)' : i === 2 ? 'var(--accent-sage)' : 'var(--accent-gold)',
                        }}
                      >
                        {t.tier}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-text-secondary">{t.strategies}</td>
                    <td className="p-4 text-sm font-mono text-text-secondary">{t.monitor}</td>
                    <td className="p-4 text-sm font-mono text-text-primary font-semibold">{t.cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Earn $SAGE by keeping funds in the protocol. Longer you stay → more $SAGE → better strategies.
        </p>
      </div>
    </section>
  );
}
