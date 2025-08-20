export default function Home() {
  return (
    <main className='max-w-5xl px-6 py-12 mx-auto space-y-8'>
      <h1 className='text-3xl font-bold'>Hello BAPI!</h1>

      <section>
        <h2 className='mb-4 text-xl font-semibold'>Navigation Demo</h2>
        <p className='text-sm text-neutral-600'>
          The mega-menu lives in the global header. Hover “Products”,
          “Resources”, etc., to demo it.
        </p>
      </section>

      {/* Removed UI Primitives demo for interview polish */}
    </main>
  );
}
