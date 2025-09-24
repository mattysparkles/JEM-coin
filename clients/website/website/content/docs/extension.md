# Browser Extension Wallet

Pages interact with the extension through `window.jems`.

## Provider API

- `jems.requestConsent({ siteId })` – prompts the user to authorize a site.
- `jems.getAddress()` – resolves to the active account address.
- `jems.getWeight()` – resolves to the current engagement weight.
- `jems.emit(kind, { metaHash })` – submit a hashed `ActionEvent`.
- `jems.revokeConsent(siteId)` – remove a previously approved origin.

The extension maintains a light client in a background service worker and periodically prompts the user for liveness via WebAuthn.
