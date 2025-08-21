import { createServer } from 'http';
import { createYoga, createSchema, createPubSub } from 'graphql-yoga';

const typeDefs = `
  type Block { hash: String!, height: Int! }
  type Tx { id: ID!, raw: String }
  type Account { address: String!, balance: Int! }
  type ChainMeta { height: Int! }
  type Query {
    block(height: Int, hash: String): Block
    tx(id: ID!): Tx
    account(address: String!): Account
    chainMeta: ChainMeta
  }
  type Subscription {
    newBlock: Block
    newTx: Tx
  }
`;

const pubsub = createPubSub();

const resolvers = {
  Query: {
    block: (_root, args) => ({ hash: args.hash || '0x0', height: args.height || 0 }),
    tx: (_root, { id }) => ({ id, raw: '' }),
    account: (_root, { address }) => ({ address, balance: 0 }),
    chainMeta: () => ({ height: 0 }),
  },
  Subscription: {
    newBlock: {
      subscribe: () => pubsub.subscribe('NEW_BLOCK'),
    },
    newTx: {
      subscribe: () => pubsub.subscribe('NEW_TX'),
    },
  },
};

const yoga = createYoga({ schema: createSchema({ typeDefs, resolvers }) });
const server = createServer(yoga);

server.listen(4001, () => {
  console.log('GraphQL gateway on http://localhost:4001/graphql');
  setInterval(() => pubsub.publish('NEW_BLOCK', { newBlock: { hash: '0x' + Date.now().toString(16), height: Date.now() } }), 5000);
  setInterval(() => pubsub.publish('NEW_TX', { newTx: { id: Date.now().toString(), raw: '' } }), 7000);
});
