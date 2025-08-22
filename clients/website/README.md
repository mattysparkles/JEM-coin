# Website

Next.js marketing + docs site for JEM.

Run locally:

```
pnpm install
pnpm dev
```

Build:

```
pnpm build
pnpm start
```

Form data storage:

- Form submissions are appended as newline-delimited JSON in `DATA_DIR` (defaults to `./data`).
- Waitlist: `waitlist.ndjson`
- Validators: `validators.ndjson`

Glossary & docs

- Add new glossary terms in `lib/glossary.ts`. The site provides a `Tooltip` component and a `/glossary` page.
- Docs (including the whitepaper) live in the repo `docs/` directory and are rendered at `/docs/*`.

Status proxy

- The site uses a server-side RPC proxy at `/api/rpc-proxy/chainMeta` to avoid exposing internal node ports or running into CORS issues. Configure `RPC_INTERNAL_URL` in `.env.local` to point at your internal node (default `http://127.0.0.1:7070`).
- In browsers, `NEXT_PUBLIC_RPC_URL` defaults to `/api/rpc` which is safe; the proxy will forward to `RPC_INTERNAL_URL` on the server.

Explorer

- Set `NEXT_PUBLIC_EXPLORER_URL` in `.env.local` to enable the Explorer link in the header. The site exposes `/explorer` which redirects to this URL or shows a placeholder page.

Configure `.env.local` using `.env.local.example`.
