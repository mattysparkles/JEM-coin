import fs from 'fs/promises';
import path from 'path';
import React from 'react';

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
  try {
    // Lightweight runtime trace to diagnose 404s in production
    console.log('[docs] existing dirs:', out);
  } catch {}
  return out;
}

export type Doc = { content: React.ReactElement; toc: { id: string; text: string }[] };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  let html = '';
  let inCode = false;
  let codeLang = '';
  let inUl = false;
  let inOl = false;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      html += `<p>${inline(para.join(' '))}</p>`;
      para = [];
    }
  };
  const openUl = () => { if (!inUl) { flushPara(); html += '<ul>'; inUl = true; } };
  const closeUl = () => { if (inUl) { html += '</ul>'; inUl = false; } };
  const openOl = () => { if (!inOl) { flushPara(); html += '<ol>'; inOl = true; } };
  const closeOl = () => { if (inOl) { html += '</ol>'; inOl = false; } };

  const inline = (s: string) => {
    // links [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    // inline code `code`
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    return s;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (!inCode) {
        flushPara(); closeUl(); closeOl();
        codeLang = line.slice(3).trim();
        html += `<pre><code class="language-${escapeHtml(codeLang)}">`;
        inCode = true;
      } else {
        html += `</code></pre>`;
        inCode = false; codeLang = '';
      }
      continue;
    }
    if (inCode) {
      html += `${escapeHtml(line)}\n`;
      continue;
    }
    if (!line.trim()) {
      flushPara(); closeUl(); closeOl();
      continue;
    }
    if (line.startsWith('### ')) {
      flushPara(); closeUl(); closeOl();
      const text = line.slice(4).trim();
      const id = slugify(text);
      html += `<h3 id="${id}"><a href="#${id}">${escapeHtml(text)}</a></h3>`;
      continue;
    }
    if (line.startsWith('## ')) {
      flushPara(); closeUl(); closeOl();
      const text = line.slice(3).trim();
      const id = slugify(text);
      html += `<h2 id="${id}"><a href="#${id}">${escapeHtml(text)}</a></h2>`;
      continue;
    }
    if (line.startsWith('# ')) {
      flushPara(); closeUl(); closeOl();
      const text = line.slice(2).trim();
      const id = slugify(text);
      html += `<h1 id="${id}"><a href="#${id}">${escapeHtml(text)}</a></h1>`;
      continue;
    }
    if (line === '---') {
      flushPara(); closeUl(); closeOl();
      html += '<hr/>';
      continue;
    }
    if (/^\- \[[ xX]\] /.test(line)) {
      openUl();
      const checked = /\[x\]/i.test(line) ? ' checked' : '';
      const text = line.replace(/^\- \[[ xX]\] /, '');
      html += `<li><input type="checkbox" disabled${checked}/> ${inline(escapeHtml(text))}</li>`;
      continue;
    }
    if (line.startsWith('- ')) {
      openUl();
      html += `<li>${inline(escapeHtml(line.slice(2).trim()))}</li>`;
      continue;
    }
    const m = line.match(/^\d+\.\s+(.*)$/);
    if (m) {
      openOl();
      html += `<li>${inline(escapeHtml(m[1]))}</li>`;
      continue;
    }
    // paragraph text
    para.push(escapeHtml(line));
  }
  flushPara(); closeUl(); closeOl();
  return html;
}

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
      const candidate = path.join(d, `${slug.join('/')}.md`);
      console.log('[docs] try file', candidate);
      let source = await fs.readFile(candidate, 'utf8');
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
        const id = slugify(text);
        return { id, text };
      });
      const html = markdownToHtml(source);
      const content = React.createElement('div', { dangerouslySetInnerHTML: { __html: html } });
      return { content, toc };
    } catch (e) {
      try {
        console.log('[docs] miss or error for slug', slug.join('/'));
        if (e instanceof Error) console.log('[docs] error:', e.message);
      } catch {}
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
