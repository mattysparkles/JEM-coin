# JemsTracker Integration

JemsTracker is a tiny analytics-style snippet that site owners can drop into any page to reward user actions with JEM tickets.

## Quickstart

```html
<script src="/jems.track.js" data-site-token="SITE_XXXX" defer></script>
```

On load it installs `window.JemsTracker` with methods:

- `configure({ siteToken, rules, sampling, rateLimits })`
- `status()` → `{ hasProvider: boolean }`
- `on(event, cb)` – `ticket-accepted` and `rejected` hooks
- `emit(kind, meta)` – hash `meta` and forward to the wallet extension if present

Events such as `page_view` are emitted automatically. Custom events can be triggered from the page:

```js
window.JemsTracker.emit('purchase', { amount: 42 });
```

Metadata is hashed client‑side so that raw data never leaves the browser. Consent is expected to be handled by the host page (for example via IAB TCFv2) before calling `emit`.

## Security Notes

- Per‑origin caps and debouncing must be enforced by the wallet.
- Site owners may optionally validate events using an HMAC over their event schema.
- The tracker never sends data to JEMs servers; events are relayed to the user's wallet extension or paired mobile device.
