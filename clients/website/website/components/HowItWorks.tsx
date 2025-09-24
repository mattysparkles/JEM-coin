const steps = [
  'Install a node',
  'Join the network',
  'Start building',
];

export default function HowItWorks() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">How it works</h2>
      <ol className="max-w-2xl mx-auto list-decimal list-inside space-y-4 text-lg">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </section>
  );
}
