'use client';
import React from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function GlowCard({ children, className = '', onClick, hover = true }: GlowCardProps) {
  return (
    <div
      className={`bg-bg-card border border-border rounded-lg p-6 ${hover ? 'hover:border-text-primary transition-colors' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
