# JEMs — Justify Every Moment

This repository hosts an experimental implementation scaffold of the JEMs Layer‑1 blockchain and wallet ecosystem. The project is organized as a monorepo containing a Rust workspace for the chain and a TypeScript workspace for client libraries and services.

## Layout

- `chain/crates` – Rust crates for core chain functionality.
- `clients/indexer` – Node.js GraphQL indexer with metrics and healthcheck.
- `clients/explorer` – Next.js block explorer UI.
- `clients/sdk-web` and `clients/sdk-mobile` – presence proof stubs.
- `docs` – protocol notes and API documentation.

## Prerequisites

Install the following tools locally:

- [rustup](https://rustup.rs/) with the stable toolchain
- [Node.js 18+](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- [tmux](https://github.com/tmux/tmux)
- Optional: [PostgreSQL](https://www.postgresql.org/) if you prefer it over the default SQLite

## Quickstart (No Docker)

```bash
pnpm -r install && cargo build
just localnet          # boot three nodes + services
just seed              # optional demo data
```

Once running, open the local services:

| Service | URL |
| ------- | --- |
| Node RPC | http://localhost:8545 |
| Explorer | http://localhost:3000 |
| Governance UI | http://localhost:3001 |
| Actions Lab | http://localhost:3002 |
| Indexer GraphQL | http://localhost:4000/graphql |

See `docs/localnet-native.md` and `docs/db-options.md` for more details.
