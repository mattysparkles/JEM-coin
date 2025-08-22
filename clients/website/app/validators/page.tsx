'use client'
import { useState } from 'react'

export default function ValidatorsPage() {
  const [status, setStatus] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/apply', { method: 'POST', body: form })
    const json = await res.json()
    if (json.ok) {
      setStatus('Application received — we will be in touch.')
      e.currentTarget.reset()
    } else {
      setStatus(json.error || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Early Engagement Validators</h1>
      <p className="mt-2 text-slate-600">Run with us from the ground floor. Tell us about your infra and experience. We prioritize reliability, observability, and constructive feedback. Expect evolving specs and hands‑on collaboration.</p>

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
          <label className="block text-sm font-medium">Org or Solo</label>
          <input name="orgOrSolo" className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <span className="block text-sm font-medium">Infra profile</span>
          <div className="mt-1 flex flex-wrap gap-2">
            <label className="inline-flex items-center"><input type="checkbox" name="infra" value="bare-metal" /> <span className="ml-2">bare-metal</span></label>
            <label className="inline-flex items-center"><input type="checkbox" name="infra" value="k8s" /> <span className="ml-2">k8s</span></label>
            <label className="inline-flex items-center"><input type="checkbox" name="infra" value="cloud-vm" /> <span className="ml-2">cloud VM</span></label>
            <label className="inline-flex items-center"><input type="checkbox" name="infra" value="home-lab" /> <span className="ml-2">home lab</span></label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Region / Timezone</label>
          <input name="region" className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">GitHub</label>
          <input name="github" className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Twitter</label>
          <input name="twitter" className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Motivation</label>
          <textarea name="motivation" rows={5} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded">Apply</button>
        </div>

        {status && <div role="status" aria-live="polite" className="text-sm text-slate-700">{status}</div>}
      </form>
    </div>
  )
}

