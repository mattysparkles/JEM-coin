import { redirect } from 'next/navigation';
import { getDocsList } from '@/lib/docs';

export default async function DocsIndex() {
  const docs = await getDocsList();
  if (docs.length > 0) redirect(`/docs/${docs[0].slug}`);
  redirect('/');
}
