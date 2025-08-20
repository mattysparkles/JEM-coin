import { sha256 } from 'js-sha256';

export interface PresenceArgs {
  landmarkId: string;
  timeWindow: string;
  actorSalt: string;
}

export function emitPresence({ landmarkId, timeWindow, actorSalt }: PresenceArgs) {
  const preimage = `${landmarkId}|${timeWindow}|${actorSalt}`;
  const commitment = sha256(preimage);
  const witness = Buffer.from('stub').toString('base64');
  // In a real SDK we would persist (commitment, witness) locally.
  return { commitment, witness };
}
