'use client';

import React from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'gold' | 'blue' | 'green' | 'red' | 'none';
  onClick?: () => void;
  hover?: boolean;
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'none',
  onClick,
  hover = true,
}: GlowCardProps) {
  const glowClasses = {
    gold: 'glow-gold',
    blue: 'glow-blue',
    green: 'glow-green',
    red: 'glow-red',
    none: '',
  };

  return (
    <div
      className={`
        glass-strong rounded-xl p-6 transition-all duration-300
        ${hover ? 'hover:border-border-bright hover:scale-[1.02]' : ''}
        ${glowClasses[glowColor]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
