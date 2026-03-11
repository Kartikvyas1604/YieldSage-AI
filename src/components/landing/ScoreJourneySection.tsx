'use client';

import React from 'react';
import { SCORE_TIERS } from '@/lib/utils/constants';

const JOURNEY = [
  { tier: 'NEW',       range: '0–299',   strategy: 'Stable Yield (Kamino)', color: '#a09db8', weeks: 'Start' },
  { tier: 'BUILDING',  range: '300–499', strategy: 'Stable Yield',          color: '#e8a43a', weeks: '2–4 wks' },
  { tier: 'FAIR',      range: '500–649', strategy: 'Smart LP (Meteora)',     color: '#5b8c5a', weeks: '4–8 wks' },
  { tier: 'GOOD',      range: '650–749', strategy: 'Turbo Yield',            color: '#4caf7d', weeks: '3–6 mo' },
  { tier: 'EXCELLENT', range: '750–850', strategy: 'All + Priority Access',  color: '#d4a843', weeks: '6–12 mo' },
];

export function ScoreJourneySection() {
  return (
    <section className="py-24 px-6 dark-section">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-mono uppercase tracking-widest mb-3 opacity-50">Credit Score Journey</p>
        <h2 className="font-display text-4xl font-bold mb-4" style={{ color: '#f0ede8' }}>
          The Longer You Stay, The Better Your Returns
        </h2>
        <p className="mb-16 text-lg opacity-70">
          Your credit score grows with every day your funds are deployed. More trust = better strategies.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div className="absolute top-8 left-0 right-0 h-px opacity-20 hidden md:block"
            style={{ background: '#f0ede8' }} />

          <div className="grid md:grid-cols-5 gap-6">
            {JOURNEY.map((j, i) => (
              <div key={j.tier} className="flex flex-col items-center gap-3">
                {/* Dot */}
                <div
                  className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-mono font-bold text-sm relative z-10"
                  style={{ borderColor: j.color, color: j.color, background: '#0f1117' }}
                >
                  {j.range.split('–')[0]}
                </div>
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: j.color }}
                >
                  {j.tier}
                </div>
                <div className="text-center">
                  <p className="text-xs opacity-60 mb-1">{j.range} pts</p>
                  <p className="text-xs opacity-80 font-semibold">{j.strategy}</p>
                  <p className="text-xs opacity-50 mt-1">{j.weeks}</p>
                </div>
                {i < JOURNEY.length - 1 && (
                  <div className="hidden flex-1 text-center opacity-30 text-lg">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
