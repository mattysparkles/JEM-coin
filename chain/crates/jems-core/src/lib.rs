//! Core types and parameters for the JEMs blockchain.

use bech32::{self, ToBase32, Variant};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

pub const HRP: &str = "jem";
pub const SLOT_SECS: u64 = 4;
pub const EPOCH_SLOTS: u64 = 21_600;

/// Maximum engagement weight per identity per epoch.
pub const W_MAX: u64 = 1_000;

pub type Hash = [u8;32];

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, PartialOrd, Ord)]
pub struct Epoch(pub u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, PartialOrd, Ord)]
pub struct Slot(pub u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Address([u8;32]);

impl Address {
    pub fn from_public_key(pk: &[u8]) -> Self {
        let mut bytes = [0u8;32];
        let len = pk.len().min(32);
        bytes[..len].copy_from_slice(&pk[..len]);
        Address(bytes)
    }

    pub fn bech32(&self) -> String {
        bech32::encode(HRP, self.0.to_base32(), Variant::Bech32).expect("bech32")
    }
}

/// Different kinds of engagement events that can mint tickets.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ActionKind {
    Like,
    CheckIn,
    Visit,
    Relay,
}

impl ActionKind {
    /// Weight contribution for a single action of this kind.
    pub fn weight(self) -> u64 {
        match self {
            ActionKind::Like => 1,
            ActionKind::CheckIn => 5,
            ActionKind::Visit => 10,
            ActionKind::Relay => 2,
        }
    }
}

/// Signed statement of an engagement action.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ActionEvent {
    pub actor: Address,
    pub kind: ActionKind,
    pub timestamp: u64,
    pub meta_hash: Hash,
}

/// Lottery ticket increasing the probability of being selected as block leader.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Ticket {
    pub actor: Address,
    pub epoch: Epoch,
    pub salt: u64,
    /// Proof that ties the ticket to an action quota.
    pub proof: Vec<u8>,
}

/// Simple account based transaction.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Tx {
    pub from: Address,
    pub to: Address,
    pub amount: u64,
}

/// Block header committed by a leader.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct BlockHeader {
    pub parent: Hash,
    pub epoch: Epoch,
    pub slot: Slot,
    pub proposer: Address,
    pub vrf_output: u64,
    pub vrf_proof: Vec<u8>,
}

impl BlockHeader {
    /// Hashes the header for linking and honey pot seeding.
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
    pub honeypots: Vec<HoneyPotAnnouncement>,
}

/// Rule describing when a honey pot unlocks.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum HoneyTrigger {
    /// Unlock on the Nth action of the day.
    NthAction(u64),
}

/// Announcement of an available honey pot bounty.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HoneyPotAnnouncement {
    pub id: Hash,
    pub bounty_tickets: u64,
    pub expires: Epoch,
    pub trigger: HoneyTrigger,
}

/// Derive a honey pot description from an orphaned block header and epoch randomness.
pub fn honey_from_orphan(orphan_hash: Hash, beacon: Hash, cur_epoch: Epoch) -> HoneyPotAnnouncement {
    let mut hasher = Sha256::new();
    hasher.update(&orphan_hash);
    hasher.update(&beacon);
    let seed = hasher.finalize();

    // Size: 10k-100k tickets
    let mut size_bytes = [0u8; 4];
    size_bytes.copy_from_slice(&seed[0..4]);
    let size = 10_000 + (u32::from_le_bytes(size_bytes) % 90_001) as u64;

    // Expiry within next 5 epochs
    let expires = Epoch(cur_epoch.0 + (seed[4] % 5 + 1) as u64);

    // Trigger is Nth action today (1..20)
    let trigger = HoneyTrigger::NthAction((seed[5] % 20 + 1) as u64);

    let mut id = [0u8; 32];
    id.copy_from_slice(&Sha256::digest(&seed));

    HoneyPotAnnouncement { id, bounty_tickets: size, expires, trigger }
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
        let addr = Address::from_public_key(&[1,2,3]);
        assert!(addr.bech32().starts_with(HRP));
    }

    #[test]
    fn weight_decay_caps() {
        let w = apply_decay(900, 0.5, &[ActionKind::Visit, ActionKind::Like]);
        // decayed 900->450 then +11 = 461
        assert_eq!(w, 461);
        // applying many actions cannot exceed W_MAX
        let w2 = apply_decay(W_MAX, 1.0, &[ActionKind::Visit; 100]);
        assert_eq!(w2, W_MAX);
    }

    #[test]
    fn honey_deterministic() {
        let orphan = [1u8;32];
        let beacon = [2u8;32];
        let hp1 = honey_from_orphan(orphan, beacon, Epoch(1));
        let hp2 = honey_from_orphan(orphan, beacon, Epoch(1));
        assert_eq!(hp1.id, hp2.id);
    }
}
