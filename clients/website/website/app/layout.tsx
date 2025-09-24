import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import ConsentBanner from '@/components/ConsentBanner';
const explorer = process.env.NEXT_PUBLIC_EXPLORER_URL;

export const metadata: Metadata = {
  title: 'JEMs',
  description: 'JEMs marketing and docs',
  openGraph: {
    title: 'JEMs',
    description: 'JEMs marketing and docs',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white text-gray-900">
        <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="font-semibold">JEM</a>
            <nav className="flex items-center gap-6 text-sm">
              <a href="/docs" className="hover:text-blue-600">Docs</a>
              <a href="/whitepaper" className="hover:text-blue-600">Whitepaper</a>
              <a href="/glossary" className="hover:text-blue-600">Glossary</a>
              {explorer ? <a href={explorer} className="hover:text-blue-600">Explorer</a> : null}
              <a href="/join" className="hover:text-blue-600">Join</a>
              <a href="/validators" className="hover:text-blue-600">Validators</a>
              <a href="/status" className="hover:text-blue-600">Status</a>
              <a href="/privacy" className="hover:text-blue-600">Privacy</a>
            </nav>
          </div>
        </header>
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
