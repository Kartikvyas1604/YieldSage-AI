'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-12 border border-accent-gold"
        >
          <Sparkles size={48} className="text-accent-gold mx-auto mb-6" />
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Your wallet has a story.
            <br />
            <span className="text-gradient-gold">Let AI tell it.</span>
          </h2>

          <p className="font-body text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Join the future of trustless credit. Prove your on-chain reputation.
            Unlock undercollateralized lending.
          </p>

          <button className="group px-10 py-5 bg-accent-gold rounded-lg font-body font-semibold text-bg-primary text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto">
            Check My Credit Score
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-8 flex items-center justify-center gap-2 text-text-muted text-sm">
            <span>✓ Read-only access</span>
            <span>•</span>
            <span>✓ Never touches your funds</span>
            <span>•</span>
            <span>✓ Free demo available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
