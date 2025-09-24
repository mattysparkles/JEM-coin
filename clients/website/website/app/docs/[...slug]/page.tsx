import { notFound } from 'next/navigation';
import DocLayout from '@/components/DocLayout';
import { getDocBySlug, getDocSlugs, getDocsList } from '@/lib/docs';

// Ensure this route is fully static so prerendered pages are served
// and we don't attempt runtime filesystem access in production.
export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  const slugs = await getDocSlugs();
  return slugs.map((s) => ({ slug: s }));
}

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const doc = await getDocBySlug(params.slug);
  if (!doc) return notFound();
  const docs = await getDocsList();
  return <DocLayout docs={docs} toc={doc.toc}>{doc.content}</DocLayout>;
}
