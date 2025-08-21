# Automated Repo Audit

## Workspace Crates
- jems-core
- jems-crypto
- jems-rpc
- jems-node
- jems-consensus
- jems-storage
- jems-p2p

## Workspace Packages
- jems-explorer
- jems-indexer
- jems-sdk-mobile
- jems-sdk-web
- jems-site-example
- @jems/track
- @jems/wallet-core
- jems-wallet-desktop
- jems-wallet-extension

## Missing Features by Spec Section
- **Consensus (§2, §4.1-4.3)**: no VRF leader election, committee finality, epoch beacon or difficulty retargeting.
- **Tickets (§5.1-§5.3)**: ticket creation, caps, decay and attestation not implemented.
- **Honey-Pots (§6)**: orphan detection and bounty conversion absent.
- **Difficulty & Rewards (§7)**: no EMA retarget or reward split logic.
- **Storage (§8)**: RocksDB column families and state management not defined.
- **Networking (§9)**: libp2p topics only stubbed.
- **Node (§8-§9.1)**: slot worker, mempools, fork-choice and validation missing.
- **RPC (§9.2)**: only placeholder handler; required methods unimplemented.
- **Privacy (§10)**: meta-hash and presence commitments absent.
- **Governance (§12)**: no proposal or voting logic.

## Failing or Incomplete Tests
- `cargo check` hangs compiling `librocksdb-sys` and does not complete.
- `cargo test` compilation started but was terminated early.
- `pnpm -r build` fails: `next: not found`, workspace lacks installed dependencies.
- `pnpm -r test` runs only wallet-core tests successfully.

## TODO/FIXME
- `clients/wallet-core/bin/seed-demo.js:3` – implement wallet-core CLI interactions.

## Unused Code / Duplicate Types
- `jems-consensus/src/lib.rs` imports `jems_core::*` but does not use it.
- No duplicate types detected.

## Recommended Module Boundaries
- Separate consensus, storage, p2p, rpc, and node into clear crates with minimal cross-dependencies.
- Introduce dedicated crates for tickets, governance, and honey-pot logic.
- Define shared types in `jems-core` to avoid duplication across crates and clients.

