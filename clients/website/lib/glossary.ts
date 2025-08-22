export const GLOSSARY: Record<string, string> = {
  'PoE-VRF': "Proof of Engagement + Verifiable Random Function: real user activity gives temporary 'tickets' (weight), and a cryptographic lottery (VRF) fairly picks block leaders.",
  'PoE': 'Proof of Engagement: a system where verified human actions mint temporary, decaying lottery chances (tickets) to propose blocks.',
  'VRF': 'Verifiable Random Function: produces a random output with a proof anyone can check—used to pick leaders/committees fairly.',
  epoch: 'A fixed window of time (e.g., 1 day). JEM rebases difficulty and weights each epoch.',
  slot: 'A small time slice (e.g., ~4s) where at most one block should be produced.',
  consensus: 'How the network agrees on the next block. JEM uses PoE + VRF and HotStuff-style committee finality.',
  committee: 'A small VRF-sampled validator group that signs and finalizes blocks.',
  finality: "When a block is confirmed and won't be reverted. JEM uses a HotStuff-style two-phase vote with aggregated signatures.",
  HotStuff: 'A modern BFT protocol family with simple phases and clear safety/liveness properties.',
  quorum: 'The minimum validator votes required to finalize a block.',
  'BLS aggregation': 'A signature scheme that lets many validator signatures be combined into one compact proof.',
  ticket: "A cryptographic, non-transferable 'lottery chance' minted from verified actions; decays over time.",
  weight: "Your per-epoch block lottery strength, derived from valid tickets; capped and decays.",
  'honey pot': 'A randomized bonus pool created from orphaned blocks; unlocks extra tickets when a hidden trigger occurs.',
  'orphaned block': 'A valid block that lost a fork race. In JEM, orphans seed honey pot events.',
  'randomness beacon': 'A public randomness source for leader/committee selection—derived from prior VRFs (or drand while bootstrapping).',
  'difficulty retarget': 'Adjusting the selection threshold each epoch so block rate/emissions stay on target.',
  EMA: 'Exponential Moving Average: a smoothing method JEM uses to avoid oscillations in difficulty.',
  'emission schedule': 'How new JEMs are minted over time (leader/committee/honey-pot/ecosystem splits).',
  mempool: 'Pending transactions/tickets waiting to be included in a block.',
  'account model': 'Balances live on accounts (addresses), not UTXOs—friendlier for wallets/programs.',
  'stateless client': "Sends lightweight 'witness' proofs so mobile clients don't need full state.",
  'libp2p gossip': 'Peer-to-peer messaging for blocks/tx/tickets; resilient and decentralized.',
  'RocksDB/Sled': 'Embedded databases for node storage.',
  RPC: 'JSON-RPC: the HTTP API for wallets and apps to talk to a node.',
  GraphQL: "A flexible query API; JEM's gateway can stream live blocks/tx.",
  SDK: 'Developer toolkit to emit actions, handle quotas, and submit tickets.',
  'device attestation': 'Proof from your OS/secure hardware that a device and action are genuine (WebAuthn/OS APIs).',
  'liveness check': "A lightweight proof you're a real, present human (e.g., passkey prompt/biometric).",
  'mesh relay': 'Forwarding actions over local radios (Bluetooth/Wi‑Fi) when offline—relays can earn tickets.',
  'proof of personhood': 'Combining attestations/vouches to limit Sybil influence per human.',
  Sybil: 'Many fake identities controlled by one actor; JEM limits them with caps/attestation.',
  slashing: "Penalties for validators who misbehave (e.g., double-vote).",
  'rate limit': 'Per-epoch caps and timing rules that prevent spam or runaway advantage.',
  quota: 'Per-epoch caps and timing rules that prevent spam or runaway advantage.',
  drand: "A public randomness beacon network we can import while bootstrapping.",
  'beacon bias': 'Trying to manipulate randomness; mitigated with VRF aggregation and committee rules.',
  BFT: 'Byzantine Fault Tolerant consensus: continues working even if some nodes act maliciously.',
};

// Simple helper to build a regex of terms (sorted by length desc to prefer longer matches)
export const GLOSSARY_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

// rehype plugin factory to wrap glossary terms with Tooltip JSX (only in text nodes)
// simple tree traversal to visit text nodes
function traverse(node: any, cb: (node: any, index?: number, parent?: any) => void, parent?: any) {
  if (!node) return
  if (Array.isArray(node)) {
    node.forEach((n, i) => traverse(n, cb, node))
    return
  }
  if (node.type === 'text') cb(node, undefined, parent)
  if (node.children && node.children.length) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      if (child.type === 'text') cb(child, i, node)
      traverse(child, cb, node)
    }
  }
}

export function rehypeGlossary() {
  return (tree: any) => {
    const terms = GLOSSARY_TERMS.map((t) => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const re = new RegExp(`\\b(${terms.join('|')})\\b`, 'g');
    traverse(tree, (node: any, index?: number, parent?: any) => {
      if (!parent) return
      const parentTag = parent.tagName || parent.type
      if (parentTag === 'code' || parentTag === 'inlineCode' || parentTag === 'link') return
      const value: string = node.value as string
      if (!value || !re.test(value)) return
      const parts: any[] = []
      let lastIndex = 0
      value.replace(re, (match: string, p1: string, offset: number) => {
        if (offset > lastIndex) {
          parts.push({ type: 'text', value: value.slice(lastIndex, offset) })
        }
        parts.push({ type: 'mdxJsxTextElement', name: 'Tooltip', attributes: [{ type: 'mdxJsxAttribute', name: 'term', value: match }], children: [{ type: 'text', value: match }] })
        lastIndex = offset + match.length
        return match
      })
      if (lastIndex < value.length) parts.push({ type: 'text', value: value.slice(lastIndex) })
      parent.children.splice(index as number, 1, ...parts)
    })
  }
}

export default GLOSSARY;
