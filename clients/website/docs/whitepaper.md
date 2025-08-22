JEMs — Justify Every Moment
 Layer 1 Proof of Engagement Blockchain with VRF Leader Election,
 Orphan Honey Pot Rewards, and Modular Engagement SDK
 Draft v0.3 • August 19, 2025
Abstract
 JEMs is an energy aware Layer 1 blockchain where real human activity drives consensus weight.
 Instead of rewarding raw hash rate, JEMs issues cryptographic “hash tickets” for verified digital and
 real world actions (check ins, Bluetooth mesh relays, content interactions, landmark visits). Tickets
 increase a node’s probability of proposing the next block via a verifiable random function (VRF).
 Successful block proposers mint JEM tokens; orphaned blocks become randomized “honey pots” that
 later unlock bursts of bonus tickets upon unpredictable community actions. The system aligns
 incentives for living, connecting, and contributing—mining by engagement rather than by electricity.
 Official motto: Justify Every Moment. Alternative readings used contextually: Join Every Moment, Joy
 Every Moment, and Journey Every Mile.
1. Motivation & Background
 Conventional proof of work (PoW) rewards compute arms races; conventional proof of stake (PoS)
 risks plutocracy. JEMs proposes Proof of Engagement (PoE): a system where verifiable human
 actions mint temporary, decaying probability mass—hash tickets—used to win a VRF lottery for block
 production. The approach reduces waste, democratizes access (phone class devices can participate),
 and ties value to authentic participation.
 2. System Overview
 JEMs is a slot based, epoch grouped BFT finalizing chain. Each slot selects a leader with VRF
 under a difficulty target scaled by the node’s recent engagement weight. A small, VRF sampled
 committee signs the block with BLS aggregation for fast finality. Difficulty retargets each epoch to honor
 an emission timetable. Competing (orphaned) blocks seed honey pot events that later release bonus
 tickets when community triggers are met.
 3. Formal Definitions
 Epoch e: fixed length window of slots (e.g., 1 day).
 Slot s: fixed unit of time (e.g., 4 seconds) in which at most one block is produced.
 ActionEvent: an authenticated statement of an engagement action (like, check in, mesh relay, IRL visit).
 Ticket: cryptographic proof binding (actor, epoch) to a per epoch cap; represents a weighted lottery chance.
 Weight W_i: decaying function of recent valid tickets for identity i, clamped to W_max per epoch.
 VRF: verifiable random function producing (y, π) = VRF(sk, input); y is pseudo random, π is proof.
 Target T_e: per epoch difficulty target that regulates block rate/emission.
 Honey Pot: randomized, hidden bonus of tickets derived from orphan block seeds, unlocked by triggers.
 4. Consensus: PoE VRF
 4.1 Slot Leader Eligibility
 Each node i holds keys (sk , pk ). For slot s in epoch e with randomness beacon R , compute (y ,
 π ) = VRF(sk , H(e || s || R )). Interpret y as an integer in [0, 2²
 ). Node i is eligible leader if y <
 T × W , where W ∈ [0, W_max] is i’s engagement weight this epoch. Multiple eligible leaders can
 occur; BFT finality resolves forks and converts losers into honey pots.
 # Leader check (conceptual)
 input: epoch e, slot s, beacon R_e, target T_e, node engagement weight W_i
 (y, pi) = VRF(sk_i, H(e || s || R_e))
 eligible = (y < T_e * W_i)
 if eligible:
    propose_block(txs, tickets, hp_announcements, proof=pi)
 4.2 Committee Finality
 A VRF also samples a small validator committee per slot (e.g., 64 members) that attests to the
 proposed block. Members sign with BLS; signatures are aggregated. Two phase voting
 (prepare/commit) or HotStuff reduces to one aggregated signature per phase. Finality is reached when
 ≥ of committee stake (or reputation weighted participation) signs the commit certificate.
 4.3 Randomness
