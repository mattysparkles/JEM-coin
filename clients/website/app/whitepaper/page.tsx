export default function WhitepaperPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Whitepaper & Docs</h1>
      <p className="mt-2 text-slate-600">The canonical protocol documentation is maintained in the GitHub repository. See the README and docs folder for design notes and the protocol spec.</p>
      <div className="mt-6">
        <a href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mattysparkles/JEM-coin'} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-900 text-white rounded">View on GitHub</a>
      </div>
    </div>
  )
}
