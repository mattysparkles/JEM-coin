//! Core types and parameters for the JEMs blockchain.

use serde::{Deserialize, Serialize};
use bech32::{self, ToBase32, Variant};

pub const HRP: &str = "jem";
pub const SLOT_SECS: u64 = 4;
pub const EPOCH_SLOTS: u64 = 21_600;

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn address_bech32_prefix() {
        let addr = Address::from_public_key(&[1,2,3]);
        assert!(addr.bech32().starts_with(HRP));
    }
}
