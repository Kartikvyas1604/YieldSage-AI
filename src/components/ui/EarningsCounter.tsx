'use client';

import React, { useEffect, useRef, useState } from 'react';

interface EarningsCounterProps {
  value: number;
  prefix?: string;
  decimals?: number;
  className?: string;
  animated?: boolean;
  duration?: number;
}

export function EarningsCounter({
  value,
  prefix = '$',
  decimals = 2,
  className = '',
  animated = true,
  duration = 1000,
}: EarningsCounterProps) {
  const [display, setDisplay] = useState(animated ? 0 : value);
  const prevRef = useRef(animated ? 0 : value);

  useEffect(() => {
    if (!animated) { setDisplay(value); return; }
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;
    const start = performance.now();
    const raf = requestAnimationFrame(function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * ease);
      if (p < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [value, animated, duration]);

  return (
    <span className={`earnings-counter ${className}`}>
      {prefix}{display.toFixed(decimals)}
    </span>
  );
}
