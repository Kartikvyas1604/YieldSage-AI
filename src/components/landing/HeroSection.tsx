'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Cpu, TrendingUp } from 'lucide-react';
import { EarningsCounter } from '@/components/ui/EarningsCounter';
import { AIStatusDot } from '@/components/ui/AIThinking';

export function HeroSection() {
  const [earnings, setEarnings] = useState(547.83);

  // Simulate live earnings ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => parseFloat((prev + 0.000032).toFixed(5)));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden hero-gradient">
      {/* Subtle warm grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--accent-sage) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Soft glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(ellipse, var(--accent-sage) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full text-xs font-mono border"
              style={{ borderColor: 'var(--accent-sage)', color: 'var(--accent-sage)', background: 'rgba(91,140,90,0.08)' }}>
              <AIStatusDot active />
              AI Agent Active · Monitoring 24/7
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-[1.1]">
              Your Money.<br />
              <span style={{ color: 'var(--accent-sage)' }}>Growing.</span><br />
              On Autopilot.
            </h1>

            <p className="text-lg text-text-secondary max-w-lg leading-relaxed mb-8">
              YieldSage AI manages your crypto savings on Solana — completely automatically.
              Answer 3 questions, deploy in 1 click, earn yield forever. No experience needed.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { icon: Shield,    text: 'Read-only risk analysis' },
                { icon: Cpu,       text: '1-click deploy' },
                { icon: TrendingUp, text: 'AI monitors 24/7' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 text-xs text-text-secondary px-3 py-1.5 rounded-full border border-border bg-bg-card">
                  <Icon size={12} style={{ color: 'var(--accent-sage)' }} />
                  {text}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/onboard" className="btn-sage text-base px-7 py-3.5">
                Start Earning in 2 Minutes <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => {
                  localStorage.setItem('ys_demo', '1');
                  window.location.href = '/dashboard';
                }}
                className="btn-outline text-base px-7 py-3.5"
              >
                Try Demo
              </button>
            </div>

            {/* Social proof */}
            <p className="mt-6 text-sm text-text-muted">
              Start with as little as <strong className="text-text-primary">$50</strong> · No crypto knowledge required · Withdraw anytime
            </p>
          </div>

          {/* Right — Live Dashboard Preview */}
          <div className="hidden lg:flex flex-col gap-4 animate-float">
            {/* Portfolio card */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-text-secondary">Your Portfolio</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: 'var(--success)', background: 'rgba(76,175,125,0.1)' }}>
                  ↑ +9.4%
                </span>
              </div>
              <div className="text-4xl font-mono font-bold text-text-primary mb-1">
                <EarningsCounter value={earnings} decimals={2} />
              </div>
              <p className="text-xs text-text-muted mb-3">Initial: $500 · Gain: +$47.83</p>
              <div className="w-full h-1.5 rounded-full bg-bg-secondary overflow-hidden">
                <div className="h-full rounded-full progress-fill" style={{ width: '84%' }} />
              </div>
              <p className="text-xs text-text-muted mt-1.5">9.4% earned in 67 days</p>
            </div>

            {/* AI Status Card */}
            <div className="card p-5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(91,140,90,0.1)' }}>
                <Cpu size={18} style={{ color: 'var(--accent-sage)' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-text-primary">AI Agent</span>
                  <AIStatusDot active />
                  <span className="text-xs text-text-muted">Active</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your funds are safe and earning. Last checked: 4 mins ago.
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--accent-sage)' }}>
                  Latest: Rebalanced LP position · +$2.30 return
                </p>
              </div>
            </div>

            {/* Score teaser */}
            <div className="card p-5 flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full border-4 flex items-center justify-center font-mono font-bold text-lg"
                  style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>
                  452
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary mb-0.5">Trust Score: Building</div>
                <div className="w-40 h-1.5 rounded-full bg-bg-secondary overflow-hidden mb-1">
                  <div className="h-full rounded-full" style={{ width: '53%', background: 'var(--warning)' }} />
                </div>
                <p className="text-xs text-text-muted">198 pts to Smart LP tier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


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
