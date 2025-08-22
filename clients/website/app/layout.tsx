import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import ConsentBanner from '@/components/ConsentBanner';
import { siteMetadata } from '@/lib/seo';

export const metadata: Metadata = siteMetadata as Metadata

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white text-gray-900">
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-semibold">JEM</a>
            <nav className="space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/join" className="hover:underline">Join</a>
              <a href="/validators" className="hover:underline">Validators</a>
              <a href="/roadmap" className="hover:underline">Roadmap</a>
              <a href="/status" className="hover:underline">Status</a>
              <a href="/docs" className="hover:underline">Docs</a>
              <a href="/glossary" className="hover:underline">Glossary</a>
              {process.env.NEXT_PUBLIC_EXPLORER_URL && <a href={process.env.NEXT_PUBLIC_EXPLORER_URL} className="hover:underline">Explorer</a>}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-8">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600 flex justify-between">
            <div>
              <div className="font-semibold">JEM</div>
              <div>Proof of Engagement — human-first consensus.</div>
            </div>
            <div className="flex gap-4 items-center">
              <a href={process.env.NEXT_PUBLIC_GITHUB_URL} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
              <a href="mailto:hello@jemcoins.com" className="hover:underline">Contact</a>
              <a href="/privacy" className="hover:underline">Privacy</a>
            </div>
          </div>
        </footer>
        <ConsentBanner />
      </body>
    </html>
  );
}
