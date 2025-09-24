import { notFound } from 'next/navigation';
import DocLayout from '@/components/DocLayout';
import { getDocBySlug, getDocsList } from '@/lib/docs';

export const dynamic = 'force-static';

export default async function WhitepaperPage() {
  // Try common slugs in order
  const candidates = [['whitepaper'], ['protocol-v0.3']];
  let doc: Awaited<ReturnType<typeof getDocBySlug>> = null;
  for (const c of candidates) {
    // eslint-disable-next-line no-await-in-loop
    doc = await getDocBySlug(c);
    if (doc) break;
  }
  if (!doc) return notFound();
  const docs = await getDocsList();
  return <DocLayout docs={docs} toc={doc.toc}>{doc.content}</DocLayout>;
}

