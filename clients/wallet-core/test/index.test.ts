import { bech32 } from 'bech32';
import { addressFromPublicKey } from '../src';

const pk = new Uint8Array([1, 2, 3]);
const addr = addressFromPublicKey(pk);
const decoded = bech32.decode(addr);

if (decoded.prefix !== 'jem') {
  throw new Error('address must start with jem');
}

const bytes = new Uint8Array(bech32.fromWords(decoded.words));
if (bytes.toString() !== pk.toString()) {
  throw new Error('decoded bytes mismatch');
}

console.log('address', addr);
