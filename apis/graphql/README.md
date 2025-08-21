# GraphQL Gateway

Minimal gateway exposing chain data over GraphQL.

## Running

```
pnpm install
node index.js
```

## Query example

```
curl -X POST -H "content-type: application/json" --data '{"query":"{ chainMeta { height } }"}' http://localhost:4001/graphql
```

## Subscription example

```
wscat -c ws://localhost:4001/graphql -s graphql-transport-ws
> {"type":"connection_init"}
> {"id":"1","type":"subscribe","payload":{"query":"subscription{ newBlock { height } }"}}
```
