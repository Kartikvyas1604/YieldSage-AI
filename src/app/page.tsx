import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { StrategyTiersSection } from '@/components/landing/StrategyTiersSection';
import { ScoreJourneySection } from '@/components/landing/ScoreJourneySection';
import { SageTokenSection } from '@/components/landing/SageTokenSection';
import { TrustSection } from '@/components/landing/TrustSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <StrategyTiersSection />
      <ScoreJourneySection />
      <SageTokenSection />
      <TrustSection />
    </main>
  );
}
