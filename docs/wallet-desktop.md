# Desktop Wallet (Tauri)

The desktop wallet hosts a React UI inside a Tauri shell. The backend is written in Rust and links against `wallet-core` for key management and light‑client verification.

## Features

- Generate BIP39 mnemonics and derive ed25519 + VRF keys.
- Sync block headers and verify BLS finality.
- Display balance, action weight and per‑epoch caps.
- Optional engagement mining with periodic WebAuthn or biometric liveness checks.

## Development

```
pnpm --filter jems-wallet-desktop dev  # placeholder UI
```

## Troubleshooting

If the app fails to start, ensure that Rust and Node dependencies are installed and that the localnet is running.
