'use client';

import React from 'react';
import { Wallet, Brain, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Wallet,
    step: '01',
    title: 'Connect & Answer 3 Qs',
    desc: 'Connect your Solana wallet and answer 3 plain-English questions. Takes under 2 minutes.',
    detail: 'No DeFi knowledge needed. We ask about time, risk comfort, and goals.',
  },
  {
    icon: Brain,
    step: '02',
    title: 'AI Analyzes Your Profile',
    desc: 'YieldSage AI reads your wallet history and builds your unique risk profile and credit score.',
    detail: 'Claude AI analyzes your on-chain behavior to find the perfect strategy.',
  },
  {
    icon: Zap,
    step: '03',
    title: 'Strategy Deployed',
    desc: 'One click deploys your entire DeFi strategy. Funds go to work immediately, earning yield 24/7.',
    detail: 'We handle Kamino, Meteora, Jupiter — all of it. You just approve.',
  },
  {
    icon: ShieldCheck,
    step: '04',
    title: 'AI Monitors & Protects',
    desc: 'YieldSage monitors your position every 30 minutes and acts when needed — automatically.',
    detail: 'Rebalances positions, exits on risk signals, and upgrades your strategy as you level up.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-mono text-text-muted uppercase tracking-widest mb-3">Simple Process</p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            We Ask 3 Questions. AI Does The Rest.
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            No jargon. No complex forms. No DeFi experience required. Just honest answers about your money goals.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STEPS.map(({ icon: Icon, step, title, desc, detail }, i) => (
            <div key={step} className="relative">
              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute top-8 -right-3 z-10">
                  <ArrowRight size={16} className="text-text-muted" />
                </div>
              )}
              <div className="card card-hover p-4 sm:p-6 h-full">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(91,140,90,0.1)' }}
                  >
                    <Icon size={20} style={{ color: 'var(--accent-sage)' }} />
                  </div>
                  <span className="font-mono text-xs text-text-muted">{step}</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-sm sm:text-base">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-2 sm:mb-3">{desc}</p>
                <p className="text-xs text-text-muted leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}