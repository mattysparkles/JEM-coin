# JEMs — Justify Every Moment

This repository hosts an experimental implementation scaffold of the JEMs Layer‑1 blockchain and wallet ecosystem. The project is organized as a monorepo containing a Rust workspace for the chain and a TypeScript workspace for client libraries and services.

## Layout

- `chain/crates` – Rust crates for core chain functionality.
- `clients/indexer` – Node.js GraphQL indexer with metrics and healthcheck.
- `clients/explorer` – Next.js block explorer UI.
- `clients/sdk-web` and `clients/sdk-mobile` – presence proof stubs.
- `docs` – protocol notes and API documentation.

## Building

```bash
cargo test      # run Rust tests
pnpm install    # install JS deps
pnpm -r test    # run JS tests
```

See `docs/indexer-graphql.md` and `docs/explorer.md` for usage information and `docs/zk-presence.md` for the presence proof roadmap.
