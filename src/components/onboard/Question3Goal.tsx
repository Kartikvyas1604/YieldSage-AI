'use client';

import React, { useState } from 'react';
import { Shield, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import type { OnboardingAnswers } from '@/types/strategy';

type Goal = OnboardingAnswers['goal'];

const OPTIONS: { value: Goal; icon: React.FC<{ size: number; color: string }>; title: string; body: string }[] = [
  {
    value: 'safety',
    icon: Shield,
    title: 'Keep my money SAFE',
    body: 'Lower returns, very low risk.\nThink of it like a high-yield savings account.',
  },
  {
    value: 'growth',
    icon: TrendingUp,
    title: 'GROW my money faster',
    body: 'Higher returns, some risk.\nAI manages and protects your position.',
  },
];

interface Props {
  onNext: (goal: Goal) => void;
  onBack: () => void;
}

export function Question3Goal({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<Goal | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <p className="text-sm font-mono text-text-muted uppercase tracking-widest mb-3">Question 3 of 3</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">
            What matters most to you?
          </h1>
          <p className="text-text-secondary">AI will always keep you safe — this helps us tune your strategy.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {OPTIONS.map(({ value, icon: Icon, title, body }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className="p-7 rounded-2xl border-2 flex flex-col items-center text-center gap-4 transition-all"
              style={{
                borderColor: selected === value ? 'var(--accent-sage)' : 'var(--border)',
                background: selected === value ? 'rgba(91,140,90,0.06)' : 'var(--bg-card)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: selected === value ? 'rgba(91,140,90,0.15)' : 'var(--bg-secondary)' }}>
                <Icon size={26} color={selected === value ? 'var(--accent-sage)' : 'var(--text-muted)'} />
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-2">{title}</p>
                <p className="text-sm text-text-secondary whitespace-pre-line">{body}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onBack} className="btn-outline px-4 py-4 flex items-center gap-2">
            <ChevronLeft size={18} /> Back
          </button>
          <button
            onClick={() => selected && onNext(selected)}
            disabled={!selected}
            className="btn-sage flex-1 py-4 text-base justify-center"
          >
            See My Strategy <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
