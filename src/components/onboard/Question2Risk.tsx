'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OPTIONS = [
  { value: 1, emoji: '😰', label: "I'd panic and withdraw everything",  hint: 'Safety first — we got you' },
  { value: 2, emoji: '😟', label: "I'd be worried and upset",            hint: 'Very conservative approach' },
  { value: 3, emoji: '😐', label: "I'd be okay, it's temporary",         hint: 'You can handle some risk' },
  { value: 4, emoji: '🙂', label: 'Fine, markets bounce back',           hint: 'Ready for smart LP strategies' },
  { value: 5, emoji: '😎', label: "No problem, I'd add more",            hint: 'Maximum yield potential' },
];

interface Props {
  onNext: (tolerance: number) => void;
  onBack: () => void;
}

export function Question2Risk({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full">
        {/* Question */}
        <div className="text-center mb-10">
          <p className="text-sm font-mono text-text-muted uppercase tracking-widest mb-3">Question 2 of 3</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Imagine your $500 dropped to $400 tomorrow.
          </h1>
          <p className="text-xl font-display text-text-secondary">How would you feel?</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className="w-full p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all"
              style={{
                borderColor: selected === opt.value ? 'var(--accent-sage)' : 'var(--border)',
                background: selected === opt.value ? 'rgba(91,140,90,0.06)' : 'var(--bg-card)',
              }}
            >
              <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-text-primary text-sm">{opt.label}</p>
              </div>
              {selected === opt.value && (
                <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                  style={{ background: 'var(--accent-sage)', color: '#fff' }}>
                  {opt.hint}
                </span>
              )}
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
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
