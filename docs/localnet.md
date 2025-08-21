# Localnet

Quickstart to run a four-node JEMs network locally.

## Run the network

```bash
scripts/run-localnet.sh
```

The script builds the node binary and launches four nodes, each with its own RPC port:

- http://localhost:8080
- http://localhost:8081
- http://localhost:8082
- http://localhost:8083

Nodes 2–4 bootstrap from the first node. Logs are prefixed with the node name so you can follow activity across the network. Use `Ctrl+C` to stop all nodes.

## Faucet

Send a sample transaction to any address via JSON-RPC:

```bash
scripts/faucet.sh <address> [rpc-url]
```

Example:

```bash
scripts/faucet.sh jem1qqqqqq
```

The script issues a `submitTx` RPC call and prints the response.
