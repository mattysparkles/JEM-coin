# Getting Started

This guide helps you spin up a local JEM environment and explore the APIs.

## Prerequisites

- Node.js 20 with Corepack (pnpm)
- Rust toolchain (stable)

## Website (marketing + docs)

```
cd repo/clients/website/website
pnpm install
pnpm dev
# open http://localhost:3050
```

## Localnet (native)

See `docs/localnet-native.md` for native binaries or `docs/localnet.md` for the JS runner.

## JSON‑RPC

Once a node is running, send a request:

```
curl -s http://127.0.0.1:7070 -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"ping","params":[]}'
```

## GraphQL

If the GraphQL gateway is enabled:

```
curl -s 'http://127.0.0.1:8090/api/graphql' \
  -H 'content-type: application/json' \
  -d '{"query":"{ ping }"}'
```

