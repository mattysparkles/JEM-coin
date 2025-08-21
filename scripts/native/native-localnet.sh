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
$TMUX_CMD send-keys -t "$SESSION":node1 "jems-node run --rpc 127.0.0.1:8080" C-m

$TMUX_CMD new-window -t "$SESSION" -n node2
$TMUX_CMD send-keys -t "$SESSION":node2 "jems-node run --rpc 127.0.0.1:8081" C-m

$TMUX_CMD new-window -t "$SESSION" -n node3
$TMUX_CMD send-keys -t "$SESSION":node3 "jems-node run --rpc 127.0.0.1:8082" C-m

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

# Extension dev runner
$TMUX_CMD new-window -t "$SESSION" -n extension
$TMUX_CMD send-keys -t "$SESSION":extension "pnpm --filter jems-wallet-extension dev" C-m

# Example site
$TMUX_CMD new-window -t "$SESSION" -n site
$TMUX_CMD send-keys -t "$SESSION":site "pnpm --filter jems-site-example dev" C-m

cat <<MSG
Local JEMs network started.
RPC endpoints:
  http://localhost:8080
  http://localhost:8081
  http://localhost:8082
Explorer:       http://localhost:3000
Params Dash:    http://localhost:3000/params
Governance UI:  http://localhost:3001
Actions Lab:    http://localhost:3002
Example Site:   http://localhost:3003
Indexer:        http://localhost:4000/graphql

Attach to the tmux session with:
  tmux attach -t $SESSION
MSG
