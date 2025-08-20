# JEMs development shortcuts

build:
    cargo build --workspace
    pnpm -r build || true

test:
    cargo test --all --locked || true
    pnpm -r test || true

localnet:
    ./scripts/native/native-localnet.sh

stop:
    ./scripts/native/native-stop.sh

seed:
    ./scripts/native/seed-actions.sh
