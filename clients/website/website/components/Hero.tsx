export default function Hero({ explorerUrl }: { explorerUrl?: string }) {
  return (
    <section className="py-24 text-center" id="main">
      <h1 className="text-5xl font-bold mb-6">JEMs</h1>
      <p className="mb-8 text-xl">A lightweight blockchain for everyone.</p>
      <div className="flex justify-center gap-4">
        {explorerUrl ? (
          <a
            href={explorerUrl}
            className="px-6 py-3 bg-blue-600 text-white rounded-md"
          >
            Explorer
          </a>
        ) : null}
        <a
          href="https://github.com/JEM-coin/JEM-coin"
          className="px-6 py-3 border rounded-md"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
