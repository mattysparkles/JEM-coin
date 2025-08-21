import assert from 'assert';
import { resolvers, paramsSnapshots } from './index';

// Ensure empty state returns undefined
assert.strictEqual(resolvers.Query.latestParams(), undefined);

paramsSnapshots.push({ epoch: 1, targetDifficulty: '1', params: { a: 1 }, recordedAt: new Date().toISOString() });
paramsSnapshots.push({ epoch: 2, targetDifficulty: '2', params: { a: 2 }, recordedAt: new Date().toISOString() });

const latest = resolvers.Query.latestParams();
assert.strictEqual(latest.epoch, 2);

const range = resolvers.Query.paramsSnapshots(null, { range: { start: 2 } });
assert.strictEqual(range.length, 1);
console.log('ok');