R derives from aggregated VRF outputs from the prior epoch (unbiasable under honest majority). As a
 fallback/interop, the protocol can import beacons (e.g., drand) while bootstrapping.
 5. Tickets: Minting, Decay, and Caps
 Users do not mint tokens from actions. Instead, actions mint tickets that temporarily increase W .
 Tickets are non transferable, expire with time, and are clamped per identity to cap influence. This
 ensures spam and botting cannot linearly translate to control.
 5.1 Action → Ticket Pipeline
 Client SDK emits ActionEvent:
  event = { actor_pk, kind, ts, meta_hash }
  proof_attest = DeviceAttestation(event)  # WebAuthn/OS attestation
  ticket = { actor_pk, epoch, salt, quota_sig, vrf_proof }
 Node verifies:
  - epoch bounds & per-epoch cap not exceeded
  - attestation valid (device / liveness)
  - event uniqueness (de-dup by meta hash/time)
  - signature/VRF proofs correct
 On accept:
  - add ticket to ticket_pool
  - update rolling weight W_i = min(W_max, decay(W_i) + w(kind))
 5.2 Decay Function
 Let W (e) be weight for identity i at the start of epoch e. Use exponential decay with additive action
 weights: W (e+1) = min(W_max, λ·W (e) + Σ w(action_k)), where λ ∈ (0,1) ensures recent
 engagement dominates. Typical λ ≈ 0.6–0.9.
 5.3 Per Identity Caps & Proof of Personhood
 Identity is anchored by multi factor proofs: device attestation (iOS/Android/Passkeys), periodic
 liveness checks, optional social vouching, and mesh witness claims. The protocol enforces per epoch
 ticket caps and per slot submission rate limits (hashes/sec).
 6. Orphaned Blocks → Honey Pots
 Competing blocks in a slot (or short forks) produce orphans. JEMs recycles each orphan into a
 randomized bonus event called a honey pot. The orphan’s header hash is combined with the chain
 beacon to derive a seed, defining size, expiry, and a trigger rule. When the trigger fires (a specific,
 unpredictable community action), a burst of bonus tickets is awarded.
 # Orphan -> Honey Pot
 seed = H(orphan_header || R_e)
 hp = {
  id: H(seed),
  bounty_tickets: f(size_from(seed)),   # e.g., 10k..100k
  expires_epoch: e + k,                  # lifetime k epochs
  trigger_rule: derive_rule(seed)        # e.g., "6th like today", "12th check-in"
 }
 publish(hp)  # metadata minimal until trigger
 on trigger(rule):
  award_tickets(actor_pk, hp.bounty_tickets)
  mark hp consumed
 Governance (JIP) controls distribution f(·), lifetime k, and trigger catalogs. Unused honey pots may roll
 forward at diminishing value or burn for deflation.
 7. Difficulty, Emission & Timetable
 The chain targets a block rate and long term emission schedule. At each epoch boundary, compute a
 new target T using observed production versus target. EMA style control avoids oscillations and
 reacts quickly to surges in engagement.
 # EMA-based difficulty retarget (conceptual)
 # target_blocks: desired blocks per epoch
 # produced_blocks: observed blocks in epoch e-1
 alpha = 0.25  # smoothing factor
 ratio = produced_blocks / target_blocks
 T_e = clamp(T_{e-1} * (1 / (alpha*ratio + (1-alpha))), T_min, T_max)
 Example reward split: 60% slot leader, 20% finality committee, 15% honey pot reserve, 5%
 ecosystem/bug bounty. Example total supply: 100,000,000 JEMs with smooth annual decay (~7%) or
 discrete halvings.
 8. Transactions, Fees, and State
 JEMs favors an account model for user friendly wallets and future programmability. Transactions pay
 minimal fees in JEMs. Fee rebates can reward relays/committee participation. Stateless client
 techniques (witness proofs) reduce mobile bandwidth.
 9. Network & Client Architecture
 9.1 Nodes
 Nodes use libp2p style gossip for blocks/txs/tickets/beacons. Storage via RocksDB/Sled. RPC
 exposes JSON RPC for wallets/SDK. Light clients submit tickets and txs, verify headers, and can be
 eligible leaders if online when selected.
 9.2 Engagement SDK (Universal Plugin)
 A modular SDK (Web, iOS, Android, server) standardizes ActionEvents, applies quotas, and provides
 device attestation. Offline mesh relays allow propagation without cloud connectivity and reward relays
 with tickets.
 SDK.emit(kind, metadata):
  event = {actor_pk, kind, ts, meta_hash}
  att = attest_device(event)       # WebAuthn/OS API
  tkt  = mint_ticket(event, att)   # bound to epoch, salted
  if within_quota(tkt):
      submit_ticket(tkt)
  else:
      queue_next_epoch(tkt)
 10. Privacy
 The SDK transmits event hashes rather than raw content by default. IRL verifications begin with coarse
 proofs (QR/NFC/witness) and evolve to zero knowledge proofs that attest presence within a time
 window without leaking coordinates. Honey pot triggers rely on global counters or anonymized
 thresholds to avoid deanonymization.
 11. Security Considerations
 Threats include Sybil farms, ticket spam, colluding committees, beacon bias, and client malware.
 Mitigations include strict per epoch caps, robust device attestation + liveness, randomized committee
 sampling with BLS aggregation, VRF based beacons, and security audits/bug bounties. Economic
 griefing is throttled by quotas and decay; honey pot sizing avoids runaway advantages.
 12. Governance: JIP (JEMs Improvement Protocol)
 On chain proposals adjust weights, caps, epoch/slot timing, honey pot rules, IRL catalogs, and
 emission splits. Voting weights combine stake and reputation (engagement history) with anti Sybil
 protections. Emergency councils (time locked) can patch critical issues.
 13. Reference Implementation (Engineering Prompt)
 A minimal Rust testnet demonstrates feasibility: libp2p networking, VRF leader selection, BLS finality,
 orphan→honey pot conversion, and an SDK stub.
 Language: Rust
 Crates: tokio, libp2p, blst, rand_chacha, serde, bincode, ed25519-dalek, (vrf crate), thiserror, clap, sled/rocksdb
 Node (jemsd):
 - Key mgmt: ed25519 + BLS
 - P2P: gossip blocks/txs/tickets/beacons
 - Types: ActionEvent, Ticket, Tx, BlockHeader, Block, HoneyPot
 - Pools: tx_pool, ticket_pool, hp_pool
 - Leader selection: VRF over (epoch||slot||beacon), threshold T_e * W_i
 - Committee finality: BLS aggregate, 2 phases
 - Difficulty: EMA retarget per epoch
 - Orphan handling: honey pot from orphan header + beacon
 - Storage: sled/rocksdb
 - RPC: submit_tx, submit_ticket, get_block, get_state, get_honeypots
 CLI:
 - init, run, wallet ops, actions emit (like|checkin|visit)
 Anti Sybil:
 - Per epoch ticket quotas, device attestation stubs, liveness checks
 Tests:
 - VRF gating, committee aggregation, orphan→honey pot flow, emission budget
 14. Roadmap
 Phase 1 — Local Testnet: VRF leader, committee, tickets & quotas, orphan→honey pot; SDK alpha.
 Phase 2 — Public Testnet: mobile/browser SDKs, device attestation, mesh relays, JIP governance
 MVP.
 Phase 3 — Mainnet Candidate: audits, parameter hardening, privacy upgrades (ZK IRL proofs), fee
 economics.
Phase 4 — Ecosystem: integrations (Canary, Dilemmr, third party), marketplaces, grants.
 15. Acknowledgments & Ethos
 JEMs is anchored in family and legacy: a system for Justifying Every Moment and leaving something
 meaningful behind. By turning moments into cryptographic chances—and chances into community
 value—we aim for a chain where living well and engaging honestly is the most profitable strategy.
15. Acknowledgments & Ethos
 JEMs is anchored in family and legacy: a system for Justifying Every Moment and leaving something
 meaningful behind. By turning moments into cryptographic chances—and chances into community
 value—we aim for a chain where living well and engaging honestly is the most profitable strategy.

