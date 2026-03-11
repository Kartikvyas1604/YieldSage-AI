"use client";

/**
 * useCreditScore — fetches/computes the YieldSage yield score for a wallet.
 * In demo mode: returns the score from DEMO_USER mock data.
 * In live mode: hits /api/score/[wallet] and caches for 5 minutes.
 */

import { useState, useEffect } from "react";
import type { YieldSageScore } from "@/lib/scoring/yieldsage-score";
import { DEMO_USER } from "@/lib/data/yieldsage-mock";

interface UseCreditScoreReturn {
  score: number | null;
  scoreData: YieldSageScore | null;
  tier: string | null;
  tierColor: string | null;
  pointsToNextTier: number;
  weeklyGain: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple in-memory cache: wallet → { data, fetchedAt }
const scoreCache = new Map<string, { data: YieldSageScore & { tier: string; tierColor: string }; fetchedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export function useCreditScore(
  walletAddress: string | null,
  demo = false
): UseCreditScoreReturn {
  const [scoreData, setScoreData] = useState<(YieldSageScore & { tier: string; tierColor: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick((t) => t + 1);

  useEffect(() => {
    if (demo) {
      // Build a synthetic YieldSageScore from DEMO_USER mock data
      const synthetic = {
        total: DEMO_USER.yieldScore,
        tier: DEMO_USER.scoreTier,
        tierColor: DEMO_USER.scoreTierColor,
        breakdown: {
          consistency:    { score: 212, max: 297, percent: 71 },
          patience:       { score: 168, max: 213, percent: 79 },
          responsibility: { score: 105, max: 150, percent: 70 },
          engagement:     { score: 75,  max: 140, percent: 54 },
        },
        pointsToNextTier: 750 - DEMO_USER.yieldScore,
        nextTierLabel: "Excellent",
        nextTierScore: 750,
        weeklyGain: 4,
      };
      setScoreData(synthetic);
      return;
    }

    if (!walletAddress) {
      setScoreData(null);
      return;
    }

    // Check cache
    const cached = scoreCache.get(walletAddress);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      setScoreData(cached.data);
      return;
    }

    const fetchScore = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/score/${encodeURIComponent(walletAddress)}`);
        if (!res.ok) throw new Error(`Score API returned ${res.status}`);
        const json = await res.json();

        const data = {
          total: json.score,
          tier: json.tier,
          tierColor: json.tierColor,
          breakdown: json.breakdown,
          pointsToNextTier: json.pointsToNextTier,
          nextTierLabel: json.nextTierLabel,
          nextTierScore: json.nextTierScore ?? 0,
          weeklyGain: json.weeklyGain ?? 0,
        };

        scoreCache.set(walletAddress, { data, fetchedAt: Date.now() });
        setScoreData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch score");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScore();
  }, [walletAddress, demo, tick]);

  return {
    score: scoreData?.total ?? null,
    scoreData: scoreData ?? null,
    tier: scoreData?.tier ?? null,
    tierColor: scoreData?.tierColor ?? null,
    pointsToNextTier: scoreData?.pointsToNextTier ?? 0,
    weeklyGain: scoreData?.weeklyGain ?? 0,
    isLoading,
    error,
    refetch,
  };
}
