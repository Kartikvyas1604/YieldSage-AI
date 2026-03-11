'use client';

import React from 'react';
import { TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface EarningsPoint { date: string; amount: number }

interface Props {
  daily: number;
  weekly: number;
  monthly: number;
  allTime: number;
  history: EarningsPoint[];
}

export function EarningsCard({ daily, weekly, monthly, allTime, history }: Props) {
  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(91,140,90,0.12)' }}>
          <TrendingUp size={16} style={{ color: 'var(--accent-sage)' }} />
        </div>
        <span className="text-sm font-medium text-text-secondary">Earnings</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-5">
        {([
          ['Today', daily],
          ['This week', weekly],
          ['This month', monthly],
          ['All time', allTime],
        ] as const).map(([label, val]) => (
          <div key={label} className="text-center p-2 sm:p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-base font-mono font-bold" style={{ color: 'var(--accent-sage)' }}>
              ${val.toFixed(2)}
            </p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <div className="h-28 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b8c5a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5b8c5a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <Tooltip
                formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Earnings']}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="amount" stroke="#5b8c5a" strokeWidth={2} fill="url(#earningsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
        <Clock size={12} />
        Updated every 30 minutes by AI agent
      </div>
    </div>
  );
}
