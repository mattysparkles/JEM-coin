'use client';

import { useEffect, useState } from 'react';
import StatusCard from '@/components/StatusCard';
import { getChainMeta, ChainMeta } from '@/lib/rpc';
import { checkGraphQL } from '@/lib/gql';

export default function StatusPage() {
  const [meta, setMeta] = useState<ChainMeta | null>(null);
  const [latency, setLatency] = useState(0);
  const [error, setError] = useState('');
  const [gqlOk, setGqlOk] = useState<boolean | null>(null);

  async function fetchMeta() {
    const start = performance.now();
    try {
      const m = await getChainMeta();
      setMeta(m);
      setLatency(Math.round(performance.now() - start));
      setError('');
    } catch (e) {
      setError('Failed to fetch status');
    }
  }

  async function pingGql() {
    setGqlOk(await checkGraphQL());
  }

  useEffect(() => {
    fetchMeta();
    pingGql();
    const id = setInterval(fetchMeta, 5000);
    const gqlId = setInterval(pingGql, 5000);
    return () => {
      clearInterval(id);
      clearInterval(gqlId);
    };
  }, []);

  return (
    <main className="p-4">
      {error && <div className="mb-4 bg-red-100 text-red-800 p-2">{error}</div>}
      {meta && <StatusCard meta={meta} latency={latency} gqlOk={gqlOk} />}
    </main>
  );
}
