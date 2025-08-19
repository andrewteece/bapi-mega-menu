import TestButton from '@/components/ui/TestButton';

export default function Home() {
  return (
    <main className='p-8 space-y-4'>
      <h1 className='text-3xl font-bold'>Hello BAPI!</h1>
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
    </main>
  );
}
