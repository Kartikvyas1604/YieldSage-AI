<div align="center">

# YieldSage AI

**Automated DeFi Yield Optimization on Solana — Powered by Claude AI**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Solana](https://img.shields.io/badge/Solana-mainnet-9945FF?style=flat-square&logo=solana)](https://solana.com)
[![Anthropic](https://img.shields.io/badge/Claude-3.5--Haiku-orange?style=flat-square)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#features) · [Quick Start](#quick-start) · [Architecture](#architecture) · [API Reference](#api-reference)

</div>

---

## Overview

YieldSage AI lets anyone — regardless of DeFi experience — earn passive income from Solana's yield ecosystem. Connect your wallet, answer 3 plain-English questions, and an AI agent handles everything: strategy selection, capital deployment, 24/7 position monitoring, automatic compounding, and risk-triggered exits.

**What makes it different:** A behavioral *Yield Score* (modeled on credit scoring) that tracks your on-chain discipline over time, progressively unlocking higher-yield strategies as your score grows.

> **No DeFi knowledge required.** The agent reads your wallet history, scores your risk profile, deploys across Kamino, Meteora, and Jupiter — and rebalances automatically every 4 hours.

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Agent** | Claude AI analyzes on-chain history and picks the optimal yield strategy |
| **Yield Score** | 0–850 behavioral score measuring consistency, patience, and discipline |
| **3-Tier Strategies** | Conservative (10–14%), Balanced (15–22%), Growth (22–35% APY) |
| **Auto-Rebalance** | Monitors positions every 4 hours; shifts capital to highest-yield pools |
| **Smart Signals** | MetEngine-inspired whale wallet tracking + Polymarket macro risk integration |
| **Emergency Stop** | One-click pause or instant full withdrawal — funds stay in your wallet |
| **Demo Mode** | Full interactive experience with no wallet required |
| **Mobile-First** | Fully responsive across all screen sizes |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, SSR + SSE streaming) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + custom CSS design system |
| AI | Anthropic Claude `claude-3-5-haiku-20241022` |
| Blockchain | Solana — `@solana/web3.js` + wallet adapters (Phantom, Backpack) |
| Data / RPC | Helius Enhanced RPC API |
| DeFi Protocols | Kamino Finance · Meteora DLMM · Jupiter Aggregator · Birdeye |
| Charts | Recharts |
| Rate Limiting | Upstash Redis |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── onboard/                    # 3-step onboarding quiz
│   ├── dashboard/                  # Main dashboard + sub-pages
│   │   ├── score/                  # Yield Score breakdown
│   │   ├── history/                # Action history log
│   │   ├── settings/               # Agent configuration
│   │   └── integrations/           # Protocol partner overview
│   └── api/
│       ├── agent/{analyze,onboard,deploy,rebalance}
│       ├── score/{calculate,[wallet]}
│       ├── wallet/{balance,history}
│       └── cron/monitor            # Automated position watcher
├── components/
│   ├── dashboard/                  # PortfolioCard, StrategyCard, ActionFeed, etc.
│   ├── landing/                    # Hero, HowItWorks, ScoreJourney, etc.
│   └── ui/                         # Shared primitives (ScoreGauge, GlowCard, etc.)
└── lib/
    ├── agent/                      # Claude prompts, tools, scoring engine
    ├── integrations/               # Kamino, Meteora, Jupiter, Birdeye, Polymarket
    └── solana/                     # Helius, Jupiter helpers
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com)
- A [Helius API key](https://helius.dev) (free tier available)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/yieldsage-ai
cd yieldsage-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
HELIUS_API_KEY=...
BIRDEYE_API_KEY=...           # optional — for live token prices
UPSTASH_REDIS_REST_URL=...    # optional — for rate limiting
UPSTASH_REDIS_REST_TOKEN=...  # optional
```

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Try Demo** for the full experience — no wallet needed.

---

## Yield Score System

The Yield Score (0–850) is a behavioral metric calculated from four on-chain dimensions:

| Category | Max Points | What It Measures |
|----------|-----------|------------------|
| **Consistency** | 297 | Days active in protocol, monthly interactions, no panic withdrawals |
| **Patience** | 213 | Average position duration, sustained time-in-market |
| **Responsibility** | 150 | No liquidations, conservative leverage usage |
| **Engagement** | 140 | Number of protocols used, governance participation |

### Score Tiers & Unlocks

| Tier | Range | Strategy Access |
|------|-------|----------------|
| New | 0–299 | Conservative only |
| Building | 300–499 | + Balanced |
| Fair | 500–649 | + Growth |
| Good | 650–749 | + Lower fees, priority support |
| Excellent | 750–850 | + Full protocol access & best rates |

---

## Strategy Tiers

### Conservative — 10–14% APY
- **Protocol:** Kamino Finance USDC-USDT stable pool
- **Risk:** 1 / 5 — near-zero impermanent loss
- **Rebalance:** Weekly

### Balanced Growth — 15–22% APY
- **Protocol:** Kamino 60% + Meteora DLMM 40%
- **Risk:** 2 / 5 — low impermanent loss
- **Rebalance:** Daily

### Aggressive Growth — 22–35% APY
- **Protocol:** Meteora DLMM high-volume pools
- **Risk:** 3 / 5 — moderate impermanent loss
- **Rebalance:** Every 4 hours

---

## API Reference

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/agent/analyze` | Stream Claude AI analysis (SSE) |
| `POST` | `/api/agent/onboard` | Generate strategy recommendation from quiz answers |
| `POST` | `/api/agent/deploy` | Build unsigned deploy transaction payload |
| `POST` | `/api/agent/rebalance` | Trigger portfolio rebalance evaluation |
| `GET` | `/api/score/calculate` | Calculate Yield Score from wallet data |
| `GET` | `/api/score/:wallet` | Fetch cached Yield Score for a wallet |
| `GET` | `/api/wallet/balance` | Token balances for a wallet address |
| `GET` | `/api/wallet/history` | Transaction history via Helius |
| `GET` | `/api/cron/monitor` | Automated position monitoring (cron endpoint) |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key for Claude AI |
| `HELIUS_API_KEY` | ✅ | Helius Enhanced RPC key |
| `BIRDEYE_API_KEY` | ☑️ | Birdeye API for real-time token prices |
| `UPSTASH_REDIS_REST_URL` | ☑️ | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | ☑️ | Upstash Redis token |
| `CRON_SECRET` | ☑️ | Secret to protect the `/api/cron/monitor` endpoint |

---

## Integrations

| Protocol | Role |
|---------|------|
| [Kamino Finance](https://kamino.finance) | Lending & stable yield ($2.8B TVL) |
| [Meteora DLMM](https://meteora.ag) | Concentrated liquidity LP positions |
| [Jupiter Aggregator](https://jup.ag) | Best-route swap execution & rebalancing |
| [Birdeye](https://birdeye.so) | Real-time token prices & portfolio valuation |
| [Helius](https://helius.dev) | Enhanced Solana RPC & transaction history |
| [Polymarket](https://polymarket.com) | Macro prediction market risk signals |

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request for significant changes.

```bash
# Lint
npm run lint

# Production build
npm run build
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
Built on Solana · Powered by Anthropic Claude · Open Source
</div>
