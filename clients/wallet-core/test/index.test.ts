import { addressFromPublicKey } from '../src';

const pk = new Uint8Array([1,2,3]);
const addr = addressFromPublicKey(pk);
if (!addr.startsWith('jem')) {
  throw new Error('address must start with jem');
}
console.log('address', addr);
