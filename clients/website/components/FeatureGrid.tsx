import Tooltip from '@/components/Tooltip'

const features = [
  {
    title: 'PoE‑VRF Consensus',
    description: 'Blocks proposed via verifiable randomness weighted by engagement—spam‑resistant, fair, and measurable.'
  },
  {
    title: 'Committee Finality',
    description: 'HotStuff‑style finality gives fast, deterministic confirmation with slashing for misbehavior.'
  },
  {
    title: 'Built for Builders',
    description: 'Clean JSON‑RPC & GraphQL, reference wallet, and an on‑site engagement tracker you can embed.'
  }
];

export default function FeatureGrid() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Why JEM</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">
              {f.title.includes('PoE‑VRF') ? (
                <><Tooltip term="PoE-VRF">PoE‑VRF</Tooltip> Consensus</>
              ) : (
                f.title
              )}
            </h3>
            <p className="text-slate-600 text-sm">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
