export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Roadmap</h1>
      <p className="mt-2 text-slate-600">Below is the curated checklist of milestones for JEM. If full docs are available they will appear here.</p>

      <ul className="mt-6 space-y-3">
        <li className="border p-4 rounded"><strong>Consensus design</strong> — PoE + VRF + Committee Finality</li>
        <li className="border p-4 rounded"><strong>Reference nodes</strong> — validator tooling and testnet</li>
        <li className="border p-4 rounded"><strong>Engagement tracker</strong> — consentful embed and SDKs</li>
        <li className="border p-4 rounded"><strong>Explorer & Wallet</strong> — block explorer and reference wallet</li>
        <li className="border p-4 rounded"><strong>Docs & Whitepaper</strong> — full protocol spec and developer guides</li>
      </ul>
    </div>
  )
}
