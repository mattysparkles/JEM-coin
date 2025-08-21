//! Placeholder consensus crate for JEMs.
//! Future work will implement PoE-VRF and committee finality.

use jems_core::{self, ProtocolParams};
pub use jems_core::*;

/// Stub consensus object.
pub struct Consensus {
    params: ProtocolParams,
}

impl Consensus {
    /// Create a new placeholder consensus instance.
    pub fn new(params: ProtocolParams) -> Self {
        Self { params }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn construct() {
        let params = ProtocolParams::default();
        let _c = Consensus::new(params);
    }
}
