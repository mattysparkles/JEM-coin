export type ChainMeta = {
  height: number;
  finalizedHeight: number;
  epoch: number;
  round: number;
  peers: number;
};

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:7070';

export async function rpc<T>(method: string, params: unknown[] = [], timeoutMs = 5000): Promise<T> {
  const controller = new AbortController();
  const id = Date.now();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error.message || 'RPC Error');
    return json.result as T;
  } finally {
    clearTimeout(timeout);
  }
}

export function getChainMeta(): Promise<ChainMeta> {
  return rpc<ChainMeta>('getChainMeta');
}
