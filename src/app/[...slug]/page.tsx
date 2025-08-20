'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  // ✅ unwrap the params Promise
  const { slug } = React.use(params);
  const path = '/' + slug.join('/');

  return (
    <main className='flex min-h-[60vh] flex-col items-center justify-center text-center px-6'>
      <h1 className='mb-4 text-3xl font-bold'>🚧 Coming Soon</h1>
      <p className='mb-6 text-gray-600'>
        The page <code className='px-1 py-0.5 bg-gray-100 rounded'>{path}</code>{' '}
        is not ready yet.
      </p>
      <Link href='/'>
        <Button>⬅ Back to Home</Button>
      </Link>
    </main>
  );
}
