'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronLeft, Zap } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  stat: string;
  statLabel: string;
  usedFor: string;
  color: string;
  textColor: string;
  letter: string;
}

const PARTNERS: Partner[] = [
  {
    id: 'metengine',
    name: 'MetEngine',
    tagline: 'Smart LP Signal Inspiration',
    description:
      'The pioneer of smart wallet LP copying on Solana Telegram. MetEngine showed the world that following high-performing LP wallets on Meteora DLMM could generate outsized returns. YieldSage extends their approach with Claude AI reasoning — instead of blindly copying, we evaluate every signal against your personal risk profile.',
    url: 'https://metengine.xyz',
    stat: '#1',
    statLabel: 'LP copying pioneer',
    usedFor: 'Smart wallet signal detection on Meteora DLMM',
    color: '#FF6B35',
    textColor: '#FF6B35',
    letter: 'M',
  },
  {
    id: 'polymarket',
    name: 'Polymarket',
    tagline: 'Prediction Market Risk Signals',
    description:
      "World's largest prediction market, now natively on Solana via Jupiter (Feb 2026). Polymarket hosts 1,900+ active markets where traders bet real money on outcomes — making it 94% accurate one month before resolution. YieldSage's AI reads Polymarket odds for Solana/crypto-relevant events as macro risk signals before making any strategy changes.",
    url: 'https://polymarket.com',
    stat: '$7.6B',
    statLabel: 'Jan 2026 volume',
    usedFor: 'Macro risk signals before strategy rebalancing',
    color: '#0066FF',
    textColor: '#0066FF',
    letter: 'P',
  },
  {
    id: 'kamino',
    name: 'Kamino Finance',
    tagline: 'Conservative & Growth Yield',
    description:
      "Solana's largest DeFi protocol with $2.8B TVL. Kamino offers lending, borrowing, and automated liquidity vaults. YieldSage uses Kamino's lending markets for the Conservative strategy (USDC at 6–12% APY) and reads loan history for credit scoring.",
    url: 'https://kamino.finance',
    stat: '$2.8B',
    statLabel: 'Total Value Locked',
    usedFor: 'Conservative strategy USDC lending + credit scoring',
    color: '#C4A000',
    textColor: '#C4A000',
    letter: 'K',
  },
  {
    id: 'meteora',
    name: 'Meteora DLMM',
    tagline: 'Balanced LP Strategy',
    description:
      "Solana's dynamic liquidity infrastructure. Meteora DLMM uses bin-based concentrated liquidity with dynamic fees that automatically increase during volatility — protecting LPs against impermanent loss. YieldSage uses Meteora for the Balanced (Smart LP) strategy with precise, AI-targeted bin ranges.",
    url: 'https://meteora.ag',
    stat: '$39.9B',
    statLabel: 'Monthly volume (Jan 2025)',
    usedFor: 'Balanced strategy concentrated LP positions',
    color: '#8B5CF6',
    textColor: '#8B5CF6',
    letter: 'M',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    tagline: 'All Token Swaps & Rebalancing',
    description:
      "Solana's #1 DEX aggregator processing $700M+ daily volume. Jupiter finds the best swap routes across all Solana DEXs. Every time YieldSage rebalances your position — rotating strategies, taking profits, or emergency exits — it routes through Jupiter for the best possible rate.",
    url: 'https://jup.ag',
    stat: '$700M+',
    statLabel: 'Daily volume',
    usedFor: 'All rebalancing swaps + emergency exits',
    color: '#C084FC',
    textColor: '#C084FC',
    letter: 'J',
  },
  {
    id: 'birdeye',
    name: 'Birdeye',
    tagline: 'Price & Portfolio Analytics',
    description:
      "Solana's leading token analytics platform tracking 500K+ tokens with real-time prices and portfolio data. YieldSage uses Birdeye for live token pricing, portfolio USD valuation, and price history needed to calculate impermanent loss on LP positions.",
    url: 'https://birdeye.so',
    stat: '500K+',
    statLabel: 'Tokens tracked',
    usedFor: 'Real-time prices + portfolio valuation + IL calculation',
    color: '#00B4D8',
    textColor: '#00B4D8',
    letter: 'B',
  },
  {
    id: 'helius',
    name: 'Helius',
    tagline: 'Solana RPC & Transaction Data',
    description:
      "Solana's leading enhanced RPC provider. Helius's parsed transaction API lets YieldSage read wallet history with full context — knowing exactly which DeFi protocols were used, what positions were opened, and how funds flowed. This powers both the AI analysis and the credit scoring engine.",
    url: 'https://helius.dev',
    stat: '#1',
    statLabel: 'Solana RPC provider',
    usedFor: 'Wallet analysis + transaction history for AI + credit scoring',
    color: '#FF8C42',
    textColor: '#FF8C42',
    letter: 'H',
  },
];

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div
      className="card p-5 sm:p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Logo badge */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ background: partner.color }}
        >
          {partner.letter}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-text-primary text-base">
              {partner.name}
            </h3>
            {partner.id === 'polymarket' && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(192,132,252,0.15)', color: '#C084FC' }}
              >
                <Zap size={8} /> Now on Solana
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted">{partner.tagline}</p>
        </div>

        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:opacity-80"
          style={{
            background: `rgba(${hexToRgb(partner.color)}, 0.1)`,
            color: partner.textColor,
            border: `1px solid rgba(${hexToRgb(partner.color)}, 0.25)`,
          }}
        >
          Visit <ExternalLink size={11} />
        </a>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed">{partner.description}</p>

      {/* Stats + usage */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex-1 rounded-xl p-3 text-center"
          style={{ background: `rgba(${hexToRgb(partner.color)}, 0.06)` }}
        >
          <p className="font-mono font-bold text-lg" style={{ color: partner.textColor }}>
            {partner.stat}
          </p>
          <p className="text-xs text-text-muted mt-0.5">{partner.statLabel}</p>
        </div>

        <div
          className="flex-2 rounded-xl p-3"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <p className="text-[11px] text-text-muted mb-1 uppercase tracking-wider font-mono">
            Used for
          </p>
          <p className="text-xs text-text-primary leading-relaxed">{partner.usedFor}</p>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '91,140,90';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

export default function IntegrationsPage() {
  return (
    <div
      className="min-h-screen pt-20 pb-16 px-4 sm:px-6"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
        >
          <ChevronLeft size={16} /> Dashboard
        </Link>

        {/* Page header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">
            Powered by
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            🔌 Integrations & Partners
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl leading-relaxed">
            YieldSage is built on the best infrastructure in Solana DeFi. Every integration
            powers a real feature — no logo-stuffing.
          </p>
        </div>

        {/* Partner grid */}
        <div className="grid gap-4 sm:gap-5">
          {PARTNERS.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>

        {/* Footer note */}
        <div
          className="mt-8 p-4 rounded-xl text-sm text-text-secondary text-center leading-relaxed"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          YieldSage does not have formal partnerships with these protocols. We integrate
          with their public APIs and SDKs to build the best experience for our users.
          All attribution is genuine — these platforms power specific features.
        </div>
      </div>
    </div>
  );
}
