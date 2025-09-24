# Database Options

The indexer can run in two modes:

1. **SQLite (default)** – zero configuration. Set `INDEXER_SQLITE_PATH` or rely on `.env.dev`.
2. **Postgres** – install PostgreSQL locally and set `INDEXER_DB_URL` (see `.env.postgres`).

Run migrations with:

```bash
scripts/migrate.sh
```

The script detects which backend to target based on the environment variables above.
