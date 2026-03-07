/**
 * Protocol Integrations Section
 */

"use client";

import { CheckCircle2 } from "lucide-react";

const PROTOCOL_INTEGRATIONS = [
  {
    name: "Marginfi",
    category: "Lending",
    status: "live" as const,
    description: "Undercollateralized loans up to 80% LTV for score 750+",
  },
  {
    name: "Solend",
    category: "Lending",
    status: "live" as const,
    description: "Dynamic interest rates based on credit score",
  },
  {
    name: "Drift Protocol",
    category: "Perps",
    status: "coming-soon" as const,
    description: "Higher leverage limits for proven traders",
  },
  {
    name: "Kamino",
    category: "Yield",
    status: "coming-soon" as const,
    description: "Priority access to high-APY vaults",
  },
  {
    name: "Jupiter",
    category: "DEX",
    status: "coming-soon" as const,
    description: "Fee discounts based on trading behavior score",
  },
  {
    name: "Realms",
    category: "Governance",
    status: "coming-soon" as const,
    description: "Voting power multipliers for active participants",
  },
];

const USE_CASES = [
  {
    title: "Undercollateralized Lending",
    description: "Borrow $100 with only $70 collateral if you have a proven repayment history",
    benefit: "Unlock 30% more capital",
  },
  {
    title: "Dynamic Interest Rates",
    description: "Score 750+ qualifies for 3% APR vs 8% APR for unscored wallets",
    benefit: "Save 62% on interest",
  },
  {
    title: "Protocol Whitelists",
    description: "Gain priority access to exclusive vaults, token launches, and DAO opportunities",
    benefit: "Access restricted opportunities",
  },
  {
    title: "Fee Discounts",
    description: "10-25% fee reductions on trading, minting, and protocol interactions",
    benefit: "Lower transaction costs",
  },
];

export function ProtocolIntegrationsSection() {
  return (
    <section className="py-24 px-6 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-card/50 mb-6">
            <CheckCircle2 className="w-4 h-4 text-accent-green" />
            <span className="text-sm font-mono text-text-secondary">
              Protocol Partnerships
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Accepted Everywhere
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Your CredChain score unlocks better rates, more leverage, and
            exclusive access across Solana&apos;s top protocols.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className="p-8 rounded-2xl border border-border bg-bg-card hover:bg-bg-card-hover transition-all hover:-translate-y-1 duration-300"
            >
              <h3 className="text-xl font-display font-bold text-text-primary mb-3">
                {useCase.title}
              </h3>
              <p className="text-text-secondary mb-4">{useCase.description}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/20">
                <CheckCircle2 className="w-4 h-4 text-accent-green" />
                <span className="text-sm font-semibold text-accent-green">
                  {useCase.benefit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Protocol Logos Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-text-primary mb-8 text-center">
            Integrated Protocols
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {PROTOCOL_INTEGRATIONS.map((protocol) => (
              <div
                key={protocol.name}
                className="p-6 rounded-xl border border-border bg-bg-card hover:bg-bg-card-hover transition-colors group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-gold/20 mb-3 flex items-center justify-center">
                    <span className="text-xl font-bold text-accent-gold">
                      {protocol.name[0]}
                    </span>
                  </div>
                  <h4 className="font-bold text-text-primary mb-1">
                    {protocol.name}
                  </h4>
                  <p className="text-xs text-text-muted mb-2">
                    {protocol.category}
                  </p>
                  <div
                    className={`
                    px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      protocol.status === "live"
                        ? "bg-accent-green/10 text-accent-green"
                        : "bg-accent-blue/10 text-accent-blue"
                    }
                  `}
                  >
                    {protocol.status === "live" ? "LIVE" : "Q1 2025"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-text-secondary mb-6">
            Building a protocol?{" "}
            <a href="#" className="text-accent-blue hover:text-accent-blue-bright font-semibold">
              Integrate CredChain API
            </a>
          </p>
          <p className="text-sm text-text-muted">
            Query any wallet&apos;s score for just 0.1 $CRED per lookup
          </p>
        </div>
      </div>
    </section>
  );
}
