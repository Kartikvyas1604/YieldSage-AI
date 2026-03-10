/**
 * Score Detail Page - Deep dive into score breakdown
 * Reads real score from localStorage (set by dashboard after live analysis)
 */

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle2, Target, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { GlowCard } from "@/components/ui/GlowCard";
import type { CredScore } from "@/types/score";
import { CATEGORY_WEIGHTS } from "@/types/score";

function getPercentile(score: number): { text: string; sub: string } {
  if (score >= 750) return { text: "Top 5%",    sub: "Better than 95% of wallets" };
  if (score >= 650) return { text: "Top 15%",   sub: "Better than 85% of wallets" };
  if (score >= 500) return { text: "Top 40%",   sub: "Better than 60% of wallets" };
  if (score >= 350) return { text: "Top 70%",   sub: "Better than 30% of wallets" };
  return             { text: "Bottom 30%", sub: "Significant room to grow" };
}

function getNextMilestone(score: number): { target: number; label: string; pointsAway: number } {
  if (score < 350) return { target: 350, label: "POOR",      pointsAway: 350 - score };
  if (score < 500) return { target: 500, label: "FAIR",      pointsAway: 500 - score };
  if (score < 650) return { target: 650, label: "GOOD",      pointsAway: 650 - score };
  if (score < 750) return { target: 750, label: "EXCELLENT", pointsAway: 750 - score };
  return            { target: 850, label: "MAX",       pointsAway: 850 - score };
}

const CATEGORY_NAMES: Record<string, string> = {
  loanRepayment:   "Loan Repayment",
  walletMaturity:  "Wallet Maturity",
  tradingBehavior: "Trading Behavior",
  lpCommitment:    "LP Commitment",
  community:       "Community",
};

export default function ScoreDetailPage() {
  const [score, setScore] = useState<CredScore | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("credchain_last_score");
      if (raw) setScore(JSON.parse(raw) as CredScore);
    } catch { /* ignore parse errors */ }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!score) {
    return (
      <div className="min-h-screen bg-bg-primary pt-20 flex items-center justify-center px-6">
        <div className="max-w-sm mx-auto text-center">
          <p className="text-text-muted font-mono text-xs uppercase tracking-wider mb-4">
            No score available
          </p>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
            Run an Analysis First
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">
            Connect your wallet on the dashboard to generate your real on-chain credit score.
          </p>
          <Link href="/dashboard" className="btn-primary text-sm px-8 py-3 inline-flex items-center gap-2">
            <RefreshCw size={14} /> Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const categories = score.breakdown ?? score.categories ?? {};
  const percentile = getPercentile(score.score);
  const milestone  = getNextMilestone(score.score);
  const updatedAt  = score.timestamp
    ? new Date(score.timestamp).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-6">
      <div className="max-w-7xl mx-auto py-12">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                Score Breakdown
              </h1>
              <p className="text-text-secondary font-mono text-sm">
                {score.walletAddress.slice(0, 8)}…{score.walletAddress.slice(-6)}
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
              <p className="text-sm text-text-muted mt-4">Updated {updatedAt}</p>
            </div>
          </GlowCard>

          <div className="col-span-2 grid grid-cols-2 gap-6">
            <GlowCard>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent-green" />
                <h3 className="font-semibold text-text-primary">Percentile</h3>
              </div>
              <p className="text-3xl font-mono font-bold text-accent-green mb-1">
                {percentile.text}
              </p>
              <p className="text-sm text-text-secondary">{percentile.sub}</p>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-accent-blue" />
                <h3 className="font-semibold text-text-primary">Next Milestone</h3>
              </div>
              <p className="text-3xl font-mono font-bold text-accent-blue mb-1">
                {milestone.target}
              </p>
              <p className="text-sm text-text-secondary">
                {milestone.pointsAway} pts away from {milestone.label}
              </p>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-accent-green" />
                <h3 className="font-semibold text-text-primary">Improvement Tips</h3>
              </div>
              <p className="text-3xl font-mono font-bold text-text-primary mb-1">
                {score.improvementTips?.length ?? 0}
              </p>
              <p className="text-sm text-text-secondary">Actionable suggestions</p>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-accent-red" />
                <h3 className="font-semibold text-text-primary">Risk Flags</h3>
              </div>
              <p className="text-3xl font-mono font-bold text-text-primary mb-1">
                {score.riskFlags?.length ?? 0}
              </p>
              <p className="text-sm text-text-secondary">
                {score.riskFlags?.length === 0 ? 'Clean — no issues detected' : 'Areas to watch'}
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
              const percentage = Math.min(100, (category.score / category.maxScore) * 100);
              const weight     = CATEGORY_WEIGHTS[key as keyof typeof CATEGORY_WEIGHTS];
              const reasoning  = (category as Record<string, unknown>).reasoning as string | undefined;

              return (
                <GlowCard key={key}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text-primary">
                      {CATEGORY_NAMES[key] || key}
                    </h3>
                    <div className="flex items-center gap-2">
                      {category.grade && (
                        <span className="text-xs font-mono font-bold text-text-primary border border-border px-2 py-0.5 rounded">
                          {category.grade}
                        </span>
                      )}
                      {weight && (
                        <span className="text-sm text-text-muted">
                          {Math.round(weight * 100)}% weight
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-mono font-bold text-text-primary">
                        {Math.round(category.score)}/{category.maxScore}
                      </span>
                      <span className="text-sm font-semibold text-text-secondary">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-text-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* AI reasoning */}
                  {(reasoning || category.signals?.length) && (
                    <div className="space-y-1 mt-3">
                      {reasoning && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                          <span className="text-sm text-text-secondary">{reasoning}</span>
                        </div>
                      )}
                      {category.signals?.slice(0, 2).map((signal, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                          <span className="text-sm text-text-secondary">{signal}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </GlowCard>
              );
            })}
          </div>
        </div>

        {/* Risk Flags */}
        {(score.riskFlags?.length ?? 0) > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
              Risk Flags
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {score.riskFlags.map((flag, idx) => {
                const severityColor =
                  flag.severity === 'critical' ? 'text-red-500' :
                  flag.severity === 'high'     ? 'text-accent-red' :
                  flag.severity === 'medium'   ? 'text-accent-gold' :
                  'text-text-muted';
                return (
                  <GlowCard key={idx}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-1 shrink-0 ${severityColor}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-text-primary">{flag.type}</h4>
                          <span className="text-xs font-mono uppercase px-1.5 py-0.5 rounded border border-border text-text-muted">
                            {flag.severity}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{flag.description}</p>
                      </div>
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Improvement Tips */}
        {(score.improvementTips?.length ?? 0) > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
              How to Improve
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {score.improvementTips.map((tip, idx) => (
                <GlowCard key={idx}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg border border-border shrink-0">
                      <TrendingUp className="w-5 h-5 text-text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-text-primary">{tip.category}</h4>
                        <span className="text-sm font-mono text-text-secondary">
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
        )}

      </div>
    </div>
  );
}
