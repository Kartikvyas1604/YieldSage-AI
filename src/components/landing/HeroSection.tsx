'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { ScoreBadge } from '@/components/ui/ScoreBadge';

export function HeroSection() {
  const sampleScores = [812, 701, 589];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,125,216,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(201,168,76,0.1),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-accent-gold-bright"
        >
          <Sparkles size={16} className="text-accent-gold-bright" />
          <span className="font-mono text-sm text-accent-gold-bright">
            World&apos;s First On-Chain Credit Score on Solana
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-text-primary mb-6"
        >
          Your On-Chain History.
          <br />
          <span className="text-gradient-gold">Your Financial Identity.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-body text-xl md:text-2xl text-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          The world&apos;s first AI credit score on Solana. Prove your trustworthiness.
          Unlock undercollateralized lending.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <button className="group px-8 py-4 bg-gradient-to-r from-accent-gold to-accent-gold-bright rounded-lg font-body font-semibold text-bg-primary text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
            Check My Score
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-8 py-4 glass border border-accent-blue rounded-lg font-body font-semibold text-text-primary text-lg hover:border-accent-blue-bright hover:bg-bg-card-hover transition-all">
            How It Works
          </button>
        </motion.div>

        {/* Sample score animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-8"
        >
          <div className="glass-strong rounded-2xl p-8 hover:scale-105 transition-transform">
            <div className="font-display text-5xl font-bold text-gradient-gold mb-2">
              <AnimatedNumber value={742} duration={3000} />
            </div>
            <div className="font-mono text-sm text-text-secondary uppercase tracking-wider">
              Sample Score
            </div>
          </div>

          {/* Floating score badges */}
          <div className="hidden lg:flex flex-col gap-4">
            {sampleScores.map((score, i) => (
              <motion.div
                key={score}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.2 }}
                className="animate-float"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <ScoreBadge score={score} size="medium" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-12 flex items-center justify-center gap-2 text-text-muted text-sm"
        >
          <Shield size={16} />
          <span>Read-only access. Never touches your funds.</span>
        </motion.div>
      </div>
    </section>
  );
}
