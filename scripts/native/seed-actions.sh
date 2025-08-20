#!/usr/bin/env bash
set -euo pipefail

# Placeholder script to emit demo actions via wallet-core
if command -v pnpm >/dev/null; then
  pnpm --filter wallet-core exec node ./bin/seed-demo.js
else
  echo "pnpm not found; cannot seed actions" >&2
  exit 1
fi
