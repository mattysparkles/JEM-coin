# JEMs — Justify Every Moment

This repository hosts an experimental implementation scaffold of the JEMs Layer‑1 blockchain and wallet ecosystem. The project is organized as a monorepo containing a Rust workspace for the chain and a TypeScript workspace for client libraries and services. The code is intentionally small and heavily stubbed so contributors can experiment with consensus ideas, storage models, and user‑facing tooling.

## Layout

- `chain/crates` – Rust crates for core chain functionality
  - `jems-core` – shared types and protocol parameters
  - `jems-crypto` – signing, pseudo‑VRF and placeholder BLS helpers
  - `jems-consensus` – PoE‑VRF consensus stub
  - `jems-p2p` – libp2p wrapper providing gossip topics
  - `jems-storage` – RocksDB based chain storage
  - `jems-rpc` – JSON‑RPC server
  - `jems-node` – CLI binary combining the above crates
- `clients/indexer` – Node.js GraphQL indexer with metrics and healthcheck
- `clients/explorer` – Next.js block explorer UI
- `clients/sdk-web` and `clients/sdk-mobile` – presence proof stubs
- `docs` – protocol notes and API documentation

## Building from Source

### Prerequisites

Install the following tools locally:

- [rustup](https://rustup.rs/) with the stable toolchain
- [Node.js 18+](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- [tmux](https://github.com/tmux/tmux)
- Optional: [PostgreSQL](https://www.postgresql.org/) if you prefer it over the default SQLite

### Build

```bash
git clone https://github.com/.../JEM-coin.git
cd JEM-coin
pnpm -r install            # install client dependencies
cargo build --workspace     # build all Rust crates
```

### Run Tests

```bash
just test
```

### Quickstart (No Docker)

```bash
pnpm -r install && cargo build
./scripts/native/native-localnet.sh
open http://localhost:3003    # example site
# load extension (dev build) in your browser
./scripts/native/seed-actions.sh
```

Once running, open the local services:

| Service | URL |
| ------- | --- |
| Node RPC | http://localhost:8545 |
| Explorer | http://localhost:3000 |
| Governance UI | http://localhost:3001 |
| Actions Lab | http://localhost:3002 |
| Example Site | http://localhost:3003 |
| Indexer GraphQL | http://localhost:4000/graphql |

See `docs/localnet-native.md` and `docs/db-options.md` for more details.

## Function Reference

### Chain Crates

#### `jems-core`
- `Address::from_public_key(pk: &[u8]) -> Address` – create an address from a public key
- `Address::bech32(&self) -> String` – encode an address to Bech32
- `BlockHeader::hash(&self) -> Hash` – hash a block header for linking and seeding
- `derive_honeypot(header: &BlockHeader, beacon: Hash) -> HoneyPot` – deterministically derive honey pots
- `apply_decay(prev: u64, params: &ProtocolParams, actions: &[ActionKind]) -> u64` – decay and update engagement weights

#### `jems-crypto`
- `ed25519::generate_keypair() -> Keypair`
- `ed25519::sign(kp: &Keypair, msg: &[u8]) -> Signature`
- `ed25519::verify(pk: &PublicKey, msg: &[u8], sig: &Signature) -> bool`
- `vrf::prove(kp: &Keypair, msg: &[u8]) -> (u64, Vec<u8>)`
- `vrf::validate(pk: &PublicKey, msg: &[u8], out: u64, proof: &[u8]) -> bool`
- `bls::sign(msg: &[u8]) -> Vec<u8>`
- `bls::verify(msg: &[u8], sig: &[u8]) -> bool`
- `bls::aggregate(sigs: &[Vec<u8>]) -> Vec<u8>`

#### `jems-consensus`
- `Consensus::new(params: ProtocolParams) -> Consensus`

#### `jems-p2p`
- `Behaviour::new() -> Behaviour` – construct libp2p behaviour with gossipsub and mDNS

#### `jems-storage`
- `Storage::open(path) -> Result<Storage, RocksError>`
- `Storage::put_block(&self, block: &Block)` / `get_block(&self, hash: &Hash)`
- `Storage::put_header(&self, header: &BlockHeader)` / `get_header(&self, hash: &Hash)`
- `Storage::read_weight(&self, addr: &Address) -> u64`
- `Storage::write_weight(&self, addr: &Address, w: u64)`
- `Storage::tickets_by_epoch(&self, epoch: Epoch) -> Vec<Ticket>`
- `Storage::put_params_snapshot(&self, epoch: Epoch, params: &ProtocolParams)`
- `Storage::get_params_snapshot(&self, epoch: Epoch) -> Option<ProtocolParams>`

#### `jems-rpc`
- `serve(addr: SocketAddr, params: Arc<ProtocolParams>)` – launch JSON‑RPC server
- RPC methods exposed by `handle`:
  - `get_params` – return current protocol parameters
  - `get_epoch_info` – return latest epoch information
  - `set_params` – update parameters and emit event
- SSE endpoint `/events` streaming `EpochAdvanced`, `ParamsUpdated`, and `Governance` events

#### `jems-node` (`jemsd` CLI)
- `init` – initialize node configuration
- `run --rpc <addr>` – run the node with an RPC server
- `params show` – display effective protocol parameters
- `params write --path <file>` – write parameters to a TOML file

### Client Indexer (GraphQL)
Queries available from `clients/indexer`:

- `block(height: Int!)`
- `blocks(limit: Int, offset: Int)`
- `tickets(actor_pk: String, epoch: Int)`
- `honeypots(status: String)`
- `committee(block_id: ID!)`
- `paramsSnapshots(range: EpochRangeInput)`
- `latestParams`

## Tuning Parameters

```bash
jemsd params write --path ./jems.config.toml
# edit jems.config.toml as desired
JEMS_CONFIG=./jems.config.toml jemsd run --rpc 127.0.0.1:8080
```

## Project Status

### Already Built
- Core protocol types, crypto helpers, and RocksDB storage
- Minimal JSON‑RPC server and node CLI
- Basic libp2p networking and consensus placeholders
- GraphQL indexer, block explorer, and example site

### Needs Work
- Full PoE‑VRF consensus and committee finality
- Robust networking, validation, and transaction processing
- Comprehensive RPC and GraphQL APIs
- Wallet integration and real user actions
- Documentation, tests, and production hardening
