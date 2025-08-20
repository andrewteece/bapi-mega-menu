'use client';

import Link from 'next/link';
import BapiMegaMenu from '@/components/navigation/BapiMegaMenu';
import { MobileMenu } from '@/components/navigation/MobileMenu';

export default function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 w-full bg-white border-b'>
      <div className='flex items-center justify-between px-4 py-3 mx-auto max-w-7xl md:py-4'>
        {/* Brand */}
        <Link href='/' className='text-lg font-bold tracking-wide'>
          BAPI Mock
        </Link>

        {/* Desktop: show Products + Resources as mega items */}
        <nav className='items-center hidden gap-8 md:flex'>
          <BapiMegaMenu includeLabels={['Products', 'Resources']} />
        </nav>

        {/* Mobile: drawer */}
        <div className='md:hidden'>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
