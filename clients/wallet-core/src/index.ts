import { bech32 } from 'bech32';

/**
 * Encode a public key into a Bech32 address with the `jem` human readable part.
 *
 * The entire public key bytes are encoded using Bech32's `toWords` function so
 * that the resulting address matches the format used by the Rust `jems-core`
 * crate. No hashing or truncation is performed – callers should provide an
 * already‑derived 32 byte key if a shorter representation is required.
 */
export function addressFromPublicKey(pk: Uint8Array): string {
  const words = bech32.toWords(pk);
  return bech32.encode('jem', words);
}

export interface ProtocolParams {
  slot_secs: number;
  epoch_slots: number;
}

export async function getParams(endpoint: string): Promise<ProtocolParams> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ method: 'get_params' }),
  });
  const json = await res.json();
  return json.result as ProtocolParams;
}
