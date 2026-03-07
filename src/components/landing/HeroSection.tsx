'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-16 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-bg-primary overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-accent-gold/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full glass border-border-bright/30">
          <Sparkles className="w-4 h-4 text-accent-gold" />
          <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">Next-Gen Credit Protocol</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-center space-y-6 mb-12">
          <h1 className="font-display text-5xl md:text-7xl lg:text-[80px] leading-[1.1] tracking-tight font-semibold text-text-primary">
            The Credit Standard <br className="hidden md:block"/>
            <span className="text-gradient">for Web3</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
            Unlock maximum capital efficiency with AI-driven on-chain reputation. Zero PII, fully composable, and instantly verifiable.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col sm:flex-row items-center gap-4">
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-text-primary text-bg-primary rounded-full font-medium transition-all hover:scale-105">
            Connect Wallet <ArrowRight className="w-4 h-4 text-bg-primary group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="inline-flex items-center gap-2 px-8 py-4 glass text-text-primary rounded-full font-medium hover:bg-white/5 transition-colors">
            <Shield className="w-4 h-4" /> View Docs
          </button>
        </motion.div>
        
        {/* Mock Graphic */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="w-full mt-24 relative max-w-4xl">
          <div className="absolute -inset-1 bg-gradient-to-b from-accent-blue/20 to-transparent rounded-2xl blur-xl opacity-50" />
          <div className="relative w-full aspect-[21/9] rounded-xl glass-strong border border-border-bright/50 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="h-10 border-b border-border/50 flex items-center px-4 gap-2 bg-black/40">
              <div className="w-3 h-3 rounded-full bg-border-bright" />
              <div className="w-3 h-3 rounded-full bg-border-bright" />
              <div className="w-3 h-3 rounded-full bg-border-bright" />
            </div>
            <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden bg-bg-secondary">
               <div className="absolute inset-0 flex flex-col justify-center gap-px opacity-5">
                 {Array.from({length: 20}).map((_, i) => <div key={i} className="w-full h-8 bg-white" />)}
               </div>
               <div className="z-10 text-center space-y-4">
                   <div className="w-32 h-32 rounded-full border-[3px] border-accent-blue/30 mx-auto flex items-center justify-center relative bg-bg-primary/50 backdrop-blur-md">
                     <div className="absolute inset-0 rounded-full border-[3px] border-accent-blue border-t-transparent animate-spin duration-3000" />
                     <span className="font-display text-4xl text-gradient-blue font-semibold">742</span>
                   </div>
                   <div className="font-mono text-sm text-text-secondary uppercase tracking-widest">Global Credit Score</div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
