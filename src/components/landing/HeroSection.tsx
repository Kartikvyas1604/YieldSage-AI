'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Shield, Zap, TrendingUp } from 'lucide-react';

const STATS = [
  { label: 'Wallets Scored', value: '12,400+' },
  { label: 'Protocols Integrated', value: '24' },
  { label: 'Avg Score Accuracy', value: '97.3%' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border border-border rounded-full text-xs font-mono text-text-secondary bg-bg-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary animate-pulse" />
            LIVE ON SOLANA MAINNET
            <ChevronRight size={12} />
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-[1.05]">
            Your On-Chain History.<br />
            <span className="relative inline-block">
              Your Credit Identity.
              <span className="absolute bottom-1 left-0 w-full h-px bg-text-primary opacity-30" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed mb-10">
            CredChain AI analyzes your full Solana transaction history and generates a verifiable
            credit score — unlocking undercollateralized lending and institutional DeFi.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link href="/dashboard" className="btn-primary text-base px-7 py-3">
              Get Your Score <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="btn-outline text-base px-7 py-3"
            >
              How It Works
            </a>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted font-mono mt-0.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards — right side */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 w-64">
          {[
            { icon: Shield, label: 'Verified Score', desc: 'Tamper-proof on-chain proof' },
            { icon: Zap,    label: 'AI Powered',     desc: 'Gemini 2.5 Flash analysis' },
            { icon: TrendingUp, label: 'Dynamic',    desc: 'Updates with every tx' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="p-4 border border-border rounded-lg bg-bg-card">
              <div className="flex items-center gap-3 mb-1.5">
                <Icon size={15} className="text-text-secondary" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
              <p className="text-xs text-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
