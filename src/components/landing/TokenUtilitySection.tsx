/**
 * TokenUtility Section - $CRED token use cases
 */

"use client";

import { Coins, TrendingUp, Zap, Shield } from "lucide-react";
import { GlowCard } from "../ui/GlowCard";

const TOKEN_TIERS = [
  {
    name: "Free",
    cost: "0 $CRED",
    features: ["1 analysis per month", "Basic score breakdown", "Community access"],
    color: "border-text-muted",
  },
  {
    name: "Starter",
    cost: "50 $CRED/mo",
    features: ["3 analyses per month", "Detailed reasoning", "Score history", "Priority support"],
    color: "border-accent-blue",
    popular: false,
  },
  {
    name: "Pro",
    cost: "200 $CRED/mo",
    features: [
      "Unlimited analyses",
      "Score comparisons",
      "Improvement simulator",
      "Email alerts",
      "Priority support",
    ],
    color: "border-accent-gold",
    popular: true,
  },
  {
    name: "Elite",
    cost: "500 $CRED/mo",
    features: [
      "Everything in Pro",
      "API access",
      "Custom alerts",
      "White-label embeds",
      "Dedicated support",
    ],
    color: "border-accent-gold-bright",
    popular: false,
  },
];

const EARN_METHODS = [
  {
    icon: Shield,
    action: "Mint Your Score",
    reward: "+100 $CRED",
    description: "One-time reward for creating your first credential",
  },
  {
    icon: TrendingUp,
    action: "Maintain Excellence",
    reward: "+50 $CRED/month",
    description: "Monthly reward for scores above 750",
  },
  {
    icon: Users,
    action: "Refer Friends",
    reward: "+25 $CRED/referral",
    description: "Earn when your referrals mint their score",
  },
  {
    icon: Zap,
    action: "Report Fraud",
    reward: "+200 $CRED",
    description: "Bounty for identifying fake scores (verified)",
  },
];

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function TokenUtilitySection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-card/50 mb-6">
            <Coins className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-mono text-text-secondary">
              $CRED Token
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Earn, Spend, Govern
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            The $CRED token powers the CredChain ecosystem. Earn by contributing,
            spend on premium features, and govern the protocol&apos;s future.
          </p>
        </div>

        {/* Earn Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-bold text-text-primary mb-8 text-center">
            How to Earn $CRED
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EARN_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.action}
                  className="p-6 rounded-2xl border border-border bg-bg-card hover:bg-bg-card-hover transition-colors"
                >
                  <div className="p-3 rounded-xl bg-accent-gold/10 w-fit mb-4">
                    <Icon className="w-6 h-6 text-accent-gold" />
                  </div>
                  <h4 className="font-bold text-text-primary mb-1">
                    {method.action}
                  </h4>
                  <p className="text-2xl font-mono font-bold text-accent-gold mb-3">
                    {method.reward}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {method.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tiers Section */}
        <div>
          <h3 className="text-2xl font-display font-bold text-text-primary mb-8 text-center">
            Premium Tiers
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOKEN_TIERS.map((tier) => (
              <GlowCard
                key={tier.name}
                glowColor={tier.popular ? "gold" : undefined}
                className={`relative ${tier.color} ${tier.popular ? "scale-105" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent-gold-bright to-accent-gold text-xs font-bold text-bg-primary">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-text-primary mb-2">
                    {tier.name}
                  </h4>
                  <p className="text-3xl font-mono font-bold text-accent-gold">
                    {tier.cost}
                  </p>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue/50 mt-2 flex-shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-text-muted mb-4">
            Token launch via{" "}
            <span className="text-accent-gold font-bold">DeAura</span>{" "}
            (Jupiter&apos;s launchpad) — Q2 2025
          </p>
          <p className="text-xs text-text-muted">
            50% of protocol revenue used to buy & burn $CRED
          </p>
        </div>
      </div>
    </section>
  );
}
