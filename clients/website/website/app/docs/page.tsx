import Link from 'next/link';
import { getDocsList } from '@/lib/docs';

export const dynamic = 'force-static';

export default async function DocsIndex() {
  const docs = await getDocsList();
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Documentation</h1>
      {docs.length === 0 ? (
        <p>No docs found.</p>
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {docs.map((d) => (
            <li key={d.slug}>
              <Link className="text-blue-600 hover:underline" href={`/docs/${d.slug}`}>{d.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
