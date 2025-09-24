# API Reference (Overview)

JEM exposes a JSON‑RPC interface and an optional GraphQL gateway.

## JSON‑RPC

- URL: `http://127.0.0.1:7070` (local) or `/api/rpc` (via Caddy on prod)
- Content‑Type: `application/json`

Example:

```
curl -s $RPC_URL -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"ping","params":[]}'
```

## GraphQL

- URL: `http://127.0.0.1:8090/api/graphql` (local) or `/api/graphql` (prod)

Example:

```
curl -s $GQL_URL -H 'content-type: application/json' \
  -d '{"query":"{ ping }"}'
```

See also:

- `docs/indexer-graphql.md`
- `docs/explorer.md`

