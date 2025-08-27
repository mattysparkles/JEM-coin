# JEMs — Justify Every Moment

Layer 1 Proof of Engagement Blockchain with VRF Leader Election, Orphan Honey Pot Rewards, and Modular Engagement SDK — Draft v0.3 • August 19, 2025

## Abstract

JEMs is an energy aware Layer 1 blockchain where real human activity drives consensus weight. Instead of rewarding raw hash rate, JEMs issues cryptographic “hash tickets” for verified digital and real world actions (check ins, Bluetooth mesh relays, content interactions, landmark visits). Tickets increase a node’s probability of proposing the next block via a verifiable random function (VRF). Successful block proposers mint JEM tokens; orphaned blocks become randomized “honey pots” that later unlock bursts of bonus tickets upon unpredictable community actions. The system aligns incentives for living, connecting, and contributing—mining by engagement rather than by electricity.

## 1. Motivation & Background

Conventional proof of work (PoW) rewards compute arms races; conventional proof of stake (PoS) risks plutocracy. JEMs proposes Proof of Engagement (PoE): a system where verifiable human actions mint temporary, decaying probability mass—hash tickets—used to win a VRF lottery for block production. The approach reduces waste, democratizes access (phone class devices can participate), and ties value to authentic participation.

## 2. System Overview

JEMs is a slot based, epoch grouped BFT finalizing chain. Each slot selects a leader with VRF under a difficulty target scaled by the node’s recent engagement weight. A small, VRF sampled committee signs the block with BLS aggregation for fast finality. Difficulty retargets each epoch to honor an emission timetable. Competing (orphaned) blocks seed honey pot events that later release bonus tickets when community triggers are met.

## 3. Formal Definitions

Definitions include Epoch, Slot, ActionEvent, Ticket, Weight, VRF, Target, and Honey Pot — see the repository spec for formal math. Tickets represent a weighted lottery chance and decay over time.

## 4. Consensus: PoE VRF

### 4.1 Slot Leader Eligibility

Each node computes a VRF over epoch/slot/beacon; if the VRF output is below the epoch target scaled by the node's engagement weight, the node may propose a block. Multiple eligible leaders can occur; BFT finality resolves forks and converts losers into honey pots.

### 4.2 Committee Finality

A VRF samples a small validator committee per slot that attests to the proposed block. Members sign with BLS; aggregated signatures produce efficient two-phase confirmation. Finality requires a threshold of committee participation.

### 4.3 Randomness

Randomness derives from aggregated VRF outputs from the prior epoch; drand or other beacons can bootstrap as needed.

## 5. Tickets: Minting, Decay, and Caps

Actions mint tickets (not tokens). Tickets increase engagement weight W, are non-transferable, expire, and are capped per identity to prevent spam.

## 6. Orphaned Blocks → Honey Pots

Orphaned blocks are recycled into honey pots: randomized bonuses derived from orphan headers and the beacon. Community triggers unlock bounty tickets when conditions are met.

## 7. Difficulty, Emission & Timetable

The chain targets block rate and emission schedule using an EMA retarget per epoch. Example splits: 60% leader, 20% finality committee, 15% honey pot, 5% ecosystem.

## 8. Transactions, Fees, and State

Account model, minimal fees, fee rebates for relays/committee, and stateless client techniques for mobile.

## 9. Network & Client Architecture

Nodes use libp2p-style gossip, RocksDB/Sled for storage, JSON-RPC for wallets. The Engagement SDK standardizes ActionEvents and device attestation.

## 10. Privacy

SDK transmits event hashes by default; IRL verifications start coarse and evolve to ZK proofs to protect location privacy.

## 11. Security Considerations

Mitigations include per-epoch caps, device attestation, randomized committees, VRF beacons, and audits.

## 12. Governance: JIP

On-chain proposals adjust protocol parameters; governance combines stake and reputation with anti-Sybil measures.

## 13. Reference Implementation

Minimal Rust testnet demonstrates feasibility (libp2p, VRF, BLS, orphan→honey pot, SDK stub). See repository crates and engineering notes for the reference layout.

## 14. Roadmap

Phases: Local Testnet → Public Testnet → Mainnet Candidate → Ecosystem. See the roadmap page for detailed milestones.

## 15. Acknowledgments & Ethos

JEMs aims to anchor community value in real engagement — Justify Every Moment.

[Repository and issues ↗](https://github.com/mattysparkles/JEM-coin)
