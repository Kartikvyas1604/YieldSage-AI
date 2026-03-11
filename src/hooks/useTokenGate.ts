'use client';
import { useMemo } from 'react';
import { SAGE_TIERS } from '@/lib/utils/constants';

export function useTokenGate(sageBalance: number) {
  const tier = useMemo(() => {
    if (sageBalance >= 50000) return SAGE_TIERS.ELITE;
    if (sageBalance >= 10000) return SAGE_TIERS.PRO;
    if (sageBalance >= 1000)  return SAGE_TIERS.STARTER;
    return SAGE_TIERS.FREE;
  }, [sageBalance]);

  const canAccess = useCallback((strategyId: string) => {
    const allowed: Record<string, string[]> = {
      FREE:    ['conservative'],
      STARTER: ['conservative', 'balanced'],
      PRO:     ['conservative', 'balanced', 'growth'],
      ELITE:   ['conservative', 'balanced', 'growth'],
    };
    return allowed[tier.label]?.includes(strategyId) ?? false;
  }, [tier]);

  return { tier, canAccess };
}

function useCallback<T>(fn: T, _deps: unknown[]): T { return fn; }
