'use client';
import { useState, useCallback } from 'react';
import { DEMO_USER, DEMO_AI_STREAM } from '@/lib/data/yieldsage-mock';

export type DemoStep = 'idle' | 'running' | 'done';

export function useDemoAgent() {
  const [step, setStep]             = useState<DemoStep>('idle');
  const [streamIndex, setStreamIndex] = useState(0);
  const [scoreBoost, setScoreBoost] = useState(0);

  const runAgent = useCallback(async () => {
    setStep('running');
    setStreamIndex(0);

    for (let i = 1; i <= DEMO_AI_STREAM.length; i++) {
      await new Promise(r => setTimeout(r, 1500));
      setStreamIndex(i);
    }

    // Score bumps up at the end
    setScoreBoost(3);
    setStep('done');
  }, []);

  const reset = useCallback(() => {
    setStep('idle');
    setStreamIndex(0);
    setScoreBoost(0);
  }, []);

  return {
    step,
    streamMessages: DEMO_AI_STREAM.slice(0, streamIndex),
    currentScore: DEMO_USER.creditScore + scoreBoost,
    scoreBoost,
    runAgent,
    reset,
  };
}
