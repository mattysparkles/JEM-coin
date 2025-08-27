import React from 'react';
import { termList, glossary } from '@/lib/glossary';

export default function GlossaryPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Glossary</h1>
      <p className="mb-6 text-gray-700">Plain-English definitions for JEM terms.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {termList.map((t) => (
          <div key={t} className="border p-3 rounded">
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-gray-700 mt-1">{glossary[t]}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
