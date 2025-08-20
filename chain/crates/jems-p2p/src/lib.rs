//! Minimal libp2p wrapper exposing gossipsub topics.
//! Currently this is a stub sufficient for compilation and tests.

use libp2p::{gossipsub, identity, mdns, swarm::NetworkBehaviour};

/// Topics used by the protocol.
pub const TOPIC_BLOCKS: &str = "blocks";
pub const TOPIC_TXS: &str = "txs";

/// Basic network behaviour combining gossipsub and mdns for local discovery.
#[derive(NetworkBehaviour)]
pub struct Behaviour {
    pub gossipsub: gossipsub::Behaviour,
    pub mdns: mdns::tokio::Behaviour,
}

impl Behaviour {
    /// Create a new behaviour with default configuration.
    pub fn new() -> Self {
        let local_key = identity::Keypair::generate_ed25519();
        let gcfg = gossipsub::Config::default();
        let gossipsub = gossipsub::Behaviour::new(
            gossipsub::MessageAuthenticity::Signed(local_key.clone()),
            gcfg,
        )
        .expect("gossipsub");
        let mdns = mdns::tokio::Behaviour::new(mdns::Config::default(), local_key.public().to_peer_id())
            .expect("mdns");
        Self { gossipsub, mdns }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn behaviour_builds() {
        let _b = Behaviour::new();
    }
}
