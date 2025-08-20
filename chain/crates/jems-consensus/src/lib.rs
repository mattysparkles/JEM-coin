//! Placeholder consensus crate for JEMs.
//! Future work will implement PoE-VRF and committee finality.

use jems_core::*; // re-export for downstream users

/// Stub consensus object.
pub struct Consensus;

impl Consensus {
    /// Create a new placeholder consensus instance.
    pub fn new() -> Self {
        Self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn construct() {
        let _c = Consensus::new();
    }
}
