import fs from 'fs/promises';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolink from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import { rehypeGlossary } from './glossary';

const DOCS_DIR = path.join(process.cwd(), '..', '..', 'docs');

export type Doc = { content: React.ReactElement; toc: { id: string; text: string }[] };

export async function getDocSlugs(): Promise<string[][]> {
  const files = await fs.readdir(DOCS_DIR);
  return files.filter((f) => f.endsWith('.md')).map((f) => [f.replace(/\.md$/, '')]);
}

export async function getDocBySlug(slug: string[]): Promise<Doc | null> {
  try {
    let source = await fs.readFile(path.join(DOCS_DIR, `${slug.join('/')}.md`), 'utf8');
    // convert task lists to disabled checkboxes
    source = source.replace(/^- \[ \] /gm, '- <input type="checkbox" disabled /> ');
    source = source.replace(/^- \[x\] /gim, '- <input type="checkbox" disabled checked /> ');
    const toc = Array.from(source.matchAll(/^##\s+(.*)/gm)).map((m) => {
      const text = m[1];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { id, text };
    });
    const { content } = await compileMDX({
      source,
      options: {
        // remark-gfm typings are incompatible with our setup
        mdxOptions: {
          // rehype plugins types are not compatible
          remarkPlugins: [remarkGfm as any],
        rehypePlugins: [rehypeRaw as any, rehypeGlossary as any, rehypeSlug as any, [rehypeAutolink as any, { behavior: 'wrap' }]],
        },
      },
    });
    return { content, toc };
  } catch (e) {
    return null;
  }
}

export async function getDocsList(): Promise<{ slug: string; title: string }[]> {
  const slugs = await getDocSlugs();
  const out: { slug: string; title: string }[] = [];
  for (const s of slugs) {
    const filePath = path.join(DOCS_DIR, `${s[0]}.md`);
    const source = await fs.readFile(filePath, 'utf8');
    const title = source.split('\n')[0].replace(/^#\s*/, '').trim();
    out.push({ slug: s[0], title });
  }
  return out;
}
