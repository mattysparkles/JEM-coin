'use client';

import { useEffect, useState } from 'react';
import StatusCard from '@/components/StatusCard';
import { getChainMeta, ChainMeta } from '@/lib/rpc';

export default function StatusPage() {
  const [meta, setMeta] = useState<ChainMeta | null>(null);
  const [latency, setLatency] = useState(0);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchMeta();
    const id = setInterval(fetchMeta, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="p-4">
      {error && <div className="mb-4 bg-red-100 text-red-800 p-2">{error}</div>}
      {meta && <StatusCard meta={meta} latency={latency} />}
    </main>
  );
}
