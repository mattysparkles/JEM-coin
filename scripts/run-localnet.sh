#!/usr/bin/env bash
set -euo pipefail

# Build the node binary once
cargo build --quiet --bin jems-node

trap 'kill 0' EXIT

start_node() {
  id=$1
  rpc=$2
  shift 2
  cmd="target/debug/jems-node run --rpc 127.0.0.1:${rpc} $*"
  stdbuf -oL -eL $cmd 2>&1 | sed -e "s/^/[node${id}] /" &
}

start_node 1 8080
start_node 2 8081 --bootstrap 127.0.0.1:8080
start_node 3 8082 --bootstrap 127.0.0.1:8080
start_node 4 8083 --bootstrap 127.0.0.1:8080

echo "Localnet running. RPC endpoints:"
echo "  http://localhost:8080"
echo "  http://localhost:8081"
echo "  http://localhost:8082"
echo "  http://localhost:8083"
echo "Press Ctrl-C to stop."

wait

