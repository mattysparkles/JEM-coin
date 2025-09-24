const GQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://127.0.0.1:4001/graphql';

export async function checkGraphQL(timeoutMs = 3000): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(GQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ chainMeta { height } }' }),
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
