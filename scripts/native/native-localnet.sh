#!/usr/bin/env bash
set -euo pipefail

# Build the Rust workspace
BUILD_MODE="debug"
if [[ "${1:-}" == "release" ]]; then
  BUILD_MODE="release"
fi

cargo build --workspace --${BUILD_MODE}

SESSION=jems
TMUX_CMD=${TMUX_CMD:-tmux}

# Kill existing session if present
if $TMUX_CMD has-session -t "$SESSION" 2>/dev/null; then
  $TMUX_CMD kill-session -t "$SESSION"
fi

# Start three jems nodes
$TMUX_CMD new-session -d -s "$SESSION" -n node1
$TMUX_CMD send-keys -t "$SESSION":node1 "jems-node --rpc-port 8545 --p2p-port 7001 --data-dir .local/node1" C-m

$TMUX_CMD new-window -t "$SESSION" -n node2
$TMUX_CMD send-keys -t "$SESSION":node2 "jems-node --rpc-port 8546 --p2p-port 7002 --data-dir .local/node2" C-m

$TMUX_CMD new-window -t "$SESSION" -n node3
$TMUX_CMD send-keys -t "$SESSION":node3 "jems-node --rpc-port 8547 --p2p-port 7003 --data-dir .local/node3" C-m

sleep 5

# Start indexer and web apps
$TMUX_CMD new-window -t "$SESSION" -n indexer
$TMUX_CMD send-keys -t "$SESSION":indexer "pnpm --filter jems-indexer start" C-m

$TMUX_CMD new-window -t "$SESSION" -n web
$TMUX_CMD send-keys -t "$SESSION":web "pnpm --filter explorer dev" C-m
$TMUX_CMD split-window -t "$SESSION":web
$TMUX_CMD send-keys -t "$SESSION":web.1 "pnpm --filter governance-ui dev" C-m
$TMUX_CMD split-window -t "$SESSION":web.1
$TMUX_CMD send-keys -t "$SESSION":web.2 "pnpm --filter actions-lab dev" C-m

cat <<MSG
Local JEMs network started.
RPC endpoints:
  http://localhost:8545
  http://localhost:8546
  http://localhost:8547
Explorer:       http://localhost:3000
Governance UI:  http://localhost:3001
Actions Lab:    http://localhost:3002
Indexer:        http://localhost:4000/graphql

Attach to the tmux session with:
  tmux attach -t $SESSION
MSG
