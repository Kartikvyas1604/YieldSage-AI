'use client';

import React from 'react';

export function ProblemSection() {
  return (
    <section className="py-24 px-6 border-y border-border bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">The Problem</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
            DeFi is crippled by over-collateralization.
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Without identity or credit history, every borrower must lock up more than they borrow.
            Capital is wasted. Opportunity is lost. CredChain solves this.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Without CredChain */}
          <div className="p-6 border border-border rounded-lg bg-bg-card">
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-5">Without CredChain</p>
            <div className="space-y-3 font-mono text-sm">
              {[
                ['Collateral Required', '$1,500'],
                ['You Can Borrow', '$1,000'],
                ['Capital Efficiency', '66%'],
                ['Liquidation Risk', 'High'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <span className="text-text-secondary">{k}</span>
                  <span className="font-semibold text-text-primary">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* With CredChain */}
          <div className="p-6 border border-border-bright rounded-lg bg-bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-text-primary" />
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-5">With CredChain</p>
            <div className="space-y-3 font-mono text-sm">
              {[
                ['Collateral Required', '$800'],
                ['You Can Borrow', '$1,000'],
                ['Capital Efficiency', '125%'],
                ['Liquidation Risk', 'Low'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <span className="text-text-secondary">{k}</span>
                  <span className="font-bold text-text-primary">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
