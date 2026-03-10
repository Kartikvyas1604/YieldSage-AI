'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const FACTORS = [
  { name: 'Repayment History',      weight: '30%', desc: 'Loan repayment discipline and default record.' },
  { name: 'Wallet Age & Activity',  weight: '20%', desc: 'Account maturity and transaction consistency.' },
  { name: 'Trading Risk Profile',   weight: '20%', desc: 'Volatility, leverage usage, and loss patterns.' },
  { name: 'Liquidity Provision',    weight: '15%', desc: 'LP duration, range management, and commitment.' },
  { name: 'Governance Engagement',  weight: '15%', desc: 'DAO participation and voting track record.' },
];

export function ScoreFactorsSection() {
  return (
    <section className="py-24 px-6 border-t border-border bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">Scoring Model</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              Evaluation Metrics
            </h2>
          </div>
          <Link href="/dashboard" className="btn-primary self-start md:self-auto">
            Check My Score <ArrowRight size={15} />
          </Link>
        </div>

        <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
          {FACTORS.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-bg-card hover:bg-bg-hover transition-colors">
              <div>
                <p className="font-semibold text-sm text-text-primary">{f.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{f.desc}</p>
              </div>
              <span className="font-mono font-bold text-sm text-text-primary ml-6 shrink-0">{f.weight}</span>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="mt-16 p-8 border border-border rounded-lg bg-bg-card text-center">
          <h3 className="font-display text-2xl font-bold mb-3">Ready to build your credit identity?</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Connect your Solana wallet and receive your score in under 30 seconds.
          </p>
          <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
            Get Your Score Free <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
