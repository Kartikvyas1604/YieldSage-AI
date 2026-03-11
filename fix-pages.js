const fs = require('fs');

const scorePage = `'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { DEMO_USER, SCORE_BREAKDOWN, SCORE_HISTORY, IMPROVEMENT_TIPS } from '@/lib/data/yieldsage-mock';

export default function ScorePage() {
  const user = DEMO_USER;
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Credit Score Report</h1>
            <p className="text-text-secondary text-sm mt-0.5">Your full YieldSage trust score breakdown</p>
          </div>
        </div>

        <div className="card p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
          <ScoreRing score={user.yieldScore} size={120} strokeWidth={10} color={user.scoreTierColor} />
          <div>
            <p className="text-4xl font-mono font-bold text-text-primary">{user.yieldScore}</p>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2"
              style={{ background: user.scoreTierColor + '22', color: user.scoreTierColor }}>
              {user.scoreTier}
            </span>
            <p className="text-text-secondary text-sm mt-3 max-w-xs">
              Your score unlocks better yields, larger capital limits, and advanced strategies.
            </p>
          </div>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Star size={16} style={{ color: 'var(--accent-sage)' }} />
            <h2 className="font-semibold text-text-primary">Score Breakdown</h2>
          </div>
          <div className="space-y-4">
            {SCORE_BREAKDOWN.map(cat => (
              <div key={cat.category}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="font-medium text-text-primary text-sm">{cat.category}</span>
                    <span className="text-xs text-text-muted ml-2">({cat.weight}% weight)</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-bold text-lg" style={{ color: cat.color }}>{cat.score}</span>
                    <span className="text-xs text-text-muted">/ {cat.max}</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: \`\${(cat.score / cat.max) * 100}%\`, background: cat.color }} />
                </div>
                <p className="text-xs text-text-muted mt-1.5">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {SCORE_HISTORY.length > 0 && (
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={16} style={{ color: 'var(--accent-sage)' }} />
              <h2 className="font-semibold text-text-primary">Score History</h2>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SCORE_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[300, 850]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [v, 'Score']}
                  />
                  <Line type="monotone" dataKey="score" stroke="var(--accent-sage)" strokeWidth={2} dot={{ fill: 'var(--accent-sage)', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="card p-6">
          <h2 className="font-semibold text-text-primary mb-4">How to Improve</h2>
          <div className="space-y-3">
            {IMPROVEMENT_TIPS.slice(0, 4).map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(91,140,90,0.12)' }}>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent-sage)' }}>{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{tip.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{tip.description}</p>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent-sage)' }}>+{tip.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

const historyPage = `'use client';

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
                  formatter={(v) => ['\$' + Number(v).toFixed(2), 'Earned']}
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
`;

fs.writeFileSync('./src/app/dashboard/score/page.tsx', scorePage);
fs.writeFileSync('./src/app/dashboard/history/page.tsx', historyPage);
console.log('Score page:', scorePage.split('\n').length, 'lines');
console.log('History page:', historyPage.split('\n').length, 'lines');
