/**
 * Score Detail Page - Deep dive into score breakdown
 */

"use client";

import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle2, Target } from "lucide-react";
import Link from "next/link";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { GlowCard } from "@/components/ui/GlowCard";
import { DEMO_CRED_SCORE } from "@/lib/data/mock";

export default function ScoreDetailPage() {
  const score = DEMO_CRED_SCORE;
  const categories = score.categories || {};

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-6">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-accent-blue hover:text-accent-blue-bright mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                Score Breakdown
              </h1>
              <p className="text-text-secondary">
                Detailed analysis of your credit score components
              </p>
            </div>
            <ScoreBadge score={score.score} size="large" />
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <GlowCard glowColor="gold" className="col-span-1">
            <div className="text-center">
              <ScoreGauge score={score.score} size="large" />
              <p className="text-sm text-text-muted mt-4">
                Updated {new Date().toLocaleDateString()}
              </p>
            </div>
          </GlowCard>

          <div className="col-span-2 grid grid-cols-2 gap-6">
            <GlowCard>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent-green" />
                <h3 className="font-semibold text-text-primary">Percentile</h3>
              </div>
              <p className="text-3xl font-mono font-bold text-accent-green mb-1">
                Top 15%
              </p>
              <p className="text-sm text-text-secondary">
                Better than 85% of wallets
              </p>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-accent-blue" />
                <h3 className="font-semibold text-text-primary">Next Milestone</h3>
              </div>
              <p className="text-3xl font-mono font-bold text-accent-blue mb-1">
                750
              </p>
              <p className="text-sm text-text-secondary">
                8 points away from EXCELLENT
              </p>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-accent-green" />
                <h3 className="font-semibold text-text-primary">Positive Factors</h3>
              </div>
              <p className="text-3xl font-mono font-bold text-text-primary mb-1">
                {score.positiveFactors.length}
              </p>
              <p className="text-sm text-text-secondary">
                Strengths identified
              </p>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-accent-red" />
                <h3 className="font-semibold text-text-primary">Risk Flags</h3>
              </div>
              <p className="text-3xl font-mono font-bold text-text-primary mb-1">
                {score.riskFlags.length}
              </p>
              <p className="text-sm text-text-secondary">
                Areas to watch
              </p>
            </GlowCard>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
            Category Scores
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(categories).map(([key, category]) => {
              const percentage = (category.score / category.maxScore) * 100;
              const categoryNames: Record<string, string> = {
                loanRepayment: "Loan Repayment",
                walletMaturity: "Wallet Maturity",
                tradingBehavior: "Trading Behavior",
                lpCommitment: "LP Commitment",
                community: "Community",
              };

              return (
                <GlowCard key={key}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text-primary">
                      {categoryNames[key] || key}
                    </h3>
                    <span className="text-sm text-text-muted">
                      {category.weight}% weight
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-mono font-bold text-accent-gold">
                        {category.score}/{category.maxScore}
                      </span>
                      <span className="text-sm font-semibold text-accent-green">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-accent-gold rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Signals */}
                  <div className="space-y-2">
                    {category.signals?.slice(0, 3).map((signal, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent-green mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{signal}</span>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </div>

        {/* Positive Factors */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
            Positive Factors
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {score.positiveFactors.map((factor, idx) => (
              <GlowCard key={idx} glowColor="green">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-green mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      {factor.factor}
                    </h4>
                    <p className="text-sm text-text-secondary">{factor.impact}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Improvement Tips */}
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
            How to Improve
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {score.improvementTips.map((tip, idx) => (
              <GlowCard key={idx} glowColor="blue">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent-blue/10">
                    <TrendingUp className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-text-primary">
                        {tip.category}
                      </h4>
                      <span className="text-sm font-mono text-accent-green">
                        +{tip.potentialGain} pts
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{tip.suggestion}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
