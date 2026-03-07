'use client';

import React, { useState } from 'react';
import { GlowCard } from '@/components/ui/GlowCard';
import { AIAnalysisStream } from '@/components/dashboard/AIAnalysisStream';
import { DEMO_CRED_SCORE } from '@/lib/data/mock';
import {
  TrendingUp,
  Calendar,
  Wallet,
  RefreshCw,
  Activity,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { formatDate, formatAddress } from '@/lib/utils/format';

export default function DashboardPage() {
  const [score] = useState(DEMO_CRED_SCORE);

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-accent-blue/30 bg-accent-blue/5">
              <ShieldCheck className="w-4 h-4 text-accent-blue" />
              <span className="text-xs font-mono text-accent-blue uppercase tracking-wider">Verified Identity</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-text-primary mb-3">
              Credit Overview
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm font-mono">
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4" /> {formatAddress(score.walletAddress, 6)}
              </span>
              <span className="hidden md:inline text-border-bright">•</span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Updated {score.lastUpdated ? formatDate(score.lastUpdated, true) : 'Never'}
              </span>
            </div>
          </div>
          
          <button className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-border hover:border-accent-blue/50 text-text-primary rounded-full transition-all">
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-sm font-medium">Refresh Data</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlowCard className="bg-bg-secondary w-full" hover={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20 shrink-0">
                <Activity className="w-6 h-6 text-accent-gold" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Health Status</p>
                <p className="text-lg font-medium text-text-primary">Excellent</p>
              </div>
            </div>
          </GlowCard>
          
          <GlowCard className="bg-bg-secondary w-full" hover={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20 shrink-0">
                <TrendingUp className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">30-Day Trend</p>
                <p className="text-lg font-medium text-accent-blue">+24 Points</p>
              </div>
            </div>
          </GlowCard>

          <GlowCard className="bg-bg-secondary w-full" hover={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center border border-accent-green/20 shrink-0">
                <Zap className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Borrow Power</p>
                <p className="text-lg font-medium text-text-primary">High Tier</p>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 pt-4">
          
          {/* Left Column - Score Gauge & Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            <GlowCard className="bg-bg-card border-border/50 relative overflow-hidden" hover={false}>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 p-2">
                <div className="flex-1 w-full text-center md:text-left">
                  <h2 className="text-2xl font-semibold mb-2">Global Trust Score</h2>
                  <p className="text-text-secondary mb-8 font-light text-sm">
                    Aggregated across 4 chains and 12 protocols. Your score unlocks premium tiers.
                  </p>
                  <div className="space-y-5">
                    {score.breakdown && Object.entries(score.breakdown).map(([category, item], idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-primary capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-mono text-text-secondary">{item.score} <span className="text-border-bright">/</span> {item.maxScore}</span>
                        </div>
                        <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden border border-border/30">
                          <div 
                            className="h-full bg-gradient-to-r from-accent-blue/50 to-accent-blue rounded-full"
                            style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-64 h-64 shrink-0 flex items-center justify-center relative bg-bg-primary/50 backdrop-blur-sm rounded-full border border-border/50 shadow-2xl">
                   <div className="absolute inset-2 rounded-full border-[1px] border-border-bright/50" />
                   <div className="absolute inset-0 rounded-full border-[3px] border-accent-blue border-l-transparent border-t-transparent -rotate-45" />
                   <div className="text-center relative z-10">
                     <span className="text-7xl font-display font-bold text-gradient-blue tracking-tighter block">{score.score}</span>
                     <span className="text-xs uppercase tracking-[0.3em] text-text-muted mt-3 block">Out of 850</span>
                   </div>
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Right Column - AI Analysis */}
          <div className="lg:col-span-1 h-[560px]">
            <GlowCard className="h-full bg-bg-card border-border/50 flex flex-col p-6" hover={false}>
               <h3 className="text-xl font-medium mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-accent-gold" />
                 </div>
                 Live Agent Intelligence
               </h3>
               <div className="flex-1 relative bg-bg-primary rounded-xl border border-border/50 overflow-hidden shadow-inner">
                 <AIAnalysisStream reasoning={score.aiReasoning} />
               </div>
            </GlowCard>
          </div>

        </div>
      </div>
    </div>
  );
}
