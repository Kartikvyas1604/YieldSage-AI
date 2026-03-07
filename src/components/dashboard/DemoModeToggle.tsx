/**
 * Demo Mode Toggle Component
 * Allows users to switch between demo and live mode
 */

"use client";

import { useState } from "react";
import { TestTube2, Wallet } from "lucide-react";

interface DemoModeToggleProps {
  initialMode?: boolean;
  onModeChange?: (demoMode: boolean) => void;
}

export function DemoModeToggle({
  initialMode = true,
  onModeChange,
}: DemoModeToggleProps) {
  const [demoMode, setDemoMode] = useState(initialMode);

  const handleToggle = () => {
    const newMode = !demoMode;
    setDemoMode(newMode);
    onModeChange?.(newMode);
  };

  return (
    <div className="flex items-center gap-3 p-1 rounded-full border border-border bg-bg-card">
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200
          ${
            demoMode
              ? "bg-accent-gold text-bg-primary"
              : "text-text-secondary hover:text-text-primary"
          }
        `}
      >
        <TestTube2 className="w-4 h-4" />
        <span>Demo</span>
      </button>

      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200
          ${
            !demoMode
              ? "bg-accent-blue text-bg-primary"
              : "text-text-secondary hover:text-text-primary"
          }
        `}
      >
        <Wallet className="w-4 h-4" />
        <span>Live</span>
      </button>
    </div>
  );
}

/**
 * Demo Mode Banner - shows at top of dashboard when in demo mode
 */
export function DemoModeBanner() {
  return (
    <div className="w-full px-6 py-3 bg-accent-gold/10 border-b border-accent-gold/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TestTube2 className="w-5 h-5 text-accent-gold" />
          <div>
            <p className="font-semibold text-text-primary">
              Demo Mode Active
            </p>
            <p className="text-sm text-text-secondary">
              Viewing sample wallet (Sarah Chen, 742 score). Connect your wallet to see your real
              score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
