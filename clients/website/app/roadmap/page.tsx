export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Roadmap</h1>
      <p className="mt-2 text-slate-600">Below is a curated set of milestones and technical tasks derived from the protocol spec and repository. Progress is grouped into phases with measurable engineering targets.</p>

      <section className="mt-6 space-y-4">
        <div className="border p-4 rounded">
          <h3 className="font-semibold">Phase 1 — Local Testnet</h3>
          <ul className="list-disc pl-5 mt-2 text-slate-700">
            <li>VRF leader selection and ticket-weighted eligibility</li>
            <li>Basic committee sampling + BLS aggregation for commits</li>
            <li>Ticket minting pipeline (ActionEvent → ticket) and per-epoch caps</li>
            <li>Orphan → honey pot conversion and simple trigger mechanics</li>
            <li>Reference nodes, CLI and test harness (Rust)</li>
          </ul>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold">Phase 2 — Public Testnet</h3>
          <ul className="list-disc pl-5 mt-2 text-slate-700">
            <li>Mobile/browser SDK alpha (ActionEvent schema, attestation hooks)</li>
            <li>Device attestation and liveness checks integration</li>
            <li>Explorer, reference wallet, and GraphQL endpoints</li>
            <li>Validator onboarding program and early engagement cohort</li>
          </ul>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold">Phase 3 — Mainnet Candidate</h3>
          <ul className="list-disc pl-5 mt-2 text-slate-700">
            <li>Audits, parameter hardening, and consensus performance tuning</li>
            <li>Privacy upgrades (ZK IRL proofs) and advanced anti‑Sybil tooling</li>
            <li>Economic design: emission schedule, honey pot sizing, fee rebates</li>
            <li>Operations: monitoring, observability, and runbooks for validators</li>
          </ul>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold">Phase 4 — Ecosystem</h3>
          <ul className="list-disc pl-5 mt-2 text-slate-700">
            <li>Integrations with third-party apps and marketplaces</li>
            <li>Grants, SDK extensions and developer tooling</li>
            <li>Governance (JIP) process and on-chain parameter upgrades</li>
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Technical Milestones (from repo)</h2>
        <p className="text-slate-700 mt-2">The repo contains reference implementations and engineering prompts for a Rust node (libp2p, VRF, BLS), SDK stubs, and RPC schemas. Key tests target VRF gating, committee aggregation, orphan→honey pot conversion, and emission budgeting.</p>
      </section>
    </div>
  )
}
