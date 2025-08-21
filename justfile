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

website-dev:
    cd clients/website && pnpm dev

website-build:
    cd clients/website && pnpm build

website-start:
    cd clients/website && pnpm start
