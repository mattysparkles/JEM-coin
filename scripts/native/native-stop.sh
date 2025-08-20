#!/usr/bin/env bash
set -euo pipefail
SESSION=jems
TMUX_CMD=${TMUX_CMD:-tmux}
if $TMUX_CMD has-session -t "$SESSION" 2>/dev/null; then
  $TMUX_CMD kill-session -t "$SESSION"
  echo "Stopped JEMs tmux session"
else
  echo "No JEMs tmux session running"
fi
