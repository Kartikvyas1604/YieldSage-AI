const fs = require('fs');
const page = `'use client';

import React, { useState } from 'react';
import { GlowCard as Card } from '@/components/ui/GlowCard';
import { Button } from '@/components/ui/Button';
import { AIAnalysisStream } from '@/components/dashboard/AIAnalysisStream';
import { DEMO_CRED_SCORE } from '@/lib/data/mock';
import {
  TrendingUp,
  Calendar,
  Wallet,
  RefreshCw,
  Activity,
  ShieldCheck,
  Zap

} from 'lucide-react';
import { formatDate, formatAddress } from '@/lib/utils/format';

export default function DashboardPage() {
  const [score] = useState(DEMO_CRED_SCORE);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 space-y-6">
        
        {0/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-border bg-bg-secondary">
              <ShieldCheck size={14} className="text-text-primary" />
              <span className="text-xs font-mono text-text-primary uppercase tracking-wider">Verified Identity</span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-text-primary mb-1">
              Terminal Overview
            </h1>
            <p className="text-text-secondary font-mono text-xs">
              {formatAddress(score.walletAddress, 8)}
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            isLoading={isRefreshing}
            variant="primary"
            size="md"
          >
            Keep Syncing =></Button>
        </div>

        {0/* Little Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <score.history && (
            <Card className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-text-secondary mb-2">TREND</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-medium text-lg">+ {score.history[0].change} pts</p>
                </div>
              </div>
              <TrendingUp size={24} className="text-text-muted" />
            </Card>
          )}
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-text-secondary mb-2">TIER CATEGORY</p>
              <p className="font-medium text-lh">Institutional</p>
            </div>
            <ShieldCheck size={24} className="text-text-muted" />
          </Card>
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-text-secondary mb-2">UNDERCOLLATERAL BORROW</p>
              <p className="font-medium text-lg">Unlocked</p>
            </div>
            <Zap size={24} className="text-text-muted" />
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <div className="flex flex-col-reverse md:flex-row items-center gap-10">
                <div className="flex-1 w-full space-y-4">
                  <h2 className="text-sm font-mono text-text-secondary mb-6">SCORE BREAKDOWN</h2>
                  {score.breakdown && Object.entries(score.breakdown).map(([category, item], idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="capitalize text-text-primary">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-mono text-text-secondary">{item.score}/{item.maxScore}</span>
                      </div>
                      <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-text-primary"
                          style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="w-48 h-48 rounded-full border-[6px] border-text-primary/10 flex flex-col items-center justify-center shrink-0 relative">
                  <div className="absolute inset--[6px] rounded-full border-[6px] border-transparent border-t-text-primary border-r-text-primary" />
                  <span className="font-display text-5xl font-bold tracking-tighter text-text-primary">{score.score}</span>
                  <span className="text-[10px] font-mono text-text-secondary mt-1">/ 850</span>
                </div>
              </div>
            </Card>
        </div>

        <div className="lg:col-span-1 h-[420px]">
            <Card className="h-full flex flex-col">
              <h3 className="text-sm font-mono text-text-secondary mb-4 pb-4 border-b border-border">
                ACTIVITY LOGS
              </h3>
              <div className="flex-1 overflow-auto">
                <AIAnalysisStream reasoning={score.aiReasoning} />
              </div>
            </Card>
        </div>
      </div>

    </div>
  </div>
  );
}
`;
fs.writeFileSync('src/app/dashboard/page.tsx', page);
