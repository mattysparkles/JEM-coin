import { redirect } from 'next/navigation'

export default function ExplorerPage() {
  const url = process.env.NEXT_PUBLIC_EXPLORER_URL
  if (url) redirect(url)
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Explorer — Coming Soon</h1>
      <p className="mt-2 text-slate-600">We plan to ship a block explorer soon. In the meantime see the project repository and open an issue to request features.</p>
      <div className="mt-4">
        <a href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mattysparkles/JEM-coin'} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-900 text-white rounded">Open GitHub Issues</a>
      </div>
    </div>
  )
}

