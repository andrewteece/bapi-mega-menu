'use client';

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronRight } from 'lucide-react';
import { NAV } from '@/components/navigation/data/nav.data';

type MobileMenuProps = {
  open: boolean;
  onOpen: (v: boolean) => void;
};

export default function MobileMenu({ open, onOpen }: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpen}>
      {/* Trigger (hidden on desktop) */}
      <SheetTrigger asChild>
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className='
            group relative md:hidden
            inline-flex h-10 w-10 items-center justify-center
            rounded-md border border-white/20 bg-white/5
            hover:bg-white/10 active:bg-white/15
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
            motion-safe:transition-transform motion-safe:duration-200 hover:scale-110 active:scale-95
            will-change-transform
          '
        >
          {/* hamburger -> X with micro-stagger */}
          <span
            className={`
              absolute block h-0.5 w-6 rounded bg-white
              motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out
              ${
                open
                  ? 'translate-y-0 rotate-45 delay-75'
                  : '-translate-y-2 rotate-0 delay-0'
              }
            `}
          />
          <span
            className={`
              absolute block h-0.5 w-6 rounded bg-white
              motion-safe:transition-opacity motion-safe:duration-200
              ${open ? 'opacity-0' : 'opacity-100'}
            `}
          />
          <span
            className={`
              absolute block h-0.5 w-6 rounded bg-white
              motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out
              ${
                open
                  ? 'translate-y-0 -rotate-45 delay-100'
                  : 'translate-y-2 rotate-0 delay-75'
              }
            `}
          />
        </button>
      </SheetTrigger>

      {/* Drawer (hidden on desktop) */}
      {/* Hide the default shadcn close button (the gray X) and add smooth slide+fade */}
      <SheetContent
        side='left'
        className='
          w-80 md:hidden [&>button.absolute]:hidden
          motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-in-out
          motion-safe:transform motion-safe:will-change-transform
          data-[state=closed]:opacity-0 data-[state=closed]:-translate-x-full
        '
        aria-label='Main navigation'
      >
        <SheetHeader>
          <SheetTitle>Main Navigation</SheetTitle>
        </SheetHeader>

        <nav className='mt-4'>
          <Accordion type='single' collapsible className='w-full'>
            {NAV.map((item) => (
              <AccordionItem key={item.label} value={item.label}>
                <AccordionTrigger className='text-base font-medium'>
                  {item.label}
                </AccordionTrigger>

                <AccordionContent>
                  <div className='space-y-3'>
                    {(item.columns ?? []).map((col) => (
                      <div key={col.title} className='space-y-2'>
                        {col.title && (
                          <div className='text-xs font-semibold tracking-wide uppercase text-brand'>
                            {col.title}
                          </div>
                        )}
                        <ul className='space-y-1'>
                          {col.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                onClick={() => onOpen(false)}
                                className='flex items-center justify-between rounded-md px-2 py-1.5 text-[15px] text-neutral-800 transition hover:bg-brand/10 hover:text-brand'
                              >
                                <span>{link.label}</span>
                                <ChevronRight className='h-4 w-4 text-neutral-400' />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className='mt-6 space-y-1'>
            <div className='text-xs font-semibold uppercase tracking-wide text-neutral-500'>
              Other
            </div>
            <ul className='space-y-1'>
              <li>
                <Link
                  href='/contact'
                  onClick={() => onOpen(false)}
                  className='block rounded-md px-2 py-1.5 text-[15px] text-neutral-800 transition hover:bg-brand/10 hover:text-brand'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
