# YieldSage AI — Automated DeFi Yield for Everyone

> The AI agent that grows your crypto savings on autopilot — no experience needed.

---

## What is YieldSage AI?

YieldSage AI is a DeFi yield automation platform on Solana that lets anyone — even complete beginners — earn passive income from DeFi. You answer 3 questions, and an AI agent does everything else: picks your strategy, deploys your capital, monitors positions 24/7, auto-compounds fees, and exits bad trades automatically.

**Key differentiator:** A unique Yield Score (like a DeFi credit score) that tracks your patience and discipline as an investor, unlocking better strategies over time.

---

## Features

- AI Agent: Claude claude-3-5-haiku-20241022 analyzes your on-chain history and picks the optimal strategy
- Yield Score: 0-850 score measuring consistency, patience, responsibility, and engagement  
- 3-Strategy System: Conservative (12% APY), Balanced (18% APY), Growth (28% APY)
- Auto-Rebalance: Agent monitors every 4 hours and shifts capital to highest-yield pools
- Emergency Stop: One-click pause or full withdrawal at any time
- Demo Mode: Full interactive demo — no wallet required
- Mobile Responsive: Works seamlessly on any device

---

## Architecture

```
Next.js App Router
├── Landing Page (6 sections)
├── Onboarding (3-step quiz)
├── Dashboard (7 cards + score/history/settings pages)
└── API Routes
    ├── /api/agent/{analyze,onboard,deploy,rebalance}
    ├── /api/score/{calculate,[wallet]}
    ├── /api/wallet/{balance,history}
    └── /api/cron/monitor

AI Engine: Anthropic Claude claude-3-5-haiku-20241022 (SSE streaming)
Solana: Helius RPC + Kamino Finance + Meteora DLMM + Jupiter Aggregator
```

---

## Quick Start

1. Clone and install:
```bash
git clone https://github.com/your-username/yieldsage-ai
cd yieldsage-ai
npm install
```

2. Copy env vars:
```bash
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY and HELIUS_API_KEY
```

3. Run dev server:
```bash
npm run dev
```

Open http://localhost:3000 and click "Try Demo" for the full experience without a wallet.

---

## Yield Score System

The YieldSage Score (0-850) is calculated from four behavioral metrics:

| Category | Max Points | Measures |
|----------|-----------|---------|
| Consistency | 297 | Days in protocol, monthly activity, no panic withdrawals |
| Patience | 213 | Avg position duration, time in market |
| Responsibility | 150 | No liquidations, reasonable leverage |
| Engagement | 140 | Protocols used, governance participation |

| Tier | Score | Unlocks |
|------|-------|---------|
| New | 0-299 | Conservative strategy only |
| Building | 300-499 | + Balanced strategy access |
| Fair | 500-649 | + Growth strategy access |
| Good | 650-749 | + Lower fees, priority support |
| Excellent | 750+ | + Full protocol access, best rates |

---

## Strategy Tiers

### Conservative — 10-14% APY
- Protocol: Kamino Finance USDC-USDT stable pool
- Risk: Level 1/5 — near-zero impermanent loss
- Rebalance: Weekly

### Balanced Growth — 15-22% APY
- Protocol: Kamino 60% + Meteora DLMM 40%
- Risk: Level 2/5 — low impermanent loss
- Rebalance: Daily

### Aggressive Growth — 22-35% APY
- Protocol: Meteora DLMM high-volume pools
- Risk: Level 3/5 — moderate impermanent loss
- Rebalance: Every 4 hours

---

## API Reference

POST /api/agent/analyze — Stream AI analysis (SSE)
POST /api/agent/onboard — Get strategy recommendation
GET  /api/score/:wallet — Fetch yield score
GET  /api/wallet/balance?address=... — Wallet balances
GET  /api/wallet/history?address=... — Transaction history
GET  /api/cron/monitor — Automated position monitoring

---

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript 5
- Styling: Tailwind CSS v4 with custom CSS design system
- AI: Anthropic Claude claude-3-5-haiku-20241022 (SSE streaming)
- Blockchain: Solana (@solana/web3.js, @solana/wallet-adapter-react)
- Data: Helius Enhanced RPC API
- Charts: Recharts

---

## License

MIT — Built for the Solana AI Hackathon 2025.
