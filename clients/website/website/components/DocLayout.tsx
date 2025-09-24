import Link from 'next/link';

export default function DocLayout({
  children,
  docs,
  toc,
}: {
  children: React.ReactNode;
  docs: { slug: string; title: string }[];
  toc: { id: string; text: string }[];
}) {
  return (
    <div className="flex w-full">
      <aside className="w-64 p-4 border-r hidden md:block">
        <nav className="space-y-2">
          {docs.map((d) => (
            <Link key={d.slug} href={`/docs/${d.slug}`} className="block hover:underline">
              {d.title}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="prose flex-1 p-4">
        {children}
      </article>
      {toc.length > 0 && (
        <aside className="w-64 p-4 border-l hidden lg:block">
          <h2 className="font-semibold mb-2">On this page</h2>
          <ul className="space-y-1 text-sm">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="hover:underline">
                  {t.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
