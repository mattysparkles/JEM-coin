import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import ConsentBanner from '@/components/ConsentBanner';

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
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
