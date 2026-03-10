'use client';

import React from 'react';

const STEPS = [
  {
    n: '01',
    title: 'Connect Wallet',
    desc: 'Link your Solana wallet. Read-only. No signing required. Your keys stay yours.',
  },
  {
    n: '02',
    title: 'Aggregate Data',
    desc: 'We fetch your transaction history, loan positions, LP activity, and governance votes.',
  },
  {
    n: '03',
    title: 'AI Analysis',
    desc: 'Gemini 2.5 Flash performs deep behavioral analysis weighted across five risk vectors.',
  },
  {
    n: '04',
    title: 'Unlock Tier',
    desc: 'Receive a verified credit score (0–850) and unlock premium borrowing thresholds.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">Methodology</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
            How It Works
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {STEPS.map((s) => (
            <div key={s.n} className="p-7 bg-bg-primary hover:bg-bg-secondary transition-colors">
              <p className="font-mono text-xs text-text-muted mb-5">{s.n}</p>
              <h3 className="font-semibold text-text-primary mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
