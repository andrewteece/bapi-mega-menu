'use client';

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Menu, ChevronRight } from 'lucide-react';
import { NAV } from '@/components/navigation/data/nav.data';

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' aria-label='Open menu'>
          <Menu className='w-5 h-5' />
        </Button>
      </SheetTrigger>

      <SheetContent side='left' className='w-80'>
        {/* Visible, accessible title (satisfies Radix a11y) */}
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
                          <div className='text-xs font-semibold tracking-wide uppercase text-neutral-500'>
                            {col.title}
                          </div>
                        )}
                        <ul className='space-y-1'>
                          {col.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className='flex items-center justify-between rounded-md px-2 py-1.5 text-[15px] hover:bg-neutral-100'
                              >
                                <span>{link.label}</span>
                                <ChevronRight className='w-4 h-4 text-neutral-400' />
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

          {/* Extra static links */}
          <div className='mt-6 space-y-1'>
            <div className='text-xs font-semibold tracking-wide uppercase text-neutral-500'>
              Other
            </div>
            <ul className='space-y-1'>
              {/* <li>
                <Link
                  href='/resources'
                  className='block rounded-md px-2 py-1.5 text-[15px] hover:bg-neutral-100'
                >
                  Resources
                </Link>
              </li> */}
              <li>
                <Link
                  href='/contact'
                  className='block rounded-md px-2 py-1.5 text-[15px] hover:bg-neutral-100'
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
