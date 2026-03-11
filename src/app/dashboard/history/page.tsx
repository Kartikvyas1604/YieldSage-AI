'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DEMO_ACTION_LOGS, EARNINGS_HISTORY } from '@/lib/data/yieldsage-mock';

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return s + 's ago';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  return Math.floor(s / 3600) + 'h ago';
}

export default function HistoryPage() {
  const chartData = EARNINGS_HISTORY.slice(-14).map(e => ({ date: e.date.slice(5), earned: e.earned }));
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Action History</h1>
            <p className="text-text-secondary text-sm mt-0.5">Every AI action with plain-English explanations</p>
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-text-primary mb-4">Daily Earnings (last 14 days)</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => ['$' + Number(v).toFixed(2), 'Earned']}
                />
                <Bar dataKey="earned" fill="var(--accent-sage)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} style={{ color: 'var(--accent-sage)' }} />
            <h2 className="font-semibold text-text-primary">All AI Actions</h2>
          </div>
          <div className="space-y-3">
            {DEMO_ACTION_LOGS.map((log, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(91,140,90,0.12)' }}>
                  <Activity size={14} style={{ color: 'var(--accent-sage)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{log.plainEnglish}</p>
                  <p className="text-xs text-text-secondary mt-1">{log.description}</p>
                  {log.txHash && (
                    <p className="text-xs font-mono text-text-muted mt-1">tx: {log.txHash.slice(0, 20)}...</p>
                  )}
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap">{timeAgo(log.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
