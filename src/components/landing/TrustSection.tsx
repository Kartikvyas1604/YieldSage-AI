'use client';

import React from 'react';
import { Lock, Zap, Shield, FileText } from 'lucide-react';
import Link from 'next/link';

const TRUST = [
  { icon: Lock,     title: 'Read-only scanning',       desc: 'We only read your on-chain data. We never ask you to sign anything until you choose to deploy.' },
  { icon: Zap,      title: 'Emergency stop anytime',   desc: 'One button pauses all AI activity. Your funds are always accessible — complete withdrawal in seconds.' },
  { icon: Shield,   title: 'AI monitors every 30 min', desc: 'YieldSage checks your positions around the clock and exits automatically if any risk signal triggers.' },
  { icon: FileText, title: 'Full audit log',            desc: 'Every single AI action is logged in plain English. You always know exactly what happened and why.' },
];

export function TrustSection() {
  return (
    <section className="py-24 px-6 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-mono text-text-muted uppercase tracking-widest mb-3">Safety First</p>
          <h2 className="font-display text-4xl font-bold text-text-primary mb-4">
            Your Safety Is Our Priority
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            We built YieldSage for people who are uncertain about DeFi. Every feature is designed to keep you safe.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {TRUST.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card card-hover p-6 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(91,140,90,0.1)' }}>
                <Icon size={22} style={{ color: 'var(--accent-sage)' }} />
              </div>
              <h3 className="font-semibold text-text-primary mb-2 text-sm">{title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(91,140,90,0.08) 0%, rgba(196,135,90,0.05) 100%)', border: '1px solid var(--border)' }}
        >
          <h2 className="font-display text-4xl font-bold text-text-primary mb-4">
            Ready to Put Your Money to Work?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
            Start with as little as $50. No experience needed. AI handles everything.
          </p>
          <Link href="/onboard" className="btn-sage text-lg px-10 py-4 inline-flex">
            Start Earning Now
          </Link>
          <p className="mt-4 text-sm text-text-muted">Free to start · No credit card · Withdraw anytime</p>
        </div>
      </div>
    </section>
  );
}
