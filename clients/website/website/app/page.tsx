import Tooltip from '@/components/Tooltip';

export default function Page(){
  const github = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mattysparkles/JEM-coin';
  return (
    <main>
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">JEM — Justify Every Moment</h1>
          <p className="mt-3 text-base md:text-lg text-gray-600">Proof of Engagement, not Proof of Work — a people‑first, energy‑conscious consensus.</p>
          <p className="mt-6 text-lg text-gray-700">JEM turns verified human actions into temporary, decaying “tickets.” These tickets provide fair, spam‑resistant weight in a verifiable randomness (<Tooltip term="VRF">VRF</Tooltip>) lottery that selects block proposers and committees.</p>
        <div className="mt-8 flex justify-center gap-4">
            <a href={github} target="_blank" rel="noreferrer" className="px-6 py-3 border rounded-md">View on GitHub</a>
            <a href="/whitepaper" className="px-6 py-3 bg-blue-600 text-white rounded-md">Read the Whitepaper</a>
            <a href="/docs" className="px-6 py-3 border rounded-md">Browse Docs</a>
            <a href="/join" className="px-6 py-3 bg-blue-600 text-white rounded-md">Join the Waitlist</a>
            <a href="/validators" className="px-6 py-3 border rounded-md">Apply as Validator</a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl shadow">
            <h3 className="font-semibold mb-2">PoE‑VRF Consensus</h3>
            <p className="text-gray-700">Blocks proposed via verifiable randomness (VRF) weighted by engagement—spam‑resistant, fair, and measurable.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow">
            <h3 className="font-semibold mb-2">Committee Finality</h3>
            <p className="text-gray-700">HotStuff‑style finality gives fast, deterministic confirmation with slashing for misbehavior.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow">
            <h3 className="font-semibold mb-2">Built for Builders</h3>
            <p className="text-gray-700">Clean JSON‑RPC & GraphQL, reference wallet, and an on‑site engagement tracker you can embed.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">How Proof of Engagement works</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li><strong>Opt‑in, consentful signals</strong> — users or apps opt in via a lightweight tracker or wallet. Events are signed, rate‑limited, and auditable.</li>
            <li><strong>Decaying tickets</strong> — valid actions mint short‑lived tickets with a half‑life. Fresh participation matters more; hoarding doesn’t help.</li>
            <li><strong>VRF‑weighted selection</strong> — a <Tooltip term="VRF">VRF</Tooltip> lottery selects proposers and committees with probability proportional to current tickets.</li>
            <li><strong>Fast finality</strong> — a HotStuff‑style committee aggregates signatures to finalize blocks quickly and slash misbehavior.</li>
          </ol>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">Early Engagement Validators</h2>
          <p className="text-gray-700">Help shape the network. Run nodes, provide feedback, and earn early rewards. We’re selecting a small cohort with diverse infra and time zones. <a href="/validators" className="text-blue-600">Apply →</a></p>
        </div>
      </section>

    </main>
  );
}
