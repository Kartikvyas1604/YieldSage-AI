'use client';

import React, { useState } from 'react';
import { ShieldAlert, Pause, LogOut, AlertTriangle } from 'lucide-react';

interface Props {
  onPause: () => void;
  onWithdraw: () => void;
  isPaused?: boolean;
}

export function EmergencyStop({ onPause, onWithdraw, isPaused = false }: Props) {
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  return (
    <div className="card p-6 border-2" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={18} style={{ color: '#ef4444' }} />
        <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>Emergency Controls</span>
      </div>

      <p className="text-xs text-text-muted mb-5">
        These controls are always available. You keep full custody of your funds.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
          style={{
            background: isPaused ? 'rgba(91,140,90,0.1)' : 'rgba(245,158,11,0.1)',
            color: isPaused ? 'var(--accent-sage)' : 'var(--accent-amber)',
            border: `1px solid ${isPaused ? 'rgba(91,140,90,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}
        >
          <Pause size={15} />
          {isPaused ? 'Resume AI agent' : 'Pause AI agent'}
        </button>

        {!confirmWithdraw ? (
          <button
            onClick={() => setConfirmWithdraw(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            <LogOut size={15} />
            Emergency withdraw
          </button>
        ) : (
          <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-2 mb-3 text-sm font-medium" style={{ color: '#ef4444' }}>
              <AlertTriangle size={15} />
              Are you sure? This exits your position.
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { onWithdraw(); setConfirmWithdraw(false); }}
                className="px-3 py-2 rounded-lg text-xs font-semibold flex-1"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                Yes, withdraw
              </button>
              <button
                onClick={() => setConfirmWithdraw(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold flex-1"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
