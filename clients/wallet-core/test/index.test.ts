import { bech32 } from 'bech32';
import { addressFromPublicKey, getParams } from '../src';
import { createServer } from 'http';

async function main() {
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

  const server = createServer((_req: any, res: any) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ result: { slot_secs: 4, epoch_slots: 21600 } }));
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const params = await getParams(`http://127.0.0.1:${port}`);
  if (params.slot_secs !== 4) {
    throw new Error('slot_secs mismatch');
  }
  server.close();
}

main();
