/**
 * Score History Page - Track score changes over time
 */

"use client";

import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { DEMO_CRED_SCORE } from "@/lib/data/mock";

// Generate mock history data
const generateHistoryData = (): Array<{
  date: string;
  score: number;
  change: number;
  event: string | null;
}> => {
  const history: Array<{
    date: string;
    score: number;
    change: number;
    event: string | null;
  }> = [];
  const monthsBack = 12;
  let currentScore = 742;

  for (let i = monthsBack; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    // Gradually improve score over time (with some variance)
    const baseScore = 650 + (monthsBack - i) * 7;
    const variance = Math.floor(Math.random() * 20) - 10;
    currentScore = Math.min(850, Math.max(550, baseScore + variance));

    history.push({
      date: date.toISOString(),
      score: currentScore,
      change: i === monthsBack ? 0 : history[history.length - 1] ? currentScore - history[history.length - 1].score : 0,
      event: i === 3 ? "Repaid loan on Marginfi" : i === 7 ? "30-day LP streak" : null,
    });
  }

  return history;
};

const SCORE_HISTORY = generateHistoryData();

export default function HistoryPage() {
  const latestScore = DEMO_CRED_SCORE.score;
  const oldestScore = SCORE_HISTORY[0].score;
  const totalChange = latestScore - oldestScore;
  const percentChange = ((totalChange / oldestScore) * 100).toFixed(1);

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

          <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
            Score History
          </h1>
          <p className="text-text-secondary">
            Track your credit score evolution over the past 12 months
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <GlowCard glowColor="gold">
            <h3 className="text-text-secondary mb-2">Current Score</h3>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={latestScore}
                className="text-4xl font-mono font-bold text-accent-gold"
              />
              <span className="text-text-muted">/850</span>
            </div>
          </GlowCard>

          <GlowCard>
            <h3 className="text-text-secondary mb-2">All-Time Change</h3>
            <div className="flex items-center gap-2">
              <span
                className={`text-4xl font-mono font-bold ${
                  totalChange > 0 ? "text-accent-green" : totalChange < 0 ? "text-accent-red" : "text-text-primary"
                }`}
              >
                {totalChange > 0 ? "+" : ""}
                {totalChange}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">
              {percentChange}% growth
            </p>
          </GlowCard>

          <GlowCard>
            <h3 className="text-text-secondary mb-2">Best Score</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-mono font-bold text-text-primary">
                {Math.max(...SCORE_HISTORY.map((h) => h.score))}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">All-time high</p>
          </GlowCard>

          <GlowCard>
            <h3 className="text-text-secondary mb-2">Starting Score</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-mono font-bold text-text-primary">
                {oldestScore}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">12 months ago</p>
          </GlowCard>
        </div>

        {/* Timeline */}
        <GlowCard className="mb-12">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
            Score Timeline
          </h2>

          <div className="space-y-4">
            {SCORE_HISTORY.slice().reverse().map((entry, idx) => {
              const change = entry.change;
              const isPositive = change > 0;
              const isNegative = change < 0;
              const isNeutral = change === 0;

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-border-bright bg-bg-card/50 hover:bg-bg-card transition-all"
                >
                  {/* Date */}
                  <div className="w-32 flex-shrink-0">
                    <p className="font-mono text-sm text-text-primary">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Score Bar */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl font-mono font-bold text-text-primary min-w-[80px]">
                        {entry.score}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent-blue to-accent-gold rounded-full"
                          style={{ width: `${(entry.score / 850) * 100}%` }}
                        />
                      </div>
                    </div>
                    {entry.event && (
                      <p className="text-sm text-accent-blue">{entry.event}</p>
                    )}
                  </div>

                  {/* Change Indicator */}
                  <div className="w-24 flex items-center justify-end gap-2">
                    {isPositive && (
                      <>
                        <TrendingUp className="w-4 h-4 text-accent-green" />
                        <span className="font-mono font-semibold text-accent-green">
                          +{change}
                        </span>
                      </>
                    )}
                    {isNegative && (
                      <>
                        <TrendingDown className="w-4 h-4 text-accent-red" />
                        <span className="font-mono font-semibold text-accent-red">
                          {change}
                        </span>
                      </>
                    )}
                    {isNeutral && (
                      <>
                        <Minus className="w-4 h-4 text-text-muted" />
                        <span className="font-mono font-semibold text-text-muted">
                          0
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlowCard>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlowCard glowColor="green">
            <h3 className="font-display font-bold text-text-primary mb-4">
              🎉 Key Milestones
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-green mt-2" />
                <div>
                  <p className="text-text-primary font-semibold">
                    Crossed 700 threshold
                  </p>
                  <p className="text-sm text-text-muted">3 months ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-green mt-2" />
                <div>
                  <p className="text-text-primary font-semibold">
                    Perfect 90-day repayment streak
                  </p>
                  <p className="text-sm text-text-muted">2 months ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-green mt-2" />
                <div>
                  <p className="text-text-primary font-semibold">
                    Entered GOOD tier
                  </p>
                  <p className="text-sm text-text-muted">5 months ago</p>
                </div>
              </div>
            </div>
          </GlowCard>

          <GlowCard glowColor="blue">
            <h3 className="font-display font-bold text-text-primary mb-4">
              📈 Growth Insights
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Avg monthly gain</span>
                <span className="font-mono font-bold text-accent-green">
                  +{(totalChange / 12).toFixed(1)} pts
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Best month</span>
                <span className="font-mono font-bold text-text-primary">
                  +{Math.max(...SCORE_HISTORY.map((h) => h.change))} pts
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Consistency</span>
                <span className="font-mono font-bold text-text-primary">
                  {(
                    (SCORE_HISTORY.filter((h) => h.change >= 0).length / SCORE_HISTORY.length) *
                    100
                  ).toFixed(0)}
                  %
                </span>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
