//! Simplified cryptographic helpers.

use rand::rngs::OsRng;
use sha2::{Digest, Sha256};

pub mod ed25519 {
    use super::*;
    use ed25519_dalek::{Keypair, PublicKey, Signature, Signer, PUBLIC_KEY_LENGTH};

    pub fn generate_keypair() -> Keypair {
        Keypair::generate(&mut OsRng)
    }

    pub fn sign(key: &Keypair, msg: &[u8]) -> Signature {
        key.sign(msg)
    }

    pub fn verify(key: &Keypair, msg: &[u8], sig: &Signature) -> bool {
        key.verify(msg, sig).is_ok()
    }

    pub fn public_key_bytes(key: &Keypair) -> [u8; PUBLIC_KEY_LENGTH] {
        key.public.to_bytes()
    }

    pub fn public_key(key: &Keypair) -> PublicKey {
        key.public
    }
}

/// Deterministic VRF using ed25519 signatures and SHA-256 hashing.
pub mod vrf {
    use super::ed25519;
    use super::*;
    use ed25519_dalek::{Keypair, PublicKey, Signature, Verifier};

    pub fn prove(key: &Keypair, msg: &[u8]) -> (u64, Vec<u8>) {
        let sig = ed25519::sign(key, msg);
        let hash = Sha256::digest(sig.to_bytes());
        let mut y_bytes = [0u8; 8];
        y_bytes.copy_from_slice(&hash[..8]);
        (u64::from_le_bytes(y_bytes), sig.to_bytes().to_vec())
    }

    pub fn verify(pk: &PublicKey, msg: &[u8], out: u64, proof: &[u8]) -> bool {
        if let Ok(sig) = Signature::from_bytes(proof) {
            if pk.verify(msg, &sig).is_ok() {
                let hash = Sha256::digest(sig.to_bytes());
                let mut y_bytes = [0u8; 8];
                y_bytes.copy_from_slice(&hash[..8]);
                return u64::from_le_bytes(y_bytes) == out;
            }
        }
        false
    }
}

/// Dummy BLS placeholder.
pub mod bls {
    pub fn sign(msg: &[u8]) -> Vec<u8> {
        msg.to_vec()
    }

    pub fn verify(_msg: &[u8], _sig: &[u8]) -> bool {
        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ed25519_roundtrip() {
        let kp = ed25519::generate_keypair();
        let msg = b"hello";
        let sig = ed25519::sign(&kp, msg);
        assert!(ed25519::verify(&kp, msg, &sig));
    }

    #[test]
    fn vrf_roundtrip() {
        let kp = ed25519::generate_keypair();
        let msg = b"vrf";
        let (out, proof) = vrf::prove(&kp, msg);
        let pk = ed25519::public_key(&kp);
        assert!(vrf::verify(&pk, msg, out, &proof));
    }

    #[test]
    fn dummy_bls() {
        let sig = bls::sign(b"hi");
        assert!(bls::verify(b"hi", &sig));
    }
}
