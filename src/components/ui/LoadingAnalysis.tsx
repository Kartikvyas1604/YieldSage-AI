'use client';

import React from 'react';
import { Brain, Database, Shield, TrendingUp } from 'lucide-react';

export function LoadingAnalysis() {
  const steps = [
    { icon: Database, label: 'Gathering on-chain data', delay: '0s' },
    { icon: Shield, label: 'Detecting risk patterns', delay: '0.3s' },
    { icon: TrendingUp, label: 'Analyzing behavior', delay: '0.6s' },
    { icon: Brain, label: 'Computing credit score', delay: '0.9s' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Main AI brain icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-accent-gold rounded-full blur-xl opacity-20 animate-pulse" />
        <Brain size={64} className="text-accent-gold relative animate-float" />
      </div>

      {/* Loading text */}
      <h3 className="font-display text-2xl font-semibold text-text-primary mb-2">
        AI is analyzing your wallet...
      </h3>
      <p className="font-body text-text-secondary mb-8">
        This may take a moment. We&apos;re reading your entire on-chain history.
      </p>

      {/* Progress steps */}
      <div className="space-y-4 w-full max-w-md">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-4 opacity-0 animate-fade-in"
            style={{
              animationDelay: step.delay,
              animationFillMode: 'forwards',
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-bg-card border border-border flex items-center justify-center">
              <step.icon size={20} className="text-accent-blue animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm text-text-secondary">{step.label}</p>
              <div className="mt-1 h-1 bg-bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-blue animate-shimmer"
                  style={{
                    width: '60%',
                    background: 'linear-gradient(90deg, transparent, var(--accent-blue), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust indicator */}
      <div className="mt-8 flex items-center gap-2 text-text-muted text-sm">
        <Shield size={16} />
        <span>Read-only access. Never touches your funds.</span>
      </div>
    </div>
  );
}
