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

Configure `.env.local` using `.env.local.example`.

