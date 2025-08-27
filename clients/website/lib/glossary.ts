export const glossary: Record<string, string> = {
  "PoE-VRF":
    "Proof of Engagement + Verifiable Random Function: real user activity gives temporary 'tickets' (weight), and a cryptographic lottery (VRF) fairly picks block leaders.",
  PoE:
    "Proof of Engagement: a system where verified human actions mint temporary, decaying lottery chances (tickets) to propose blocks.",
  VRF:
    "Verifiable Random Function: produces a random output with a proof anyone can check—used to pick leaders/committees fairly.",
  epoch: "A fixed window of time in JEM. Engagement is measured per epoch and affects proposer weight.",
  slot: "A small time slice where a block proposer may produce a block.",
  consensus:
    "How the network agrees on the next block. JEM uses PoE + VRF and a HotStuff‑style committee finality.",
  committee:
    "A small VRF‑sampled validator group that signs and finalizes blocks.",
  finality:
    "When a block is confirmed and won't be reverted. JEM uses a HotStuff‑style two‑phase vote with aggregated signatures.",
  HotStuff: "A modern BFT protocol family with simple phases and clear safety/liveness properties.",
  quorum: "The minimum validator votes required to finalize a block.",
  "BLS aggregation":
    "A signature scheme that lets many validator signatures be combined into one compact proof.",
  ticket:
    "A cryptographic, non‑transferable 'lottery chance' minted from verified actions; decays over time.",
  weight: "Your per‑epoch block lottery strength, derived from valid tickets; capped and decays.",
  "honey pot":
    "A randomized bonus pool created from orphaned blocks; unlocks extra tickets when a hidden trigger occurs.",
  "orphaned block": "A valid block that lost a fork race; in JEM, orphans seed honey pot events.",
  "randomness beacon":
    "A public randomness source for leader/committee selection—derived from prior VRFs (or drand while bootstrapping).",
  "difficulty retarget":
    "Adjusting the selection threshold each epoch so block rate/emissions stay on target.",
  EMA: "Exponential Moving Average: a smoothing method JEM uses to avoid oscillations in difficulty.",
  "emission schedule": "How new JEMs are minted over time (leader/committee/honey‑pot/ecosystem splits).",
  mempool: "Pending transactions/tickets waiting to be included in a block.",
  "account model": "Balances live on accounts (addresses), not UTXOs—friendlier for wallets/programs.",
  "stateless client":
    "Sends lightweight 'witness' proofs so mobile clients don’t need full state.",
  "libp2p gossip": "Peer‑to‑peer messaging for blocks/tx/tickets; resilient and decentralized.",
  "RocksDB/Sled": "Embedded databases for node storage.",
  RPC: "JSON‑RPC: the HTTP API for wallets and apps to talk to a node.",
  GraphQL: "A flexible query API; JEM’s gateway can stream live blocks/tx.",
  SDK: "Developer toolkit to emit actions, handle quotas, and submit tickets.",
  "device attestation":
    "Proof from your OS/secure hardware that a device and action are genuine (WebAuthn/OS APIs).",
  "liveness check":
    "A lightweight proof you’re a real, present human (e.g., passkey prompt/biometric).",
  "mesh relay":
    "Forwarding actions over local radios (Bluetooth/Wi‑Fi) when offline—relays can earn tickets.",
  "proof of personhood":
    "Combining attestations/vouches to limit Sybil influence per human.",
  Sybil: "Many fake identities controlled by one actor; JEM limits them with caps/attestation.",
  slashing: "Penalties for validators who misbehave (e.g., double‑vote).",
  "rate limit / quota": "Per‑epoch caps and timing rules that prevent spam or runaway advantage.",
  drand: "A public randomness beacon network we can import while bootstrapping.",
  "beacon bias":
    "Trying to manipulate randomness; mitigated with VRF aggregation and committee rules.",
  BFT: "Byzantine Fault Tolerant consensus: continues working even if some nodes act maliciously.",
};

export const termList = Object.keys(glossary).sort((a, b) => a.localeCompare(b));
