import Hero from '@/components/Hero';
import FeatureGrid from '@/components/FeatureGrid';
import HowItWorks from '@/components/HowItWorks';

const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "JEM",
      "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://jemcoins.com',
      "description": 'JEM is a PoE-VRF blockchain where real user activity fuels consensus.'
    },
    {
      "@type": "Organization",
      "name": "JEM",
      "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://jemcoins.com',
      "sameAs": [process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mattysparkles/JEM-coin']
    }
  ]
}

export default function Page() {
  return (
    <main>
      {/* Structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Hero explorerUrl={explorerUrl} />
      <FeatureGrid />
      <HowItWorks />

      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center p-6 border rounded-2xl">
          <h3 className="text-xl font-semibold">Early Engagement Validators</h3>
          <p className="text-slate-600 mt-2">Help shape the network. Run nodes, provide feedback, and earn early rewards. We’re selecting a small cohort with diverse infra and time zones.</p>
          <div className="mt-4">
            <a href="/validators" className="px-4 py-2 bg-slate-900 text-white rounded">Apply →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
