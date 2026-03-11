'use client';

import React, { useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';

const OPTIONS = [
  { months: 3,  label: '3 months',  hint: 'Perfect for Conservative strategy', emoji: '🏦' },
  { months: 6,  label: '6 months',  hint: 'Comfortable with Stable Yield',     emoji: '📈' },
  { months: 12, label: '1 year',    hint: 'You qualify for Smart LP returns',   emoji: '⚖️' },
  { months: 24, label: '2+ years',  hint: 'Best returns available to you',      emoji: '🚀' },
];

interface Props { onNext: (months: number) => void; }

export function Question1Duration({ onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 mx-auto"
          style={{ background: 'rgba(91,140,90,0.1)' }}>
          <Clock size={26} style={{ color: 'var(--accent-sage)' }} />
        </div>

        {/* Question */}
        <div className="text-center mb-10">
          <p className="text-sm font-mono text-text-muted uppercase tracking-widest mb-3">Question 1 of 3</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">
            How long can you leave your money here?
          </h1>
          <p className="text-text-secondary">
            You can always withdraw early — we just want to pick the best strategy for your timeline.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {OPTIONS.map(opt => (
            <button
              key={opt.months}
              onClick={() => setSelected(opt.months)}
              className="p-5 rounded-xl border-2 text-left transition-all"
              style={{
                borderColor: selected === opt.months ? 'var(--accent-sage)' : 'var(--border)',
                background: selected === opt.months ? 'rgba(91,140,90,0.06)' : 'var(--bg-card)',
              }}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <div className="font-semibold text-text-primary mb-1">{opt.label}</div>
              <div
                className="text-xs"
                style={{ color: selected === opt.months ? 'var(--accent-sage)' : 'var(--text-muted)' }}
              >
                {opt.hint}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="btn-sage w-full py-4 text-base justify-center"
        >
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
