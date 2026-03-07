'use client';

import React from 'react';
import { getScoreColor, getScoreTier, SCORE_TIER_CONFIG } from '@/types/score';

interface ScoreBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showScore?: boolean;
}

export function ScoreBadge({ score, size = 'medium', showScore = true }: ScoreBadgeProps) {
  const tier = getScoreTier(score);
  const color = getScoreColor(score);
  const config = SCORE_TIER_CONFIG[tier];

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full font-mono font-semibold
        uppercase tracking-wider border
        ${sizeClasses[size]}
      `}
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
        color: color,
      }}
    >
      {showScore && <span>{score}</span>}
      <span>{config.label}</span>
    </div>
  );
}
