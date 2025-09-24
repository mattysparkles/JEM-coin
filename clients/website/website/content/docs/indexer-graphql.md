# Indexer GraphQL API

The indexer exposes a read-only GraphQL endpoint at `http://localhost:4000/graphql`.

## Query Examples

```
query {
  blocks(limit: 5) { id height epoch slot }
  tickets(actor_pk: "pk1") { id kind commitment }
  honeypots(status: "announced") { id seed_hash status }
}
```

Pagination is supported via `limit` and `offset` arguments. Timestamps are ISO8601 and large numbers are returned as strings.
