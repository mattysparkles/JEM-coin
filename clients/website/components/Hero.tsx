export default function Hero({ explorerUrl }: { explorerUrl?: string }) {
  const gh = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mattysparkles/JEM-coin'
  return (
    <section className="py-20 text-center" id="main">
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">JEM: Proof‑of‑Engagement, not just Proof‑of‑Work.</h1>
      <p className="mb-6 text-lg text-slate-700 max-w-2xl mx-auto">JEM is a PoE‑VRF blockchain where real user activity fuels consensus. Earn, validate, and build on a chain that measures what actually matters: people showing up and engaging.</p>

      <div className="mt-6 flex justify-center gap-3">
        <a href={gh} className="px-4 py-2 bg-slate-900 text-white rounded-lg">View on GitHub</a>
        <a href="/join" className="px-4 py-2 border rounded-lg">Join the Waitlist</a>
        <a href="/validators" className="px-4 py-2 border rounded-lg">Apply as Validator</a>
      </div>
    </section>
  )
}
