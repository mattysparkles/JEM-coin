"use client"
import { useState } from 'react'
import GLOSSARY, { GLOSSARY_TERMS } from '@/lib/glossary'

export default function GlossaryPage() {
  const [q, setQ] = useState('')
  const terms = GLOSSARY_TERMS.filter((t) => t.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Glossary</h1>
      <p className="text-slate-600 mt-2">Short plain-English definitions for JEM terms. Click a term to read more.</p>
      <div className="mt-4">
        <input className="w-full border rounded px-3 py-2" placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <ul className="mt-6 space-y-4">
        {terms.map((t) => (
          <li key={t} className="border p-4 rounded">
            <div className="font-semibold">{t}</div>
            <div className="text-slate-700 mt-1">{GLOSSARY[t]}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
