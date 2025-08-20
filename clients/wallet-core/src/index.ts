export function addressFromPublicKey(pk: Uint8Array): string {
  // simple bech32 placeholder using hex
  return 'jem' + Buffer.from(pk).toString('hex');
}
