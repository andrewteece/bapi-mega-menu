'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ColumnBlock from './ColumnBlock';
import { useOutsideClose } from './useOutsideClose';
import type { NavItem } from '../data/nav.data';

type Props = {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

export default function DesktopMegaItem({
  item,
  isOpen,
  onOpen,
  onClose,
  onToggle,
}: Props) {
  const panelRef = useOutsideClose<HTMLDivElement>(onClose);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [timer, setTimer] = React.useState<number | null>(null);
  const panelId = React.useId();

  const openWithIntent = () => {
    if (timer) window.clearTimeout(timer);
    setTimer(window.setTimeout(onOpen, 80));
  };
  const closeWithGrace = () => {
    if (timer) window.clearTimeout(timer);
    setTimer(window.setTimeout(onClose, 140));
  };
  const cancelTimers = () => {
    if (timer) window.clearTimeout(timer);
  };

  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onEsc);
      return () => document.removeEventListener('keydown', onEsc);
    }
  }, [isOpen, onClose]);

  return (
    // NOTE: remove 'relative' here so the panel anchors to the header container
    <div>
      {/* Trigger styled for brand header */}
      <button
        ref={buttonRef}
        type='button'
        aria-haspopup='true'
        aria-expanded={isOpen}
        aria-controls={panelId}
        onMouseEnter={openWithIntent}
        onMouseLeave={closeWithGrace}
        onFocus={openWithIntent}
        onBlur={closeWithGrace}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
          if (e.key === 'Escape') onClose();
        }}
        className={cn(
          'group inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium',
          'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          isOpen
            ? 'bg-white/10 text-white'
            : 'text-white/90 hover:bg-white/10 hover:text-white'
        )}
      >
        <span>{item.label}</span>
        <svg
          className={cn(
            'h-3.5 w-3.5 text-white/80 transition-transform duration-150',
            isOpen && 'rotate-180'
          )}
          viewBox='0 0 16 16'
          aria-hidden='true'
        >
          <path d='M4 6l4 4 4-4' fill='currentColor' />
        </svg>
        <span className='sr-only'>{isOpen ? 'close menu' : 'open menu'}</span>
      </button>

      {/* Panel anchored to header container (centered & clamped) */}
      <div
        id={panelId}
        ref={panelRef}
        role='region'
        aria-label={`${item.label} menu`}
        onMouseEnter={cancelTimers}
        onMouseLeave={closeWithGrace}
        className={cn(
          // anchor to header inner wrapper (which is now relative)
          'absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2',
          // center within container and clamp to viewport with gutter
          'mx-auto max-w-7xl w-[min(100vw-2rem,72rem)]',
          // panel surface
          'overflow-hidden rounded-2xl border bg-white p-4 shadow-xl ring-1 ring-black/5',
          // motion
          'origin-top motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-1 opacity-0'
        )}
      >
        {/* subtle brand wash */}
        <div className='rounded-lg bg-brand/5 p-3'>
          {/* Top utility row */}
          <div className='mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='relative w-full md:max-w-xs'>
              <span className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400'>
                🔎
              </span>
              <input
                type='search'
                placeholder='Search products, docs, SKUs…'
                className='w-full rounded-md border px-8 py-2 text-sm outline-none transition focus:border-brand-light focus:ring-2 focus:ring-brand-light/40'
              />
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Spec Sheets', href: '/resources/spec-sheets' },
                {
                  label: 'Application Notes',
                  href: '/resources/application-notes',
                },
              ].map((q) => (
                <a
                  key={q.label}
                  href={q.href}
                  className='rounded-md border bg-brand/80 px-2 py-1 text-sm transition hover:bg-brand/10 hover:text-brand'
                >
                  {q.label}
                </a>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
            {/* Columns */}
            <div className='md:col-span-8 lg:col-span-9'>
              <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
                {(item.columns ?? []).map((col) => (
                  <ColumnBlock
                    key={col.title}
                    title={col.title}
                    links={col.links}
                  />
                ))}
              </div>
            </div>

            {/* Highlight / promo rail */}
            <div className='md:col-span-4 lg:col-span-3'>
              <div className='rounded-xl border bg-brand-accent/10 p-4 transition hover:translate-y-0.5 hover:shadow-md'>
                <p className='text-sm font-semibold text-brand-accent'>
                  BAPI‑Backed Quality
                </p>
                <p className='mt-1 text-sm text-neutral-800'>
                  Reliable sensors and accessories for HVAC pros. Explore spec
                  sheets and application notes.
                </p>
                <Link
                  href='/resources/spec-sheets'
                  className='mt-2 inline-block text-sm font-semibold text-brand-accent hover:underline'
                >
                  View spec sheets →
                </Link>
              </div>

              <div className='mt-3 rounded-xl border bg-white p-4'>
                <p className='text-sm font-semibold text-neutral-900'>
                  Need help choosing?
                </p>
                <p className='mt-1 text-sm text-neutral-700'>
                  Compare temperature sensors by range, accuracy, and mounting.
                </p>
                <Link
                  href='/products/temperature'
                  className='mt-2 inline-block text-sm font-medium text-brand hover:underline'
                >
                  Compare now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
