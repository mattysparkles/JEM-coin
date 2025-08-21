#!/usr/bin/env bash
set -euo pipefail

curl -s -X POST http://localhost:8080 -H 'content-type: application/json' \
  -d '{"method":"set_params","params":{"lambda_decay":0.75,"ticket_cap_per_epoch":12000}}' > /tmp/update.json

val=$(curl -s -X POST http://localhost:8080 -H 'content-type: application/json' -d '{"method":"get_params"}')
echo "$val" | grep -q '0.75'
if [ $? -eq 0 ]; then
  echo "OK: params updated"
else
  echo "FAILED to update params" >&2
  exit 1
fi
