"use client";

/**
 * useAgentStatus — polls the AI agent's latest action and status.
 * In demo mode: cycles through DEMO_ACTION_LOGS every 8 seconds.
 * In live mode: polls /api/agent/analyze for the wallet's latest state.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { AgentActionLog } from "@/types/agent";
import { DEMO_ACTION_LOGS } from "@/lib/data/yieldsage-mock";

type AgentStatusState = "idle" | "monitoring" | "acting" | "paused";

interface UseAgentStatusReturn {
  status: AgentStatusState;
  latestAction: AgentActionLog | null;
  actionFeed: AgentActionLog[];
  secondsUntilNextCheck: number;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
  triggerManualCheck: () => void;
}

const POLL_INTERVAL_SECONDS = 8; // demo cycle cadence

export function useAgentStatus(
  walletAddress: string | null,
  demo = false
): UseAgentStatusReturn {
  const [status, setStatus] = useState<AgentStatusState>("idle");
  const [latestAction, setLatestAction] = useState<AgentActionLog | null>(null);
  const [actionFeed, setActionFeed] = useState<AgentActionLog[]>([]);
  const [secondsUntilNextCheck, setSecondsUntilNextCheck] = useState(POLL_INTERVAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  const demoIndexRef = useRef(0);
  const checkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runDemoCycle = useCallback(() => {
    if (isPaused) return;

    const log = DEMO_ACTION_LOGS[demoIndexRef.current % DEMO_ACTION_LOGS.length];
    demoIndexRef.current += 1;

    setStatus("acting");
    setLatestAction(log);
    setActionFeed((prev) => [log, ...prev].slice(0, 20));

    setTimeout(() => setStatus("monitoring"), 2000);
    setSecondsUntilNextCheck(POLL_INTERVAL_SECONDS);
  }, [isPaused]);

  const triggerManualCheck = useCallback(() => {
    setSecondsUntilNextCheck(0);
    setStatus("acting");
    setTimeout(() => {
      runDemoCycle();
    }, 1500);
  }, [runDemoCycle]);

  // Demo mode: cycle through action logs
  useEffect(() => {
    if (!demo) return;

    // Seed with existing logs
    setActionFeed(DEMO_ACTION_LOGS.slice(0, 5));
    setLatestAction(DEMO_ACTION_LOGS[0]);
    setStatus("monitoring");

    checkTimerRef.current = setInterval(() => {
      if (!isPaused) runDemoCycle();
    }, POLL_INTERVAL_SECONDS * 1000);

    countdownRef.current = setInterval(() => {
      setSecondsUntilNextCheck((s) => (s <= 1 ? POLL_INTERVAL_SECONDS : s - 1));
    }, 1000);

    return () => {
      if (checkTimerRef.current) clearInterval(checkTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [demo, isPaused, runDemoCycle]);

  // Live mode: poll the API
  useEffect(() => {
    if (demo || !walletAddress) return;

    const poll = async () => {
      if (isPaused) return;
      try {
        setStatus("acting");
        // In production this would be GET /api/agent/status?wallet=...
        // For now, we just update from local state
        setStatus("monitoring");
      } catch {
        setStatus("idle");
      }
    };

    poll();
    checkTimerRef.current = setInterval(poll, 60_000); // live: every 60s

    return () => {
      if (checkTimerRef.current) clearInterval(checkTimerRef.current);
    };
  }, [demo, walletAddress, isPaused]);

  const pause = useCallback(() => {
    setIsPaused(true);
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setStatus("monitoring");
  }, []);

  return {
    status,
    latestAction,
    actionFeed,
    secondsUntilNextCheck,
    isPaused,
    pause,
    resume,
    triggerManualCheck,
  };
}
