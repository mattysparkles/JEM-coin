'use client';

import { useEffect, useState, useRef } from 'react';
import StatusCard from '@/components/StatusCard';
import { ChainMeta } from '@/lib/rpc';
import { checkGraphQL } from '@/lib/gql';

export default function StatusPage() {
  const [meta, setMeta] = useState<ChainMeta | null>(null);
  const [latency, setLatency] = useState(0);
  const [error, setError] = useState('');
  const [gqlOk, setGqlOk] = useState<boolean | null>(null);

  const consecutiveFailures = useRef(0)

  async function fetchMeta() {
    const start = performance.now();
    try {
      const res = await fetch('/api/rpc-proxy/chainMeta');
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.ok === false) throw new Error(json.error || 'rpc error')
      // assume json has the chain meta shape
      setMeta(json as ChainMeta);
      setLatency(Math.round(performance.now() - start));
      setError('');
      consecutiveFailures.current = 0
    } catch (e: any) {
      consecutiveFailures.current += 1
      setError('Node offline or unreachable')
      if (consecutiveFailures.current >= 3) {
        // pause auto refresh by clearing intervals in effect cleanup
      }
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
