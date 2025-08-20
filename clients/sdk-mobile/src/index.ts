import { sha256 } from 'js-sha256';

export interface PresenceArgs {
  landmarkId: string;
  timeWindow: string;
  actorSalt: string;
}

export function emitPresence(args: PresenceArgs) {
  const preimage = `${args.landmarkId}|${args.timeWindow}|${args.actorSalt}`;
  const commitment = sha256(preimage);
  const witness_blob_stub = 'mobile_stub';
  return { commitment, witness: witness_blob_stub };
}
