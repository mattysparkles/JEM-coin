# JEM Agents Guide

This file documents deployment choices, site structure, and the current roadmap so agents reliably work on the correct site version and features.

## Source of Truth

- Website path (served): `repo/clients/website/website`
- Do NOT serve `repo-deploy/clients/website` or any shallow/legacy copy.
- Systemd unit: `jem-website` runs with WorkingDirectory set to the path above.
- Port: `3088` (proxied by Caddy at `https://jemcoins.com`).

## Build & Run (server)

- Build: `cd repo/clients/website/website && pnpm install && pnpm build`
- Start (systemd): `sudo systemctl restart jem-website`
- Logs: `journalctl -u jem-website -f`

## Docs Content

- Primary docs live in `repo/docs`. The site also looks for `repo-deploy/docs` and `repo/clients/website/website/content/docs`.
- If a doc is missing, create `repo/docs/<slug>.md` — it will be included in the next build.
- Whitepaper route: `/whitepaper` renders `whitepaper.md` or falls back to `protocol-v0.3.md`.

## Homepage Copy

- Hero: “JEM — Justify Every Moment”
- Subline: “Proof of Engagement, not Proof of Work — a people‑first, energy‑conscious consensus.”
- Keep the decaying‑tickets + VRF explanation and CTAs for GitHub, Whitepaper, Docs, Join, Validators.

## Tracker MVP (Phase 1)

- Public snippet: `JemsTracker` `<script>` with `data-site-token`. Emits `page_view`, `click(selector)`, and `time_on_page` with signed payloads.
- Coordinator service: issues randomized, TTL‑bounded challenges per site; enforces one‑time claims per device and rate limits.
- Ticket minting: coordinator forwards accepted events to an RPC method that records PoE tickets.
- GPS triggers: ingest POIs (parks, landmarks, events); wallet/PWA checks geofences and rate limits claims per radius/day.

## Explorer MVP (Phase 2)

- Next.js app: blocks, headers, params, health, search; talks to JSON‑RPC/GraphQL.

## Wallets (Phase 2)

- Extension wallet: seed, address, sign, inject `window.jems` provider, emit signed engagement events.
- Desktop wallet (Tauri): same core + optional geofence support.

## Validator Ops (Phase 2)

- Scripts and docs to run nodes; validator apply flow and telemetry page.

## POI Governance (Phase 3)

- Validators propose/moderate POIs; enforce rate limits and prevent abuse.

## Contributing

- Open a PR against this repo; lint/build must pass. Include docs in `repo/docs` for any new feature.
- CI will build the website and run basic Playwright checks.

