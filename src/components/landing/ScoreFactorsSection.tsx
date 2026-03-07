/**
 * ScoreFactors Section - Explains what's analyzed
 */

"use client";

import { TrendingUp, Clock, Target, Users, Badge } from "lucide-react";
import { GlowCard } from "../ui/GlowCard";

const SCORE_CATEGORIES = [
  {
    icon: Badge,
    title: "Loan Repayment",
    weight: "30%",
    description: "Perfect repayments, zero liquidations, low debt-to-income ratio",
    signals: [
      "Repayment rate (100% = max points)",
      "Liquidation history",
      "Debt-to-income ratio",
      "Protocol diversity",
    ],
    color: "gold" as const,
  },
  {
    icon: Clock,
    title: "Wallet Maturity",
    weight: "20%",
    description: "Long-term participation, consistent activity, stable balance",
    signals: [
      "Account age (2+ years preferred)",
      "Transaction consistency",
      "Balance stability",
      "Continuous activity",
    ],
    color: "blue" as const,
  },
  {
    icon: TrendingUp,
    title: "Trading Behavior",
    weight: "20%",
    description: "Disciplined trading, profitable returns, smart risk management",
    signals: [
      "Win rate (60%+ is excellent)",
      "Risk-adjusted returns",
      "Position sizing consistency",
      "Average hold time",
    ],
    color: "green" as const,
  },
  {
    icon: Target,
    title: "LP Commitment",
    weight: "15%",
    description: "Long-term liquidity provision, capital efficiency, IL handling",
    signals: [
      "Liquidity duration (6+ months)",
      "Impermanent loss management",
      "Capital efficiency (APR)",
      "Protocol diversity",
    ],
    color: "blue" as const,
  },
  {
    icon: Users,
    title: "Community",
    weight: "15%",
    description: "Governance participation, DAO contributions, reputation",
    signals: [
      "Governance votes cast",
      "DAO diversity",
      "Recent activity",
      "Community reputation",
    ],
    color: "gold" as const,
  },
];

export function ScoreFactorsSection() {
  return (
    <section className="py-24 px-6 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-card/50 mb-6">
            <Target className="w-4 h-4 text-accent-blue" />
            <span className="text-sm font-mono text-text-secondary">
              20 On-Chain Signals
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            What We Analyze
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Our AI examines 20 on-chain signals across 5 categories to generate your credit
            score. Every signal is transparent, verifiable, and  weighted by importance.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCORE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <GlowCard
                key={category.title}
                glowColor={category.color}
                className="group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-bg-primary/50 border border-border">
                    <Icon className={`w-6 h-6 text-accent-${category.color === "gold" ? "gold" : category.color}`} />
                  </div>
                  <span className="text-2xl font-mono font-bold text-accent-gold">
                    {category.weight}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-text-primary mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  {category.description}
                </p>

                {/* Signals List */}
                <div className="space-y-2 pt-4 border-t border-border">
                  {category.signals.map((signal, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue/50 mt-2 flex-shrink-0" />
                      <span className="text-xs text-text-secondary">
                        {signal}
                      </span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-text-muted">
            All signals are calculated from publicly available blockchain data.{" "}
            <span className="text-accent-blue">Zero PII required.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
