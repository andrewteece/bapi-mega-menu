'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import BapiMegaMenu from '../navigation/BapiMegaMenu';
import MobileMenu from '../navigation/MobileMenu'; // default import

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className='sticky top-0 z-50 w-full text-white border-b border-neutral-200 bg-brand'>
      {/* ADD: relative to anchor mega-menu panels */}
      <div className='relative mx-auto flex items-center justify-between px-4 py-3 max-w-7xl sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link
          href='/'
          className='flex items-center gap-2 font-semibold text-white'
        >
          <span className='flex h-6 w-6 items-center justify-center rounded bg-white text-xs font-bold text-brand'>
            B
          </span>
          <span>BAPI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden md:flex md:items-center md:gap-6'>
          <BapiMegaMenu />
          <Link
            href='/about'
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              'hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
            )}
          >
            About
          </Link>
          <Link
            href='/support'
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              'hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
            )}
          >
            Support
          </Link>
        </nav>

        {/* Mobile hamburger (SheetTrigger is inside MobileMenu) */}
        <MobileMenu open={mobileOpen} onOpen={setMobileOpen} />
      </div>
    </header>
  );
}
