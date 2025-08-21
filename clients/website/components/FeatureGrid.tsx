const features = [
  {
    title: 'Secure',
    description: 'Built with modern cryptography.'
  },
  {
    title: 'Scalable',
    description: 'Designed for fast finality.'
  },
  {
    title: 'Open',
    description: 'Fully open-source and extensible.'
  }
];

export default function FeatureGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-10">Why JEMs</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="text-center p-4">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-700">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
