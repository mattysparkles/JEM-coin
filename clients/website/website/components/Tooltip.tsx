"use client";
import React, { useState, useRef, useEffect } from 'react';
import { glossary } from '@/lib/glossary';

export default function Tooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const label = glossary[term] || glossary[term.replace(/\s+/g, ' ')] || '';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <span className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
        className="underline decoration-dotted underline-offset-2 focus:outline-none"
      >
        {children}
      </button>
      {label && (
        <div
          role="tooltip"
          aria-hidden={!open}
          className={`z-50 w-64 p-3 text-sm text-left bg-white border rounded shadow-md absolute mt-2 ${open ? 'block' : 'hidden'}`}
        >
          <div className="font-semibold mb-1">{term}</div>
          <div className="text-sm text-gray-700">{label}</div>
        </div>
      )}
    </span>
  );
}
