'use client'
import { useState } from 'react'

export default function JoinPage() {
  const [status, setStatus] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/join', { method: 'POST', body: form })
    const json = await res.json()
    if (json.ok) {
      setStatus('Thanks — you are on the waitlist!')
      e.currentTarget.reset()
    } else {
      setStatus(json.error || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Join the Waitlist</h1>
      <p className="mt-2 text-slate-600">Get updates, testnet invites, and early docs. Add your email and what you’d like to build or validate. We’ll reach out with the next steps.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" required className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">I'm interested in</label>
          <select name="interest" className="mt-1 w-full border rounded px-3 py-2">
            <option value="builder">Builder</option>
            <option value="validator">Validator</option>
            <option value="user">User</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Notes (optional)</label>
          <textarea name="notes" rows={4} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded">Join</button>
        </div>

        {status && <div role="status" aria-live="polite" className="text-sm text-slate-700">{status}</div>}
      </form>
    </div>
  )
}

