#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <address> [rpc-url]" >&2
  exit 1
fi

ADDR="$1"
RPC="${2:-http://localhost:8080}"

curl -s -X POST "$RPC" \
  -H 'Content-Type: application/json' \
  -d "{\"method\":\"submitTx\",\"params\":{\"to\":\"$ADDR\",\"amount\":100}}" | jq .

