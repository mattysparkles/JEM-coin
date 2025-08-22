"use client"
import { useState, ReactNode } from 'react'
import GLOSSARY from '@/lib/glossary'

export default function Tooltip({ term, children }: { term: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = `glossary-${term.replace(/[^a-z0-9]/gi, '-')}`
  const def = GLOSSARY[term] || GLOSSARY[term.replace(/\-/g, ' ')] || term
  return (
    <span className="inline-block relative">
      <button
        aria-describedby={id}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((s) => !s)}
        className="underline-dotted focus:outline-none"
        style={{ textDecoration: 'underline dotted' }}
      >
        {children}
      </button>
      {open && (
        <div id={id} role="tooltip" className="absolute z-10 mt-2 w-64 p-3 bg-white border rounded shadow text-sm text-slate-800">
          {def}
        </div>
      )}
    </span>
  )
}
