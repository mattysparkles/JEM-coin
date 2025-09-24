# Block Explorer

The web explorer is a minimal Next.js app communicating with the indexer via Apollo Client.

## Routes

- `/` – latest blocks table.
- `/honeypots` – list of active or triggered honey pots.

Components such as `BlockHeaderCard` render basic block information. The explorer expects the indexer to run locally on port 4000.
