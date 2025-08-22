/* eslint-disable react/no-unescaped-entities */
export default function WhitepaperPage() {
  return (
    <article className="prose prose-slate max-w-4xl mx-auto px-4 py-12">
      <h1>JEMs — Justify Every Moment</h1>
      <p className="lead">Layer 1 Proof of Engagement Blockchain with VRF Leader Election, Orphan Honey Pot Rewards, and Modular Engagement SDK — Draft v0.3 • August 19, 2025</p>

      <h2>Abstract</h2>
      <p>JEMs is an energy aware Layer 1 blockchain where real human activity drives consensus weight. Instead of rewarding raw hash rate, JEMs issues cryptographic “hash tickets” for verified digital and real world actions (check ins, Bluetooth mesh relays, content interactions, landmark visits). Tickets increase a node’s probability of proposing the next block via a verifiable random function (VRF). Successful block proposers mint JEM tokens; orphaned blocks become randomized “honey pots” that later unlock bursts of bonus tickets upon unpredictable community actions. The system aligns incentives for living, connecting, and contributing—mining by engagement rather than by electricity.</p>

      <h2>1. Motivation & Background</h2>
      <p>Conventional proof of work (PoW) rewards compute arms races; conventional proof of stake (PoS) risks plutocracy. JEMs proposes Proof of Engagement (PoE): a system where verifiable human actions mint temporary, decaying probability mass—hash tickets—used to win a VRF lottery for block production. The approach reduces waste, democratizes access (phone class devices can participate), and ties value to authentic participation.</p>

      <h2>2. System Overview</h2>
      <p>JEMs is a slot based, epoch grouped BFT finalizing chain. Each slot selects a leader with VRF under a difficulty target scaled by the node’s recent engagement weight. A small, VRF sampled committee signs the block with BLS aggregation for fast finality. Difficulty retargets each epoch to honor an emission timetable. Competing (orphaned) blocks seed honey pot events that later release bonus tickets when community triggers are met.</p>

      <h2>3. Formal Definitions</h2>
      <p>Definitions include Epoch, Slot, ActionEvent, Ticket, Weight, VRF, Target, and Honey Pot — see the repository spec for formal math. Tickets represent a weighted lottery chance and decay over time.</p>

      <h2>4. Consensus: PoE VRF</h2>
      <h3>4.1 Slot Leader Eligibility</h3>
      <p>Each node computes a VRF over epoch/slot/beacon; if the VRF output is below the epoch target scaled by the node's engagement weight, the node may propose a block. Multiple eligible leaders can occur; BFT finality resolves forks and converts losers into honey pots.</p>

      <h3>4.2 Committee Finality</h3>
      <p>A VRF samples a small validator committee per slot that attests to the proposed block. Members sign with BLS; aggregated signatures produce efficient two-phase confirmation. Finality requires a threshold of committee participation.</p>

      <h3>4.3 Randomness</h3>
      <p>Randomness derives from aggregated VRF outputs from the prior epoch; drand or other beacons can bootstrap as needed.</p>

      <h2>5. Tickets: Minting, Decay, and Caps</h2>
      <p>Actions mint tickets (not tokens). Tickets increase engagement weight W, are non-transferable, expire, and are capped per identity to prevent spam.</p>

      <h2>6. Orphaned Blocks → Honey Pots</h2>
      <p>Orphaned blocks are recycled into honey pots: randomized bonuses derived from orphan headers and the beacon. Community triggers unlock bounty tickets when conditions are met.</p>

      <h2>7. Difficulty, Emission & Timetable</h2>
      <p>The chain targets block rate and emission schedule using an EMA retarget per epoch. Example splits: 60% leader, 20% finality committee, 15% honey pot, 5% ecosystem.</p>

      <h2>8. Transactions, Fees, and State</h2>
      <p>Account model, minimal fees, fee rebates for relays/committee, and stateless client techniques for mobile.</p>

      <h2>9. Network & Client Architecture</h2>
      <p>Nodes use libp2p-style gossip, RocksDB/Sled for storage, JSON-RPC for wallets. The Engagement SDK standardizes ActionEvents and device attestation.</p>

      <h2>10. Privacy</h2>
      <p>SDK transmits event hashes by default; IRL verifications start coarse and evolve to ZK proofs to protect location privacy.</p>

      <h2>11. Security Considerations</h2>
      <p>Mitigations include per-epoch caps, device attestation, randomized committees, VRF beacons, and audits.</p>

      <h2>12. Governance: JIP</h2>
      <p>On-chain proposals adjust protocol parameters; governance combines stake and reputation with anti-Sybil measures.</p>

      <h2>13. Reference Implementation</h2>
      <p>Minimal Rust testnet demonstrates feasibility (libp2p, VRF, BLS, orphan→honey pot, SDK stub). See repository crates and engineering notes for the reference layout.</p>

      <h2>14. Roadmap</h2>
      <p>Phases: Local Testnet → Public Testnet → Mainnet Candidate → Ecosystem. See the roadmap page for detailed milestones.</p>

      <h2>15. Acknowledgments & Ethos</h2>
      <p>JEMs aims to anchor community value in real engagement — Justify Every Moment.</p>

      <div className="mt-6">
        <a href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mattysparkles/JEM-coin'} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-900 text-white rounded">View full spec on GitHub</a>
      </div>
    </article>
  )
}
