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

export function emit(kind: string, metadata: Record<string, unknown> = {}) {
  const metaHash = sha256(JSON.stringify(metadata));
  const provider = (window as any).jems;
  if (provider && typeof provider.emit === 'function') {
    provider.emit(kind, { metaHash });
  }
  return metaHash;
}
