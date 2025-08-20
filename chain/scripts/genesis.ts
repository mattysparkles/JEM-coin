import { writeFileSync } from 'fs';

// Placeholder genesis generator
const node = process.argv[2] || 'node1';
const config = {
  node,
  rpcPort: 8545,
  p2pPort: 7001,
};
writeFileSync(`${node}-config.json`, JSON.stringify(config, null, 2));
console.log(`Generated config for ${node}`);
