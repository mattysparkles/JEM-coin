# JEMs — Justify Every Moment

This repository hosts an experimental implementation scaffold of the JEMs Layer‑1 blockchain and wallet ecosystem. The project is organized as a monorepo containing a Rust workspace for the chain and a TypeScript workspace for client libraries.

## Layout

- `chain/crates/jems-core` – core types and constants.
- `chain/crates/jems-crypto` – cryptographic helpers (ed25519, VRF, BLS stubs).
- `chain/crates/jems-rpc` – minimal JSON‑RPC server using axum.
- `chain/crates/jems-node` – CLI binary `jems-node`.
- `clients/wallet-core` – placeholder TypeScript wallet library.
- `docs` – protocol notes and parameter tables.

## Building

```bash
cargo test      # run Rust tests
pnpm install    # install JS deps
pnpm -r test    # run JS tests
```

These crates are early scaffolding and do not implement consensus or networking; they merely provide a starting point for further development.
