'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, ArrowRight, Zap } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';

export function ProblemSection() {
  return (
    <section className="py-32 px-4 relative overflow-hidden bg-bg-secondary">
      <div className="absolute top-0 inset-x-0 h-px bg-accent-blue" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-accent-red/30 bg-accent-red/5">
             <Zap className="w-4 h-4 text-accent-red" />
             <span className="text-xs font-mono text-accent-red uppercase tracking-wider">The Inefficiency</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-text-primary mb-6">
            The <span className="text-accent-red">Overcollateralization</span> Trap
          </h2>
          <p className="font-body text-xl text-text-secondary max-w-3xl mx-auto font-light leading-relaxed">
            DeFi protocols demand absurdly high collateral because they cannot gauge user trust. 
            Smart capital is left idle, draining market liquidity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional DeFi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="h-full rounded-2xl glass border border-border bg-bg-card/50 p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Lock size={120} />
              </div>
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center">
                  <Lock className="text-accent-red w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-medium text-text-primary">Traditional DeFi</h3>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between p-5 bg-bg-primary rounded-xl border border-border/50">
                  <span className="text-text-secondary">Collateral Required</span>
                  <span className="font-mono text-xl text-accent-red font-medium">$1,500</span>
                </div>
                <div className="flex justify-center py-2">
                  <ArrowRight className="text-text-muted rotate-90 md:rotate-0" />
                </div>
                <div className="flex items-center justify-between p-5 bg-bg-primary rounded-xl border border-border/50">
                  <span className="text-text-secondary">Borrowing Power</span>
                  <span className="font-mono text-xl text-text-primary font-medium">$1,000</span>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-accent-red/5 border border-accent-red/10 text-center relative z-10">
                <p className="text-sm text-accent-red/80 font-light">
                  <strong className="font-medium text-accent-red">50% Capital Wasted</strong> — Locked doing nothing.
                </p>
              </div>
            </div>
          </motion.div>

          {/* With CredChain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="h-full rounded-2xl glass-strong border border-accent-blue/30 bg-bg-card p-8 shadow-hard relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Unlock size={120} className="text-accent-blue" />
              </div>
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
                  <Unlock className="text-accent-blue w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-medium text-text-primary">CredChain Powered</h3>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between p-5 bg-bg-primary rounded-xl border border-border/50 shadow-inner">
                  <span className="text-text-secondary">Collateral Required</span>
                  <span className="font-mono text-xl text-accent-blue font-medium">$800</span>
                </div>
                <div className="flex justify-center py-2">
                  <ArrowRight className="text-accent-blue/50 rotate-90 md:rotate-0" />
                </div>
                <div className="flex items-center justify-between p-5 bg-bg-primary rounded-xl border border-border/50 shadow-inner">
                  <span className="text-text-secondary">Borrowing Power</span>
                  <span className="font-mono text-xl text-text-primary font-medium">$1,000</span>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-center relative z-10">
                <p className="text-sm text-accent-blue/90 font-light">
                  <strong className="font-medium text-accent-blue text-glow">Undercollateralized Lending</strong> — Trust unlocked.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
