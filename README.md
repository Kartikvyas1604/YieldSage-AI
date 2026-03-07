# 🏆 CredChain AI — On-Chain Credit Intelligence

> **The World's First AI-Powered Credit Score on Solana**

---

## 🌟 Overview

**CredChain AI** is a revolutionary on-chain credit scoring system that uses Claude AI to analyze complete Solana wallet history and generate trustless credit scores (0-850). Like FICO for DeFi, but 100% transparent, verifiable, and on-chain.

### The Problem

Every DeFi lending protocol today requires **$150 collateral to borrow $100**. 

- **$50 TRILLION** in value is locked up unnecessarily
- No credit history exists on-chain
- Good borrowers pay for bad actors' defaults
- Capital inefficiency kills DeFi adoption

### The Solution

CredChain reads your complete on-chain history and proves your trustworthiness with a verifiable, AI-generated credit score, unlocking:

✅ **Undercollateralized loans** (borrow $100 with $80 collateral)  
✅ **Lower interest rates** (3% vs 8% for unscored users)  
✅ **Exclusive protocol access** (DAO whitelists, token launches)  
✅ **Portable reputation** (soulbound NFT credential)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Phantom wallet (for live mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/credchain-ai
cd credchain-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Run development server
npm run dev
```

Visit **http://localhost:3000** to see the app!

---

## ✨ Demo Mode

**Demo mode is enabled by default** — no API keys or wallet connection required!

The demo showcases a realistic wallet profile:

- **Wallet**: Sarah Chen (fictional user)
- **Score**: 742 (GOOD tier)
- **History**: 547 days of on-chain activity
- **Loans**: 4 perfectly repaid (0 liquidations)
- **Trading**: 234 trades with $45K profit
- **LP**: 3 positions with 89% capital efficiency

Toggle demo mode in the dashboard to connect your real wallet.

---

## 📊 Scoring Methodology

CredChain analyzes **20 on-chain signals** across 5 categories to generate a 0-850 score:

| Category | Weight | Key Signals |
|----------|--------|-------------|
| **Loan Repayment** | 30% | Repayment rate, liquidation count, debt-to-income ratio, loan diversity |
| **Wallet Maturity** | 20% | Account age, transaction consistency, balance stability, tenure score |
| **Trading Behavior** | 20% | Win rate, risk-adjusted returns, position sizing, avg hold time |
| **LP Commitment** | 15% | Liquidity duration, impermanent loss handling, capital efficiency |
| **Community** | 15% | Governance participation, DAO contributions, reputation |

### Score Tiers

| Score | Tier | Description | Benefits |
|-------|------|-------------|----------|
| 0-549 | 🔴 Poor | High risk, limited DeFi usage | No benefits |
| 550-649 | 🟡 Fair | Some responsible behavior | 5-10% fee discounts |
| 650-749 | 🟢 Good | Consistent, trustworthy history | 80% LTV loans, priority support |
| 750-850 | 💎 Excellent | Exceptional DeFi citizen | 70% LTV, 3% interest, DAO whitelist |

---

## 🪙 $CRED Token Utility

The native token powers the entire CredChain ecosystem:

### Earn $CRED
- ✅ Mint your first score (+100 $CRED)
- ✅ Maintain excellent score (+50 $CRED/month)
- ✅ Refer new users (+25 $CRED per referral)
- ✅ Report fraud (+200 $CRED bounty)

### Spend $CRED
- 🔓 **Starter Tier** (50 $CRED/month): 3 analyses/month
- 🔓 **Pro Tier** (200 $CRED/month): Unlimited analyses + comparisons
- 🔓 **Elite Tier** (500 $CRED/month): Priority AI, API access, custom alerts

### Protocol Revenue
Protocols pay **0.1 $CRED per score query** to integrate CredChain data into their lending logic.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Dashboard                          │
│              (Next.js 14 + Tailwind + Framer)               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Routes (Next.js)                       │
│  • /api/analyze → Trigger AI analysis (SSE stream)          │
│  • /api/score/calculate → Compute final score               │
│  • /api/nft/mint → Mint credential NFT                      │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│              AI Agent (Claude Sonnet 4)                      │
│  1. OBSERVE → Fetch wallet data via tools                   │
│  2. THINK → Analyze patterns & detect risks                 │
│  3. SCORE → Calculate 20 signals → 0-850 score             │
│  4. MINT → Generate soulbound NFT credential                │
│  5. RETURN → Stream reasoning back to UI                   │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Sources                              │
│  • Helius RPC → Full transaction history                    │
│  • Birdeye API → Token prices & trading data                │
│  • Marginfi SDK → Loan positions & repayments               │
│  • Solend SDK → Additional loan data                        │
│  • Jupiter API → DEX trades & swap history                  │
│  • Metaplex → NFT holdings & activity                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router, Server Components, SSE streaming)
- **TypeScript** (strict mode, comprehensive types)
- **Tailwind CSS v4** (utility-first, custom design system)
- **Framer Motion** (smooth animations, page transitions)
- **Lucide React** (icon library)
- **Recharts** (score visualizations)

### Blockchain
- **@solana/web3.js** (blockchain interactions)
- **@solana/wallet-adapter-react** (wallet connection)
- **@metaplex-foundation/js** (NFT minting)
- **Helius RPC** (enriched transaction data)
- **Marginfi SDK** (lending protocol integration)

### AI & Backend
- **@anthropic-ai/sdk** (Claude Sonnet 4 with tool use)
- **Upstash Redis** (caching, rate limiting)
- **Pinecone** (vector similarity search for comparisons)
- **Birdeye API** (real-time token prices)

---

## 📡 API Documentation

### POST /api/analyze

Trigger AI analysis for a wallet address.

**Request:**
```json
{
  "walletAddress": "7xKXt...abc123",
  "demoMode": false
}
```

**Response:** Server-Sent Events (SSE) stream

```
event: reasoning
data: {"category":"loan_repayment","signal":"perfect_repayment_rate","value":1.0,"impact":"positive"}

event: score
data: {"score":742,"tier":"GOOD","categories":{...}}

event: complete
data: {"success":true}
```

### GET /api/score/[wallet]

Public endpoint for protocols to query scores.

**Response:**
```json
{
  "score": 742,
  "tier": "GOOD",
  "timestamp": 1734526800000,
  "credentialAddress": "nft_abc123...",
  "verified": true
}
```

### POST /api/nft/mint

Mint a soulbound credential NFT.

**Request:**
```json
{
  "walletAddress": "7xKXt...abc123",
  "score": 742,
  "metadata": {...}
}
```

**Response:**
```json
{
  "success": true,
  "nftAddress": "nft_xyz789...",
  "explorerUrl": "https://solscan.io/token/nft_xyz789..."
}
```

---

## 🎨 Design System

**Color Palette:**
- **Background**: Near-black (#050810, #0a1628, #0f1f3a)
- **Accent**: Gold (#c9a84c, #d4af37, #f4d03f)
- **Primary Action**: Blue (#3b7dd8, #4a90e2)
- **Success**: Green (#10b981, #34d399)
- **Warning**: Amber (#f59e0b, #fbbf24)
- **Error**: Red (#ef4444, #f87171)

**Typography:**
- **Display**: Playfair Display (luxury serif for headlines)
- **Body**: DM Sans (clean sans-serif for UI)
- **Monospace**: JetBrains Mono (for scores, data, addresses)

**Effects:**
- Glassmorphism cards with `backdrop-blur-xl`
- Animated gradient backgrounds
- Glow effects on score components
- Grain texture overlay (3% opacity)
- Smooth number counting animations

---

## 🔒 Security & Privacy

### Privacy First
- **Zero PII**: We never store names, emails, or KYC data
- **Public data only**: Analysis uses publicly available blockchain data
- **User control**: Users can delete their score NFT anytime
- **Opt-in**: Credential minting is optional

### Smart Contract Security
- **Non-transferable NFTs**: Soulbound credentials (no selling/transferring)
- **Upgradeable logic**: Score calculation can evolve via governance
- **Rate limiting**: Prevents spam and abuse
- **Audit ready**: Code designed for professional security review

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ AI-powered scoring engine
- ✅ Demo mode with realistic data
- ✅ Landing page and dashboard
- ✅ Core UI components
- ⏳ API routes and backend integration
- ⏳ Soulbound NFT minting

### Phase 2: Mainnet Launch (Q2 2025)
- Protocol integrations (Marginfi, Solend, Drift)
- $CRED token launch via DeAura
- Real-time score updates
- Mobile app (React Native)

### Phase 3: Expansion (Q3 2025)
- Multi-chain support (Ethereum, Base, Arbitrum)
- Credit score marketplace (lenders bid on borrowers)
- AI explainability dashboard
- Reputation-as-a-Service API

### Phase 4: DAO Transition (Q4 2025)
- Governance token migration
- Community-driven signal weighting
- Protocol revenue sharing
- Decentralized dispute resolution

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick Links:**
- Report bugs: [GitHub Issues](https://github.com/your-username/credchain-ai/issues)
- Request features: [Discussions](https://github.com/your-username/credchain-ai/discussions)
- Join Discord: [CredChain Community](https://discord.gg/credchain)

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with love by the CredChain team for the Solana Builder House Hackathon 2024.

Special thanks to:
- **Anthropic** for Claude AI
- **Helius** for best-in-class Solana RPC
- **Marginfi** for lending protocol support
- **Solana Foundation** for grants and mentorship

---

## 📬 Contact

- **Website**: https://credchain.ai (coming soon)
- **Twitter**: [@CredChainAI](https://twitter.com/CredChainAI)
- **Email**: team@credchain.ai
- **Discord**: [Join our community](https://discord.gg/credchain)

---

Made with 💙 on Solana
