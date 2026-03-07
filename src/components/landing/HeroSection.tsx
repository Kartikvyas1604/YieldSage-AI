'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

export function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  
  const sampleScores = [812, 701, 589];

  return (
    <section className="relative min-h-[110vh] flex flex-col items-center justify-center overflow-hidden py-32 px-4 selection:bg-accent-gold/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#050810]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(60,20,100,0.1),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-accent-blue/5 to-transparent blur-3xl opacity-30" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-6 py-2 mb-10 rounded-full glass border border-accent-gold/20 shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-shadow duration-500"
        >
          <Sparkles size={14} className="text-accent-gold animate-pulse" />
          <span className="font-mono text-xs tracking-[0.2em] text-accent-gold font-bold uppercase">
            World&apos;s First On-Chain Credit Intelligence
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-7xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-8 leading-[0.9] tracking-tight"
        >
          Trust. <span className="text-gradient-gold">Verified.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="font-body text-xl md:text-2xl text-text-secondary/80 mb-16 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Unlock undercollateralized lending through AI-powered on-chain analysis.
          <br className="hidden md:block" />
          Turn your transaction history into your most valuable asset.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
        >
          <button className="group relative px-10 py-5 bg-gradient-to-b from-white to-gray-200 rounded-2xl font-body font-bold text-bg-primary text-lg shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
            <span className="relative z-10 flex items-center gap-3">
              Check My Score
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
          
          <button className="group px-10 py-5 glass rounded-2xl font-body font-semibold text-text-primary text-lg hover:bg-white/5 transition-all duration-300 border border-white/10 flex items-center gap-3">
            <Zap size={20} className="text-accent-gold group-hover:scale-110 transition-transform" />
            How It Works
          </button>
        </motion.div>

        {/* Features Grid - Improved Visuals */}
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-20"
        >
          {[
            {
              icon: Shield,
              title: "Institutional Grade",
              desc: "Bank-level security standards for on-chain data analysis.",
              color: "text-accent-blue",
              delay: 0,
            },
            {
              icon: TrendingUp,
              title: "Real-time Scoring",
              desc: "Dynamic credit updates based on live market behavior.",
              color: "text-accent-green",
              delay: 0.1,
            },
            {
              icon: Sparkles,
              title: "AI Powered",
              desc: "Deep learning models trained on millions of wallets.",
              color: "text-accent-gold",
              delay: 0.2,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 rounded-3xl text-left hover:border-white/10 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors ${feature.color}`}>
                <feature.icon size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute top-1/3 right-[10%] w-64 h-64 glass-strong rounded-full blur-3xl opacity-20 pointer-events-none" 
      />
    </section>
  );
}
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
