/**
 * Score History Page - Track score changes over time
 */

"use client";

import { ArrowLeft, TrendingUp, TrendingDown, Minus, Wallet } from "lucide-react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import type { CredScore } from "@/types/score";

interface HistoryEntry {
  date: string;
  score: number;
  change: number;
  event: string | null;
}

function buildHistory(score: CredScore): HistoryEntry[] {
  // Use the score's own history array if it has multiple entries
  if (score.history && score.history.length > 1) {
    return score.history.map((h, i, arr) => ({
      date: new Date(typeof h.date === 'number' ? h.date : Number(h.date)).toISOString(),
      score: h.score,
      change: i === 0 ? 0 : h.score - arr[i - 1].score,
      event: null,
    }));
  }
  // Only one data point — show just the current score with its real timestamp
  return [{
    date: new Date(score.timestamp ?? Date.now()).toISOString(),
    score: score.score,
    change: 0,
    event: "First analysis",
  }];
}

export default function HistoryPage() {
  const { publicKey, connected } = useWallet();
  const [score, setScore] = useState<CredScore | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("credchain_last_score");
      if (!raw) return;
      const parsed: CredScore = JSON.parse(raw);
      // Only show score for the currently connected wallet
      if (publicKey && parsed.walletAddress !== publicKey.toBase58()) return;
      setScore(parsed);
    } catch { /* ignore */ }
  }, [publicKey]);

  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen bg-bg-primary pt-20 flex items-center justify-center">
        <div className="text-center">
          <Wallet size={40} className="mx-auto mb-4 text-text-muted" />
          <p className="text-text-secondary">Connect your wallet to view score history.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-accent-blue hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="min-h-screen bg-bg-primary pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">No score analysis found for this wallet.</p>
          <Link href="/dashboard" className="btn-primary text-sm px-6 py-2">Analyze Now</Link>
        </div>
      </div>
    );
  }

  const SCORE_HISTORY = buildHistory(score);
  const latestScore = score.score;
  const oldestScore = SCORE_HISTORY[0].score;
  const totalChange = latestScore - oldestScore;
  const percentChange = oldestScore > 0 ? ((totalChange / oldestScore) * 100).toFixed(1) : "0.0";
  const positiveMonths = SCORE_HISTORY.filter(h => h.change >= 0).length;

  // Derive real milestones from breakdown
  const breakdown = score.breakdown;
  const milestones: { text: string; sub: string }[] = [];
  if (breakdown?.loanRepayment?.score === 255) milestones.push({ text: "Perfect loan repayment score", sub: "All loans repaid on time" });
  if (breakdown?.walletMaturity && breakdown.walletMaturity.score >= 100) milestones.push({ text: "Established wallet", sub: `Score: ${breakdown.walletMaturity.score}/170` });
  if (breakdown?.community && breakdown.community.score >= 60) milestones.push({ text: "Active governance participant", sub: `Community score: ${breakdown.community.score}/127` });
  if (breakdown?.lpCommitment && breakdown.lpCommitment.score >= 50) milestones.push({ text: "Committed LP provider", sub: `LP score: ${breakdown.lpCommitment.score}/128` });
  if (breakdown?.tradingBehavior && breakdown.tradingBehavior.score >= 80) milestones.push({ text: "Strong trading history", sub: `Trading score: ${breakdown.tradingBehavior.score}/170` });
  if (milestones.length === 0) milestones.push({ text: "First score established", sub: "Keep using DeFi protocols to improve" });

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
            Your real on-chain credit score for{" "}
            <span className="font-mono text-text-primary">{score.walletAddress.slice(0, 8)}…{score.walletAddress.slice(-6)}</span>
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
            <h3 className="text-text-secondary mb-2">Tier</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-mono font-bold text-text-primary">
                {score.tier}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">Current tier</p>
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
                          className="h-full bg-accent-gold rounded-full"
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
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-green mt-2" />
                  <div>
                    <p className="text-text-primary font-semibold">{m.text}</p>
                    <p className="text-sm text-text-muted">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard glowColor="blue">
            <h3 className="font-display font-bold text-text-primary mb-4">
              📈 Breakdown Scores
            </h3>
            <div className="space-y-3">
              {breakdown && Object.entries(breakdown).map(([cat, val]) => (
                <div key={cat} className="flex justify-between items-center">
                  <span className="text-text-secondary capitalize">{cat.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono font-bold text-text-primary">
                    {val.score}/{val.maxScore}
                  </span>
                </div>
              ))}
              {!breakdown && (
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Consistency</span>
                  <span className="font-mono font-bold text-text-primary">
                    {SCORE_HISTORY.length > 0
                      ? ((positiveMonths / SCORE_HISTORY.length) * 100).toFixed(0)
                      : "100"}%
                  </span>
                </div>
              )}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
