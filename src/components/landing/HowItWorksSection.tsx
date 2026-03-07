'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Brain, Award, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: "Link Wallet",
    description: "Connect securely. Read-only permissions. Zero risk to funds.",
    color: "blue",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Deep-scanning of transaction history, DeFi interactions, and protocol governance.",
    color: "gold",
  },
  {
    icon: Award,
    title: "Credit Scoring",
    description: "Algorithmic trust score assigned based on quantifiable on-chain merit.",
    color: "green",
  },
  {
    icon: Sparkles,
    title: "Unlock utility",
    description: "Access lower collateral constraints and prime yield opportunities.",
    color: "blue",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-32 px-4 bg-bg-primary relative border-t border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-text-primary mb-6">
            Four Steps to <span className="text-gradient">Reputation</span>
          </h2>
          <p className="font-body text-xl text-text-secondary max-w-2xl mx-auto font-light">
            Seamless integration with your existing Web3 identity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-border-bright to-transparent z-0" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative z-10"
              >
                <div className="flex flex-col items-center text-center p-6 rounded-2xl glass hover:bg-white/[0.02] transition-colors h-full border border-border/30 hover:border-border-bright/50">
                  <div className={`w-20 h-20 mb-8 rounded-2xl flex items-center justify-center bg-bg-primary border border-border shadow-xl relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-40 transition-opacity from-accent-blue/40 to-transparent" />
                    <Icon className={`w-8 h-8 text-text-primary relative z-10`} />
                  </div>
                  
                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-border-bright text-xs font-mono mb-4 text-text-secondary">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-medium text-text-primary mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-text-secondary leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
