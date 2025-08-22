const steps = [
  {
    title: 'Track Consentful Engagement',
    desc: 'Users opt in via a lightweight tracker or wallet; events are signed and rate‑limited.'
  },
  {
    title: 'PoE Epochs + VRF',
    desc: 'Engagement transforms into epoch weight; a VRF picks proposers/committee slots transparently.'
  },
  {
    title: 'Committee Finality',
    desc: 'A HotStuff‑style protocol finalizes blocks quickly with clear safety/liveness guarantees.'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-2xl font-semibold text-center mb-8">How it works</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {steps.map((s) => (
          <div key={s.title} className="p-4 border rounded-lg bg-white">
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-slate-600 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
