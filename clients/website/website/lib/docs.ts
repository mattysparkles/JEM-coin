import fs from 'fs/promises';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolink from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';

// Resolve docs from both monorepo and fallback repo-deploy if present.
const DOCS_DIRS = [
  path.join(process.cwd(), 'content', 'docs'), // bundled with the site if present
  path.join(process.cwd(), '..', '..', '..', 'docs'), // monorepo root
  path.join(process.cwd(), '..', '..', '..', '..', 'repo-deploy', 'docs'), // fallback
];

async function existingDocsDirs(): Promise<string[]> {
  const out: string[] = [];
  for (const d of DOCS_DIRS) {
    try {
      const st = await fs.stat(d);
      if (st.isDirectory()) out.push(d);
    } catch {}
  }
  return out;
}

export type Doc = { content: React.ReactElement; toc: { id: string; text: string }[] };

export async function getDocSlugs(): Promise<string[][]> {
  const dirs = await existingDocsDirs();
  const set = new Set<string>();
  for (const d of dirs) {
    const files = await fs.readdir(d);
    for (const f of files) if (f.endsWith('.md')) set.add(f.replace(/\.md$/, ''));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b)).map((s) => [s]);
}

export async function getDocBySlug(slug: string[]): Promise<Doc | null> {
  const dirs = await existingDocsDirs();
  for (const d of dirs) {
    try {
      let source = await fs.readFile(path.join(d, `${slug.join('/')}.md`), 'utf8');
      // Special handling for whitepaper drafts that may contain both
      // an intro stub and the full text. If a second top-level heading
      // exists, prefer rendering from that point onward.
      if (slug.length === 1 && slug[0] === 'whitepaper') {
        const firstH1 = source.indexOf('# ');
        const nextH1 = source.indexOf('\n# ', Math.max(0, firstH1 + 2));
        if (nextH1 !== -1) {
          // Slice from the second H1 and drop the leading newline
          source = source.slice(nextH1 + 1);
        }
      }
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
          rehypePlugins: [rehypeRaw as any, rehypeSlug as any, [rehypeAutolink as any, { behavior: 'wrap' }]],
        },
      },
    });
      return { content, toc };
    } catch (e) {
      // try next dir
    }
  }
  return null;
}

export async function getDocsList(): Promise<{ slug: string; title: string }[]> {
  const slugs = await getDocSlugs();
  const out: { slug: string; title: string }[] = [];
  for (const s of slugs) {
    const slug = s[0];
    let source = '';
    for (const d of await existingDocsDirs()) {
      try {
        source = await fs.readFile(path.join(d, `${slug}.md`), 'utf8');
        break;
      } catch {}
    }
    if (!source) continue;
    const title = source.split('\n')[0].replace(/^#\s*/, '').trim() || slug;
    out.push({ slug, title });
  }
  return out;
}
