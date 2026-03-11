'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  animated?: boolean;
  showLabel?: boolean;
  tierLabel?: string;
}

export function ScoreRing({
  score,
  max = 850,
  size = 160,
  strokeWidth = 12,
  color = '#5b8c5a',
  animated = true,
  showLabel = true,
  tierLabel,
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillRatio = displayScore / max;
  const dashOffset = circumference * (1 - fillRatio);
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    if (!animated) { setDisplayScore(score); return; }
    const duration = 1200;
    const start = performance.now();
    const from = 0;
    const to = score;
    const raf = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(from + (to - from) * ease));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [score, animated]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold text-text-primary" style={{ fontSize: size * 0.18 }}>
            {displayScore}
          </span>
          {tierLabel && (
            <span className="font-display font-semibold uppercase tracking-wider text-text-secondary" style={{ fontSize: size * 0.085 }}>
              {tierLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
