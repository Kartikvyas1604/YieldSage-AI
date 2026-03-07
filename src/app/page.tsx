import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ScoreFactorsSection } from '@/components/landing/ScoreFactorsSection';
import { TokenUtilitySection } from '@/components/landing/TokenUtilitySection';
import { ProtocolIntegrationsSection } from '@/components/landing/ProtocolIntegrationsSection';
import { CTASection } from '@/components/landing/CTASection';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg-primary text-text-primary selection:bg-accent-blue/30 selection:text-white">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <ScoreFactorsSection />
      <TokenUtilitySection />
      <ProtocolIntegrationsSection />
      <CTASection />
    </main>
  );
}
