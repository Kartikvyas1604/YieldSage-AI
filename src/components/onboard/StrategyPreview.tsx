'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Shield, Zap, Leaf, ArrowRight } from 'lucide-react';
import { STRATEGIES, estimateEarnings } from '@/lib/agent/strategies';
import type { OnboardingAnswers } from '@/types/strategy';

function chooseStrategy(answers: OnboardingAnswers): string {
  if (answers.goal === 'safety') return 'CONSERVATIVE';
  if (answers.lossTolerance <= 2) return 'CONSERVATIVE';
  if (answers.lossTolerance <= 3 && answers.goal === 'growth') return 'BALANCED';
  return 'BALANCED'; // default safe choice — user upgrades via $SAGE
}

interface Props {
  answers: OnboardingAnswers;
  capital?: number;
  onDeploy: (strategyId: string) => void;
  onBack?: () => void;
}

export function StrategyPreview({ answers, capital = 1000, onDeploy, onBack }: Props) {
  const key = chooseStrategy(answers);
  const strategy = STRATEGIES[key];
  const midAPY = (strategy.targetAPY.min + strategy.targetAPY.max) / 2;
  const earnings = estimateEarnings(capital, midAPY);

  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const riskColors = ['', '#22c55e', '#86efac', '#f59e0b', '#f97316', '#ef4444'];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16">
      <div
        className="max-w-lg w-full transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
      >
        {/* Header badge */}
        <div className="flex justify-center mb-8">
          <span className="px-4 py-2 rounded-full text-sm font-mono font-medium"
            style={{ background: 'rgba(91,140,90,0.12)', color: 'var(--accent-sage)' }}>
            <CheckCircle size={14} style={{ display: 'inline', marginRight: 6 }} />
            Perfect match for you
          </span>
        </div>

        {/* Strategy title */}
        <div className="text-center mb-8">
          <p className="text-5xl mb-3">{strategy.emoji}</p>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">{strategy.name}</h1>
          <p className="text-text-secondary">{strategy.plainEnglish}</p>
        </div>

        {/* Earnings estimates */}
        <div className="card p-6 mb-5">
          <p className="text-sm text-text-muted mb-4 font-mono uppercase tracking-widest">
            Estimated Earnings on ${capital.toLocaleString()}
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {([
              ['Monthly', earnings.monthly],
              ['Yearly', earnings.yearly],
              ['APY Range', `${strategy.targetAPY.min}–${strategy.targetAPY.max}%`],
            ] as const).map(([label, value]) => (
              <div key={label}>
                <p className="text-2xl font-mono font-bold" style={{ color: 'var(--accent-sage)' }}>
                  {label === 'APY Range' ? value : `$${value}`}
                </p>
                <p className="text-xs text-text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol + Risk */}
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs text-text-muted mb-1">Protocol</p>
              <p className="font-medium text-text-primary">{strategy.protocols[0]}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Risk level</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{
                    background: i <= strategy.riskLevel ? riskColors[strategy.riskLevel] : 'var(--border)'
                  }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Rebalancing</p>
              <p className="font-medium text-text-primary capitalize">{strategy.rebalanceFrequency}</p>
            </div>
          </div>
        </div>

        {/* Safety guardrails */}
        <div className="rounded-xl p-5 mb-8 flex flex-col gap-2"
          style={{ background: 'rgba(91,140,90,0.06)', border: '1px solid rgba(91,140,90,0.15)' }}>
          <p className="text-xs font-mono text-text-muted mb-1 uppercase tracking-widest">Safety guardrails</p>
          {[
            { icon: Shield, text: 'AI monitors your position every 30 minutes' },
            { icon: Zap, text: 'Auto-exits if risk threshold is breached' },
            { icon: Leaf, text: 'You can pause or withdraw anytime' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-text-secondary">
              <Icon size={15} style={{ color: 'var(--accent-sage)', flexShrink: 0 }} />
              {text}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onDeploy(strategy.id)}
          className="btn-sage w-full py-4 text-base justify-center"
        >
          Deploy My Strategy <ArrowRight size={18} />
        </button>
        <p className="text-center text-xs text-text-muted mt-3">
          Read-only access · you keep full custody of your funds
        </p>
      </div>
    </div>
  );
}
