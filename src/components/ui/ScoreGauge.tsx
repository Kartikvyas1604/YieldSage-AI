'use client';

import React, { useEffect, useState } from 'react';
import { getScoreColor, getScoreTier, SCORE_TIER_CONFIG } from '@/types/score';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  showLabel?: boolean;
}

export function ScoreGauge({
  score,
  maxScore = 850,
  size = 'large',
  animate = true,
  showLabel = true,
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const tier = getScoreTier(score);
  const color = getScoreColor(score);
  const tierConfig = SCORE_TIER_CONFIG[tier];

  // Size configurations
  const sizeConfig = {
    small: { width: 120, strokeWidth: 8, fontSize:' 24px', labelSize: '12px' },
    medium: { width: 200, strokeWidth: 12, fontSize: '36px', labelSize: '14px' },
    large: { width: 280, strokeWidth: 16, fontSize: '64px', labelSize: '16px' },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * Math.PI * 1.5; // 270 degrees arc
  const percentage = displayScore / maxScore;
  const strokeOffset = circumference - percentage * circumference;

  // Animate score counting up
  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    const duration = 2500; // 2.5 seconds
    const steps = 60;
    const increment = score / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [score, animate]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width={config.width}
        height={config.width}
        viewBox={`0 0 ${config.width} ${config.width}`}
        className="transform -rotate-[135deg]"
      >
        {/* Background arc */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={config.strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          style={{
            strokeDashoffset: 0,
          }}
        />
        
        {/* Animated score arc */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          style={{
            strokeDashoffset: strokeOffset,
            transition: animate ? 'stroke-dashoffset 2.5s ease-out, stroke 0.3s ease' : 'none',
            filter: 'drop-shadow(0 0 8px currentColor)',
          }}
        />
        
        {/* Glowing endpoint */}
        {displayScore > 0 && (
          <circle
            cx={
              config.width / 2 +
              radius * Math.cos((percentage * Math.PI * 1.5) - Math.PI * 0.75)
            }
            cy={
              config.width / 2 +
              radius * Math.sin((percentage * Math.PI * 1.5) - Math.PI * 0.75)
            }
            r={config.strokeWidth / 2 + 2}
            fill={color}
            style={{
              filter: 'drop-shadow(0 0 12px currentColor)',
            }}
          />
        )}
      </svg>

      {/* Score number and label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: 'rotate(0deg)' }}
      >
        <div
          className="font-display font-bold text-gradient-gold"
          style={{ fontSize: config.fontSize, lineHeight: 1 }}
        >
          {Math.floor(displayScore)}
        </div>
        
        {showLabel && (
          <div className="mt-2 flex flex-col items-center gap-1">
            <div
              className="font-mono font-medium uppercase tracking-wider"
              style={{
                fontSize: config.labelSize,
                color: color,
              }}
            >
              {tierConfig.label}
            </div>
            <div
              className="font-body text-text-muted"
              style={{ fontSize: '12px' }}
            >
              out of {maxScore}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
