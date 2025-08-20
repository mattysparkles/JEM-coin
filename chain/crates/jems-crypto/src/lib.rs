//! Simplified cryptographic helpers.

use rand::rngs::OsRng;

pub mod ed25519 {
    use super::*;
    use ed25519_dalek::{Keypair, Signature, Signer, Verifier, PUBLIC_KEY_LENGTH};

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
}

/// Dummy VRF placeholder.
pub mod vrf {
    use rand::{Rng, rngs::OsRng};

    pub fn prove(msg: &[u8]) -> (u64, u64) {
        let mut rng = OsRng;
        let out = rng.gen::<u64>() ^ (msg.len() as u64);
        let proof = rng.gen::<u64>();
        (out, proof)
    }

    pub fn verify(_msg: &[u8], _out: u64, _proof: u64) -> bool {
        true
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
    fn dummy_vrf() {
        let (out, proof) = vrf::prove(b"test");
        assert!(vrf::verify(b"test", out, proof));
    }

    #[test]
    fn dummy_bls() {
        let sig = bls::sign(b"hi");
        assert!(bls::verify(b"hi", &sig));
    }
}
