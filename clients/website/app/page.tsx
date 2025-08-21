import Hero from '@/components/Hero';
import FeatureGrid from '@/components/FeatureGrid';
import HowItWorks from '@/components/HowItWorks';

const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL;

export default function Page() {
  return (
    <main>
      <Hero explorerUrl={explorerUrl} />
      <FeatureGrid />
      <HowItWorks />
    </main>
  );
}
