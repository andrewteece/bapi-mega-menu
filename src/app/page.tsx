import TestButton from '@/components/ui/TestButton';

export default function Home() {
  return (
    <main className='p-8 space-y-8'>
      <h1 className='text-3xl font-bold'>Hello BAPI!</h1>

      {/* (Optional) remove this section if you don’t want any menu in the body */}
      <section>
        <h2 className='mb-4 text-xl font-semibold'>Navigation Demo</h2>
        <p className='text-sm text-neutral-600'>
          The mega‑menu lives in the global header. Hover “Temperature”, etc.,
          to demo it.
        </p>
      </section>

      <section>
        <h2 className='mb-4 text-xl font-semibold'>UI Primitives Demo</h2>
        <div className='space-x-4'>
          <TestButton variant='primary' size='md'>
            Primary
          </TestButton>
          <TestButton variant='secondary' size='sm'>
            Secondary
          </TestButton>
          <TestButton variant='primary' size='lg'>
            Large Button
          </TestButton>
        </div>
      </section>
    </main>
  );
}
