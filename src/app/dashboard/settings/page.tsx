'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Settings, Shield, Zap, Trash2, ChevronLeft,
  ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { STRATEGIES } from '@/lib/agent/strategies';
import type { StrategyId } from '@/types/strategy';

interface AgentSettings {
  strategyId: StrategyId;
  agentPaused: boolean;
  autoCompound: boolean;
  slippageBps: number;
  maxRiskLevel: number;
  dailySpendLimitUsd: number;
  approvedProtocols: string[];
  emailAlerts: boolean;
}

const DEFAULT_SETTINGS: AgentSettings = {
  strategyId: 'balanced',
  agentPaused: false,
  autoCompound: true,
  slippageBps: 50,
  maxRiskLevel: 3,
  dailySpendLimitUsd: 100,
  approvedProtocols: ['Kamino Finance', 'Meteora DLMM'],
  emailAlerts: false,
};

const ALL_PROTOCOLS = ['Kamino Finance', 'Meteora DLMM', 'Orca Whirlpool', 'Jupiter', 'Marginfi'];

function Toggle({
  checked,
  onChange,
}: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center transition-colors"
      style={{ color: checked ? 'var(--accent-sage)' : 'var(--text-muted)' }}
    >
      {checked ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ys_settings');
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  function save() {
    localStorage.setItem('ys_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function clearAllData() {
    localStorage.removeItem('ys_settings');
    localStorage.removeItem('ys_strategy');
    localStorage.removeItem('ys_onboarded');
    localStorage.removeItem('ys_demo');
    router.push('/');
  }

  function toggleProtocol(protocol: string) {
    setSettings(s => ({
      ...s,
      approvedProtocols: s.approvedProtocols.includes(protocol)
        ? s.approvedProtocols.filter(p => p !== protocol)
        : [...s.approvedProtocols, protocol],
    }));
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="btn-outline px-3 py-2 text-sm flex items-center gap-2">
            <ChevronLeft size={16} /> Back
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
              <Settings size={22} style={{ color: 'var(--accent-sage)' }} /> Agent Settings
            </h1>
            <p className="text-text-secondary text-sm mt-0.5">Control how the AI manages your yield</p>
          </div>
        </div>

        <div className="space-y-5">

          {/* Strategy selection */}
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
              <Zap size={16} style={{ color: 'var(--accent-sage)' }} /> Active Strategy
            </h2>
            <div className="grid gap-3">
              {(Object.values(STRATEGIES) as (typeof STRATEGIES)[StrategyId][]).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSettings(prev => ({ ...prev, strategyId: s.id }))}
                  className="text-left p-4 rounded-xl border transition-all"
                  style={{
                    borderColor: settings.strategyId === s.id ? 'var(--accent-sage)' : 'var(--border)',
                    background: settings.strategyId === s.id ? 'rgba(91,140,90,0.06)' : 'var(--bg-card)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-text-primary">{s.emoji} {s.name}</span>
                    <span className="text-xs font-mono text-text-secondary">
                      {s.targetAPY.min}–{s.targetAPY.max}% APY
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{s.plainEnglish}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Agent controls */}
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
              <Shield size={16} style={{ color: 'var(--accent-sage)' }} /> Agent Controls
            </h2>
            <div className="space-y-4">

              <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-medium text-text-primary">Pause Agent</p>
                  <p className="text-xs text-text-muted mt-0.5">Stop all automated rebalancing</p>
                </div>
                <Toggle
                  checked={settings.agentPaused}
                  onChange={v => setSettings(s => ({ ...s, agentPaused: v }))}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-medium text-text-primary">Auto-compound fees</p>
                  <p className="text-xs text-text-muted mt-0.5">Reinvest earned fees automatically</p>
                </div>
                <Toggle
                  checked={settings.autoCompound}
                  onChange={v => setSettings(s => ({ ...s, autoCompound: v }))}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">Email alerts</p>
                  <p className="text-xs text-text-muted mt-0.5">Notify on rebalance or emergency events</p>
                </div>
                <Toggle
                  checked={settings.emailAlerts}
                  onChange={v => setSettings(s => ({ ...s, emailAlerts: v }))}
                />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
              <AlertTriangle size={16} style={{ color: 'var(--warning)' }} /> Safety Limits
            </h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-text-secondary">Daily spend limit</label>
                  <span className="text-sm font-mono text-text-primary">${settings.dailySpendLimitUsd}</span>
                </div>
                <input
                  type="range" min={10} max={500} step={10}
                  value={settings.dailySpendLimitUsd}
                  onChange={e => setSettings(s => ({ ...s, dailySpendLimitUsd: parseInt(e.target.value) }))}
                  className="w-full accent-sage"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1"><span>$10</span><span>$500</span></div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-text-secondary">Max risk level</label>
                  <span className="text-sm font-mono text-text-primary">{settings.maxRiskLevel}/5</span>
                </div>
                <input
                  type="range" min={1} max={5} step={1}
                  value={settings.maxRiskLevel}
                  onChange={e => setSettings(s => ({ ...s, maxRiskLevel: parseInt(e.target.value) }))}
                  className="w-full accent-sage"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1"><span>Conservative</span><span>Aggressive</span></div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-text-secondary">Max slippage</label>
                  <span className="text-sm font-mono text-text-primary">{settings.slippageBps / 100}%</span>
                </div>
                <input
                  type="range" min={10} max={200} step={10}
                  value={settings.slippageBps}
                  onChange={e => setSettings(s => ({ ...s, slippageBps: parseInt(e.target.value) }))}
                  className="w-full accent-sage"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1"><span>0.1%</span><span>2%</span></div>
              </div>
            </div>
          </div>

          {/* Approved protocols */}
          <div className="card p-6">
            <h2 className="font-semibold text-text-primary mb-1">Approved Protocols</h2>
            <p className="text-xs text-text-muted mb-4">Agent can only interact with protocols you approve</p>
            <div className="flex flex-wrap gap-2">
              {ALL_PROTOCOLS.map(p => (
                <button
                  key={p}
                  onClick={() => toggleProtocol(p)}
                  className="px-3 py-1.5 rounded-full text-xs border transition-all"
                  style={{
                    borderColor: settings.approvedProtocols.includes(p) ? 'var(--accent-sage)' : 'var(--border)',
                    background: settings.approvedProtocols.includes(p) ? 'rgba(91,140,90,0.1)' : 'transparent',
                    color: settings.approvedProtocols.includes(p) ? 'var(--accent-sage)' : 'var(--text-muted)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={save}
            className="btn-sage w-full py-3.5 justify-center text-base"
          >
            {saved ? (
              <><CheckCircle2 size={18} /> Saved!</>
            ) : (
              'Save Settings'
            )}
          </button>

          {/* Danger zone */}
          <div className="card p-6 border" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
            <h2 className="font-semibold text-red-500 mb-2 flex items-center gap-2">
              <Trash2 size={16} /> Danger Zone
            </h2>
            <p className="text-xs text-text-muted mb-4">
              Clear all YieldSage data (strategy, settings, demo state) and return to onboarding.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-outline text-sm px-5 py-2 text-red-500 border-red-400"
              >
                Reset & Clear Data
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={clearAllData}
                  className="px-5 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                >
                  Yes, clear everything
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-outline text-sm px-5 py-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
