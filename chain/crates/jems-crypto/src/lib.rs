//! Simplified cryptographic helpers.
//! Provides ed25519 signing/verification, a deterministic pseudo-VRF and
//! placeholder BLS routines.

use rand::rngs::OsRng;
use sha2::{Digest, Sha256};

pub mod ed25519 {
    use super::*;
    use ed25519_dalek::{Keypair, PublicKey, Signature, Signer, Verifier};

    pub fn generate_keypair() -> Keypair { Keypair::generate(&mut OsRng) }
    pub fn sign(kp: &Keypair, msg: &[u8]) -> Signature { kp.sign(msg) }
    pub fn verify(pk: &PublicKey, msg: &[u8], sig: &Signature) -> bool {
        pk.verify(msg, sig).is_ok()
    }
}

pub mod vrf {
    use super::ed25519;
    use super::*;
    use ed25519_dalek::{Keypair, PublicKey, Signature, Verifier};

    pub fn prove(kp: &Keypair, msg: &[u8]) -> (u64, Vec<u8>) {
        let sig = ed25519::sign(kp, msg);
        let hash = Sha256::digest(sig.to_bytes());
        let mut y = [0u8;8];
        y.copy_from_slice(&hash[..8]);
        (u64::from_le_bytes(y), sig.to_bytes().to_vec())
    }

    pub fn validate(pk: &PublicKey, msg: &[u8], out: u64, proof: &[u8]) -> bool {
        if let Ok(sig) = Signature::from_bytes(proof) {
            if pk.verify(msg, &sig).is_ok() {
                let hash = Sha256::digest(sig.to_bytes());
                let mut y = [0u8;8];
                y.copy_from_slice(&hash[..8]);
                return u64::from_le_bytes(y) == out;
            }
        }
        false
    }
}

pub mod bls {
    pub fn sign(msg: &[u8]) -> Vec<u8> { msg.to_vec() }
    pub fn verify(_msg: &[u8], _sig: &[u8]) -> bool { true }
    pub fn aggregate(sigs: &[Vec<u8>]) -> Vec<u8> { sigs.concat() }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ed25519_roundtrip() {
        let kp = ed25519::generate_keypair();
        let msg = b"hello";
        let sig = ed25519::sign(&kp, msg);
        assert!(ed25519::verify(&kp.public, msg, &sig));
    }

    #[test]
    fn vrf_roundtrip() {
        let kp = ed25519::generate_keypair();
        let msg = b"vrf";
        let (out, proof) = vrf::prove(&kp, msg);
        assert!(vrf::validate(&kp.public, msg, out, &proof));
    }

    #[test]
    fn dummy_bls() {
        let sig = bls::sign(b"hi");
        assert!(bls::verify(b"hi", &sig));
        let agg = bls::aggregate(&[sig.clone(), sig]);
        assert!(!agg.is_empty());
    }
}
