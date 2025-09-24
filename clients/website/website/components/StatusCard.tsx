import { ChainMeta } from '@/lib/rpc';

export default function StatusCard({ meta, latency, gqlOk }: { meta: ChainMeta; latency: number; gqlOk: boolean | null }) {
  return (
    <div className="border rounded p-4">
      <dl className="grid grid-cols-2 gap-2">
        <dt>Height</dt><dd>{meta.height}</dd>
        <dt>Finalized</dt><dd>{meta.finalizedHeight}</dd>
        <dt>Epoch</dt><dd>{meta.epoch}</dd>
        <dt>Round</dt><dd>{meta.round}</dd>
        <dt>Peers</dt><dd>{meta.peers}</dd>
        <dt>Latency</dt><dd>{latency}ms</dd>
        <dt>GraphQL</dt><dd>{gqlOk === null ? '...' : gqlOk ? 'ok' : 'error'}</dd>
      </dl>
    </div>
  );
}
