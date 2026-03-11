/**
 * POST /api/agent/onboard
 * Process onboarding answers and return a strategy recommendation
 */

import { NextRequest, NextResponse } from 'next/server';
import { STRATEGIES, estimateEarnings } from '@/lib/agent/strategies';
import type { OnboardingAnswers, StrategyRecommendation } from '@/types/strategy';

function pickStrategy(answers: OnboardingAnswers): string {
  if (answers.goal === 'safety' || answers.lossTolerance <= 2) return 'CONSERVATIVE';
  if (answers.lossTolerance <= 3) return 'BALANCED';
  return 'BALANCED'; // default — user must earn GROWTH via score
}

export async function POST(request: NextRequest) {
  let body: { answers?: OnboardingAnswers; capitalUsd?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { answers, capitalUsd = 1000 } = body;

  if (!answers || typeof answers.durationMonths !== 'number' || typeof answers.lossTolerance !== 'number' || !answers.goal) {
    return NextResponse.json({ error: 'Invalid onboarding answers' }, { status: 400 });
  }

  if (capitalUsd < 0 || capitalUsd > 10_000_000) {
    return NextResponse.json({ error: 'Invalid capital amount' }, { status: 400 });
  }

  const key      = pickStrategy(answers);
  const strategy = STRATEGIES[key];
  const midAPY   = (strategy.targetAPY.min + strategy.targetAPY.max) / 2;
  const earnings = estimateEarnings(capitalUsd, midAPY);

  const recommendation: StrategyRecommendation = {
    strategy,
    reasoning: `Based on your ${answers.durationMonths}-month horizon, risk tolerance of ${answers.lossTolerance}/5, and goal of "${answers.goal}", we recommend ${strategy.name}.`,
    estimatedMonthlyEarnings: earnings.monthly,
    estimatedYearlyEarnings:  earnings.yearly,
    confidence: 0.85,
    riskWarnings: strategy.riskLevel >= 4
      ? ['Higher strategies carry impermanent loss risk', 'AI may exit during high volatility']
      : ['All strategies include auto-exit guardrails'],
  };

  return NextResponse.json({ recommendation });
}
