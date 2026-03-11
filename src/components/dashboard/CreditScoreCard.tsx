'use client';

import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { ScoreRing } from '@/components/ui/ScoreRing';
import Link from 'next/link';

interface ScoreCategory {
  label: string;
  score: number;
  max: number;
  color: string;
}

interface Props {
  score: number;
  tier: string;
  tierColor: string;
  nextTier?: string | null;
  pointsToNext?: number;
  categories?: ScoreCategory[];
}

export function CreditScoreCard({ score, tier, tierColor, nextTier, pointsToNext, categories = [] }: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(91,140,90,0.12)' }}>
            <Star size={16} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <span className="text-sm font-medium text-text-secondary">Credit Score</span>
        </div>
        <Link href="/dashboard/score"
          className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors">
          Details <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-center gap-6 mb-4">
        <ScoreRing score={score} size={90} strokeWidth={8} color={tierColor} />
        <div>
          <p className="text-2xl font-mono font-bold text-text-primary">{score}</p>
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1"
            style={{ background: tierColor + '22', color: tierColor }}>
            {tier}
          </span>
          {nextTier && pointsToNext && (
            <p className="text-xs text-text-muted mt-2">
              +{pointsToNext} pts to <span style={{ color: tierColor }}>{nextTier}</span>
            </p>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-muted">{cat.label}</span>
                <span className="font-mono" style={{ color: cat.color }}>{cat.score}/{cat.max}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(cat.score / cat.max) * 100}%`, background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
