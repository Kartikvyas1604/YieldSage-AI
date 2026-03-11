'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question1Duration } from '@/components/onboard/Question1Duration';
import { Question2Risk } from '@/components/onboard/Question2Risk';
import { Question3Goal } from '@/components/onboard/Question3Goal';
import { StrategyPreview } from '@/components/onboard/StrategyPreview';
import type { OnboardingAnswers } from '@/types/strategy';

export default function OnboardPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const router = useRouter();

  const handleDuration = (months: number) => {
    setAnswers(a => ({ ...a, durationMonths: months }));
    setStep(2);
  };
  const handleRisk = (tolerance: number) => {
    setAnswers(a => ({ ...a, lossTolerance: tolerance }));
    setStep(3);
  };
  const handleGoal = (goal: OnboardingAnswers['goal']) => {
    setAnswers(a => ({ ...a, goal }));
    setStep(4);
  };
  const handleDeploy = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-16">
      {/* Progress bar */}
      <div className="fixed top-16 inset-x-0 z-40 h-1 bg-border">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%`, background: 'var(--accent-sage)' }}
        />
      </div>

      {step === 1 && <Question1Duration onNext={handleDuration} />}
      {step === 2 && (
        <Question2Risk
          onNext={handleRisk}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Question3Goal
          onNext={handleGoal}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && answers.durationMonths && answers.lossTolerance && answers.goal && (
        <StrategyPreview
          answers={answers as OnboardingAnswers}
          onDeploy={handleDeploy}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
}
