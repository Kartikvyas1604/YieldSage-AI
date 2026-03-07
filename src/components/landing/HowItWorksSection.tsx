'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Brain, Award, Sparkles } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';

export function HowItWorksSection() {
  const steps = [
    {
      icon: Wallet,
      title: "1. Connect Wallet",
      description: "Simply connect your Solana wallet. Read-only access — we never touch your funds.",
      color: "var(--accent-blue)",
      delay: 0.2,
    },
    {
      icon: Brain,
      title: "2. AI Scans History",
      description: "Claude AI reads your entire on-chain history: loans, trades, LP positions, governance votes.",
      color: "var(--accent-gold)",
      delay: 0.4,
    },
    {
      icon: Award,
      title: "3. Score Generated",
      description: "Receive your credit score from 0-850 with detailed breakdown and AI reasoning.",
      color: "var(--accent-green)",
      delay: 0.6,
    },
    {
      icon: Sparkles,
      title: "4. Benefits Unlocked",
      description: "Use your score to access better rates, lower collateral requirements, and exclusive protocols.",
      color: "var(--accent-gold-bright)",
      delay: 0.8,
    },
  ];

  return (
    <section className="py-20 px-4 bg-bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary mb-6">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="font-body text-xl text-text-secondary max-w-3xl mx-auto">
            Four simple steps to unlock your on-chain credit identity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: step.delay }}
            >
              <GlowCard className="h-full text-center" hover={true}>
                {/* Icon */}
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${step.color}20`,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: step.color,
                  }}
                >
                  <step.icon size={32} style={{ color: step.color }} />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-semibold text-text-primary mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-body text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Timeline connector (desktop only) */}
        <div className="hidden lg:block relative -mt-44 mb-44">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-blue via-accent-gold to-accent-green opacity-30" />
        </div>
      </div>
    </section>
  );
}
