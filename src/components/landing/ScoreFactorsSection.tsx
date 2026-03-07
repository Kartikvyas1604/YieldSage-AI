'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Users, Badge } from 'lucide-react';

const SCORE_CATEGORIES = [
  {
    icon: Badge,
    title: "Loan Repayment",
    weight: "30%",
    description: "Perfect repayments, zero liquidations, low debt-to-income ratio",
    signals: ["Repayment rate (100% = max points)", "Liquidation history", "Debt-to-income ratio"],
  },
  {
    icon: Clock,
    title: "Wallet Maturity",
    weight: "20%",
    description: "Long-term participation, consistent activity, stable balance",
    signals: ["Account age (2+ years)", "Transaction consistency", "Balance stability"],
  },
  {
    icon: TrendingUp,
    title: "Trading Behavior",
    weight: "20%",
    description: "Disciplined trading, profitable returns, smart risk management",
    signals: ["Win rate overview", "Risk-adjusted returns", "Position sizing"],
  },
  {
    icon: Target,
    title: "LP Commitment",
    weight: "15%",
    description: "Long-term liquidity provision, capital efficiency",
    signals: ["Liquidity duration", "Impermanent loss", "Capital efficiency"],
  },
  {
    icon: Users,
    title: "Community",
    weight: "15%",
    description: "Governance participation, DAO contributions, reputation",
    signals: ["Governance votes", "DAO diversity", "Community reputation"],
  },
];

export function ScoreFactorsSection() {
  return (
    <section className="py-32 px-4 bg-bg-secondary relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border-bright to-transparent" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-border-bright/50 bg-bg-primary">
            <Target className="w-4 h-4 text-text-secondary" />
            <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">
              20+ On-Chain Signals
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-text-primary mb-6">
            The Anatomy of your <span className="text-gradient">Score</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto font-light leading-relaxed">
            Our autonomous agents evaluate pure on-chain merit. No banks. No credit bureaus. Just crypto reality.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCORE_CATEGORIES.map((category, i) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <div className="rounded-2xl glass p-8 h-full border border-border hover:border-border-bright/50 transition-colors group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                      <Icon className="w-6 h-6 text-text-primary" />
                    </div>
                    <span className="text-xl font-mono text-text-secondary group-hover:text-text-primary transition-colors">
                      {category.weight}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-text-primary mb-3">
                    {category.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-8 font-light leading-relaxed h-[60px]">
                    {category.description}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-border/50">
                    {category.signals.map((signal, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-border-bright" />
                        <span className="text-xs text-text-secondary">
                          {signal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
