import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { gql } from 'apollo-server-express';
import { collectDefaultMetrics, Registry } from 'prom-client';
import fs from 'fs';
import fetch from 'node-fetch';

// Simple in-memory data store
const blocks: any[] = [];
const tickets: any[] = [];
const honeypots: any[] = [];
const committees: Record<string, any[]> = {};
export const paramsSnapshots: any[] = [];

// GraphQL schema mirroring the expected API
export const typeDefs = gql`
  scalar JSON

  type Block {
    id: ID!
    height: Int!
    epoch: Int
    slot: Int
    leader_pk: String
    vrf_out: String
    tx_count: Int
    ticket_count: Int
    timestamp: String
  }

  type Ticket {
    id: ID!
    actor_pk: String!
    epoch: Int!
    kind: String!
    commitment: String
    accepted: Boolean
    created_at: String
  }

  type HoneyPot {
    id: ID!
    seed_hash: String!
    status: String!
    expires_epoch: Int
  }

  type CommitteeMember {
    pk: String!
    signed: Boolean!
  }

  type ParamsSnapshot {
    epoch: Int!
    targetDifficulty: String!
    params: JSON!
    recordedAt: String!
  }

  input EpochRangeInput { start: Int, end: Int }

  type Query {
    block(height: Int!): Block
    blocks(limit: Int = 10, offset: Int = 0): [Block!]!
    tickets(actor_pk: String, epoch: Int): [Ticket!]!
    honeypots(status: String): [HoneyPot!]!
    committee(block_id: ID!): [CommitteeMember!]!
    paramsSnapshots(range: EpochRangeInput): [ParamsSnapshot!]!
    latestParams: ParamsSnapshot
  }
`;

export const resolvers = {
  Query: {
    block: (_: any, { height }: { height: number }) => blocks.find(b => b.height === height),
    blocks: (_: any, { limit, offset }: any) => blocks.slice(offset, offset + limit),
    tickets: (_: any, { actor_pk, epoch }: any) =>
      tickets.filter(t => (!actor_pk || t.actor_pk === actor_pk) && (!epoch || t.epoch === epoch)),
    honeypots: (_: any, { status }: any) => honeypots.filter(h => !status || h.status === status),
    committee: (_: any, { block_id }: any) => committees[block_id] || [],
    paramsSnapshots: (_: any, { range }: any) => {
      return paramsSnapshots.filter((p: any) =>
        (!range?.start || p.epoch >= range.start) && (!range?.end || p.epoch <= range.end)
      );
    },
    latestParams: () => paramsSnapshots[paramsSnapshots.length - 1],
  }
};

export async function start() {
  const app = express();
  const registry = new Registry();
  collectDefaultMetrics({ register: registry });

  // Very small demonstration of env based DB selection
  const sqlitePath = process.env.INDEXER_SQLITE_PATH;
  const pgUrl = process.env.INDEXER_DB_URL;
  if (pgUrl) {
    console.log(`Using Postgres database at ${pgUrl}`);
  } else {
    const path = sqlitePath || '.local/indexer.db';
    console.log(`Using SQLite database at ${path}`);
    fs.mkdirSync('.local', { recursive: true });
  }

  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
  });

  app.get('/healthz', (_req, res) => res.send('ok'));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  async function snapshot() {
    try {
      const paramsRes = await fetch('http://localhost:8080', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ method: 'get_params' })
      });
      const paramsJson = await paramsRes.json();
      const epochRes = await fetch('http://localhost:8080', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ method: 'get_epoch_info' })
      });
      const epochJson = await epochRes.json();
      paramsSnapshots.push({
        epoch: epochJson.result.epoch,
        targetDifficulty: String(epochJson.result.target_difficulty),
        params: paramsJson.result,
        recordedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error('snapshot failed', e);
    }
  }

  snapshot();
  setInterval(snapshot, 5000);

  app.listen({ port: 4000 }, () => {
    console.log('Indexer API ready at http://localhost:4000');
  });
}

if (require.main === module) {
  start();
}
