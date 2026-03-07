'use client';

import React, { useState } from 'react';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { GlowCard } from '@/components/ui/GlowCard';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { AIAnalysisStream } from '@/components/dashboard/AIAnalysisStream';
import { DEMO_CRED_SCORE } from '@/lib/data/mock';
import {
  TrendingUp,
  Calendar,
  Users,
  Wallet,
  Award,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { formatDate, formatAddress } from '@/lib/utils/format';
import { CATEGORY_MAX_SCORES } from '@/lib/utils/constants';

export default function DashboardPage() {
  const [score] = useState(DEMO_CRED_SCORE);

  return (
    <div className="min-h-screen bg-bg-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-text-primary mb-2">
                Your Credit Score
              </h1>
              <p className="font-body text-text-secondary flex items-center gap-2">
                <Wallet size={16} />
                {formatAddress(score.walletAddress, 6)}
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-accent-blue rounded-lg font-body font-semibold text-text-primary hover:bg-accent-blue-bright transition-colors">
              <RefreshCw size={18} />
              Refresh Score
            </button>
          </div>

          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Calendar size={14} />
            Last updated: {formatDate(score.lastUpdated, true)}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Score */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Score Card */}
            <GlowCard glowColor="gold">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
                    Credit Score
                  </h2>
                  <ScoreBadge score={score.score} size="large" />
                </div>
                
                <div className="flex items-center gap-2 text-accent-green">
                  <TrendingUp size={20} />
                  <span className="font-mono text-lg font-bold">
                    +{score.scoreHistory[score.scoreHistory.length - 1]?.change || 0}
                  </span>
                  <span className="text   -text-secondary text-sm">this week</span>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <ScoreGauge score={score.score} size="large" animate={true} />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Loans Repaid", value: "4/4", icon: Award },
                  { label: "LP Days", value: "244", icon: TrendingUp },
                  { label: "Wallet Age", value: "547d", icon: Calendar },
                  { label: "Protocols", value: "9", icon: Users },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-bg-secondary border border-border flex items-center justify-center">
                      <stat.icon size={18} className="text-accent-blue" />
                    </div>
                    <div className="font-mono text-2xl font-bold text-text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="font-body text-xs text-text-muted">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>

            {/* Category Breakdown */}
            <GlowCard>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-6">
                Score Breakdown
              </h3>
              
              <div className="space-y-4">
                {Object.entries(score.breakdown).map(([key, category]) => {
                  const maxScore = CATEGORY_MAX_SCORES[key as keyof typeof CATEGORY_MAX_SCORES];
                  const percentage = (category.score / category.maxScore) * 100;
                  
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-body text-sm font-medium text-text-primary capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-mono text-xs text-text-secondary">
                            {category.grade}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-text-primary">
                            {category.score.toFixed(0)}/{category.maxScore}
                          </span>
                          {category.trend === 'up' && (
                            <ArrowUpRight size={14} className="text-accent-green" />
                          )}
                        </div>
                      </div>
                      
                      <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor:
                              percentage >= 90
                                ? 'var(--accent-green)'
                                : percentage >= 70
                                ? 'var(--accent-blue)'
                                : percentage >= 50
                                ? 'var(--accent-amber)'
                                : 'var(--accent-red)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlowCard>

            {/* Benefits Unlocked */}
            <GlowCard glowColor="green">
              <h3 className="font-display text-xl font-semibold text-text-primary mb-6">
                Benefits Unlocked
              </h3>
              
              <div className="space-y-3">
                {score.benefitsUnlocked.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg border border-border hover:border-accent-green transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-green/20 border border-accent-green flex items-center justify-center flex-shrink-0">
                      <Award size={16} className="text-accent-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs text-accent-green uppercase tracking-wider mb-1">
                        {benefit.protocol}
                      </div>
                      <div className="font-body text-sm text-text-primary">
                        {benefit.benefit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>

          {/* Right Column - AI Analysis */}
          <div className="lg:col-span-1">
            <GlowCard className="sticky top-24 max-h-[calc(100vh-8rem)]">
              <AIAnalysisStream reasoning={score.aiReasoning} isStreaming={false} />
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
