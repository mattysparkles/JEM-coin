//! Core types and protocol parameters for the JEMs blockchain.
//!
//! This crate defines the canonical wire-level types shared between all
//! components of the system.  Only light helpers and pure functions live here
//! to keep the crate dependency‑free.

use bech32::{self, ToBase32, Variant};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

/// Human readable prefix for addresses.
pub const HRP: &str = "jem";
/// Slot duration in seconds.
pub const SLOT_SECS: u64 = 4;
/// Number of slots per epoch.
pub const EPOCH_SLOTS: u64 = 21_600;
/// Maximum engagement weight.
pub const W_MAX: u64 = 1_000;

/// 256-bit hash.
pub type Hash = [u8; 32];
/// Account balance denomination.
pub type Balance = u128;
/// Account nonce type.
pub type Nonce = u64;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, PartialOrd, Ord)]
pub struct Epoch(pub u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, PartialOrd, Ord)]
pub struct Slot(pub u64);

/// Account address encoded as 32 raw bytes (typically a public key hash).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Address(pub [u8; 32]);

impl Address {
    /// Create from a raw public key; truncates or zero pads to 32 bytes.
    pub fn from_public_key(pk: &[u8]) -> Self {
        let mut bytes = [0u8; 32];
        let len = pk.len().min(32);
        bytes[..len].copy_from_slice(&pk[..len]);
        Address(bytes)
    }

    /// Encode to bech32 using the canonical HRP.
    pub fn bech32(&self) -> String {
        bech32::encode(HRP, self.0.to_base32(), Variant::Bech32).expect("bech32")
    }
}

/// Kinds of on-chain social engagement actions.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ActionKind {
    Like,
    CheckIn,
    Relay,
    Visit,
    Post,
}

impl ActionKind {
    /// Weight contribution for a single action of this kind.
    pub fn weight(self) -> u64 {
        match self {
            ActionKind::Like => 1,
            ActionKind::CheckIn => 5,
            ActionKind::Relay => 2,
            ActionKind::Visit => 10,
            ActionKind::Post => 15,
        }
    }
}

/// Signed statement of an engagement action.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ActionEvent {
    pub actor_pk: [u8; 32],
    pub kind: ActionKind,
    pub ts: u64,
    pub meta_hash: Hash,
}

/// Lottery ticket increasing probability of being selected as leader.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Ticket {
    pub actor_pk: [u8; 32],
    pub epoch: Epoch,
    pub salt: u64,
    pub quota_sig: Vec<u8>,
    pub attestation: Vec<u8>,
}

/// Simple account based transaction.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Tx {
    pub from: Address,
    pub to: Address,
    pub amount: Balance,
    pub fee: Balance,
    pub nonce: Nonce,
    pub sig: Vec<u8>,
}

/// Block header committed by a leader.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct BlockHeader {
    pub parent: Hash,
    pub height: u64,
    pub epoch: Epoch,
    pub slot: Slot,
    pub leader_pk: [u8; 32],
    pub vrf_out: u128,
    pub vrf_proof: Vec<u8>,
    pub beacon: Hash,
    pub tx_root: Hash,
    pub ticket_root: Hash,
    pub hp_root: Hash,
    pub state_root: Hash,
}

impl BlockHeader {
    /// Hashes the header for linking and honey‑pot seeding.
    pub fn hash(&self) -> Hash {
        let encoded = bincode::serialize(self).expect("header serialize");
        let digest = Sha256::digest(&encoded);
        let mut out = [0u8; 32];
        out.copy_from_slice(&digest);
        out
    }
}

/// Full block with transactions and ticket announcements.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Block {
    pub header: BlockHeader,
    pub txs: Vec<Tx>,
    pub tickets: Vec<Ticket>,
    pub honeypots: Vec<HoneyPot>,
    pub agg_commit_sig: Vec<u8>,
}

/// Rule describing when a honey pot unlocks.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum HoneyTrigger {
    /// Unlock on the Nth action of the day.
    NthAction(u64),
}

/// Announced honey pot bounty.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HoneyPot {
    pub id: Hash,
    pub seed: Hash,
    pub bounty_tickets: u64,
    pub expires_epoch: Epoch,
    pub trigger_rule: HoneyTrigger,
}

/// Derive a honey pot from an orphaned header and epoch beacon.
pub fn derive_honeypot(header: &BlockHeader, beacon: Hash) -> HoneyPot {
    let orphan_hash = header.hash();
    let mut hasher = Sha256::new();
    hasher.update(&orphan_hash);
    hasher.update(&beacon);
    let seed = hasher.finalize();

    // Size: 10k-100k tickets.
    let mut size_bytes = [0u8; 4];
    size_bytes.copy_from_slice(&seed[0..4]);
    let size = 10_000 + (u32::from_le_bytes(size_bytes) % 90_001) as u64;

    // Expiry within next 5 epochs.
    let expires_epoch = Epoch(header.epoch.0 + (seed[4] % 5 + 1) as u64);

    // Trigger is Nth action today (1..20).
    let trigger_rule = HoneyTrigger::NthAction((seed[5] % 20 + 1) as u64);

    let mut id = [0u8; 32];
    id.copy_from_slice(&Sha256::digest(&seed));

    HoneyPot { id, seed: seed.into(), bounty_tickets: size, expires_epoch, trigger_rule }
}

/// Apply exponential decay to an engagement weight and add new action weights.
pub fn apply_decay(prev: u64, lambda: f64, actions: &[ActionKind]) -> u64 {
    let decayed = (prev as f64 * lambda) as u64;
    let added: u64 = actions.iter().map(|k| k.weight()).sum();
    (decayed + added).min(W_MAX)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn address_bech32_prefix() {
        let addr = Address::from_public_key(&[1, 2, 3]);
        assert!(addr.bech32().starts_with(HRP));
    }

    #[test]
    fn weight_decay_caps() {
        let w = apply_decay(900, 0.5, &[ActionKind::Visit, ActionKind::Like]);
        assert_eq!(w, 461); // 900->450 +11
        let w2 = apply_decay(W_MAX, 1.0, &[ActionKind::Visit; 100]);
        assert_eq!(w2, W_MAX);
    }

    #[test]
    fn honeypot_determinism() {
        let header = BlockHeader {
            parent: [0u8; 32],
            height: 1,
            epoch: Epoch(1),
            slot: Slot(1),
            leader_pk: [1u8; 32],
            vrf_out: 0,
            vrf_proof: vec![],
            beacon: [2u8; 32],
            tx_root: [0u8; 32],
            ticket_root: [0u8; 32],
            hp_root: [0u8; 32],
            state_root: [0u8; 32],
        };
        let beacon = [3u8; 32];
        let hp1 = derive_honeypot(&header, beacon);
        let hp2 = derive_honeypot(&header, beacon);
        assert_eq!(hp1.id, hp2.id);
    }
}
