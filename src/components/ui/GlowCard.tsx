'use client';
import React from 'react';
import { cn } from './Button';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // Kept for backwards compatibility but ignored
  onClick?: () => void;
  hover?: boolean;
}

// Renamed internally to just Card style, keeping export name for compat
export function GlowCard({ children, className, onClick, hover = false }: GlowCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-bg-primary border border-border rounded-lg p-6 transition-all duration-200',
        hover && 'hover:border-text-primary hover:shadow-sm',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      {children}
    </div>
  );
}
