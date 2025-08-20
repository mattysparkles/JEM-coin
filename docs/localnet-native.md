# Native Localnet

The `scripts/native/native-localnet.sh` script boots a three node JEMs network and supporting services using `tmux`.

## Usage

```bash
just localnet
```

This builds the Rust workspace and then launches:

- three `jems-node` instances with RPC on ports 8545–8547 and P2P on 7001–7003
- the TypeScript indexer
- web clients: explorer, governance UI and actions lab

All processes run inside a tmux session named `jems`. Attach with:

```bash
tmux attach -t jems
```

Stop everything with:

```bash
just stop
```

## Port Overview

| Service | Port |
| ------- | ---- |
| Node RPC | 8545 / 8546 / 8547 |
| Explorer | 3000 |
| Governance UI | 3001 |
| Actions Lab | 3002 |
| Indexer | 4000 |
