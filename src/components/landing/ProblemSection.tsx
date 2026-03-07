'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, ArrowRight } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';

export function ProblemSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary mb-6">
            The <span className="text-accent-red">$50 Trillion</span> Problem
          </h2>
          <p className="font-body text-xl text-text-secondary max-w-3xl mx-auto">
            Every DeFi lending protocol today requires massive overcollateralization
            because there is zero credit history on-chain
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional DeFi */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlowCard glowColor="red" className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-accent-red/20 border border-accent-red flex items-center justify-center">
                  <Lock size={24} className="text-accent-red" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-text-primary">
                  Traditional DeFi
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                  <span className="font-mono text-text-secondary">Collateral</span>
                  <span className="font-mono text-xl font-bold text-accent-red">$1,500</span>
                </div>

                <ArrowRight size={24} className="text-text-muted mx-auto" />

                <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                  <span className="font-mono text-text-secondary">Can Borrow</span>
                  <span className="font-mono text-xl font-bold text-text-primary">$1,000</span>
                </div>

                <div className="p-4 bg-accent-red/10 border border-accent-red rounded-lg">
                  <p className="font-body text-sm text-accent-red">
                    <strong>$500 wasted</strong> — locked up for no reason
                  </p>
                </div>
              </div>

              <div className="mt-6 font-mono text-sm text-text-muted">
                150% collateralization = 50% of capital wasted
              </div>
            </GlowCard>
          </motion.div>

          {/* With CredChain */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlowCard glowColor="green" className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-accent-green/20 border border-accent-green flex items-center justify-center">
                  <Unlock size={24} className="text-accent-green" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-text-primary">
                  With CredChain
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                  <span className="font-mono text-text-secondary">Collateral</span>
                  <span className="font-mono text-xl font-bold text-accent-green">$800</span>
                </div>

                <ArrowRight size={24} className="text-text-muted mx-auto" />

                <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                  <span className="font-mono text-text-secondary">Can Borrow</span>
                  <span className="font-mono text-xl font-bold text-text-primary">$1,000</span>
                </div>

                <div className="p-4 bg-accent-green/10 border border-accent-green rounded-lg">
                  <p className="font-body text-sm text-accent-green">
                    <strong>$200 saved</strong> — unlocked by trust
                  </p>
                </div>
              </div>

              <div className="mt-6 font-mono text-sm text-text-secondary">
                80% collateralization = more efficient capital usage
              </div>
            </GlowCard>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {[
            { label: "Locked in Collateral", value: "$50T+" },
            { label: "DeFi Users", value: "400M+" },
            { label: "Solana TVL", value: "$50B+" },
            { label: "Capital Wasted", value: "50%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-accent-gold mb-2">
                {stat.value}
              </div>
              <div className="font-body text-sm text-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
