'use client';

import { useEffect, useId, useRef, useState } from 'react';
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
  const id = useId();
  const panelRef = useOutsideClose<HTMLDivElement>(onClose);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [alignRight, setAlignRight] = useState(false);

  // Decide whether to align right based on available space
  const measureAndOpen = () => {
    // Run after layout so measurements are accurate
    requestAnimationFrame(() => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const panelWidth = 780; // intended panel width
        const gutter = 16; // 1rem breathing room
        const roomRight = window.innerWidth - rect.left;
        setAlignRight(roomRight < panelWidth + gutter);
      }
      onOpen();
    });
  };

  // Close with ESC when focused inside this item/panel
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <div className='relative'>
      <button
        ref={buttonRef}
        className={cn(
          'px-3 py-2 rounded-md text-sm font-medium',
          isOpen ? 'bg-neutral-100' : 'hover:bg-neutral-100'
        )}
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
        onClick={onToggle}
        onMouseEnter={measureAndOpen}
        onFocus={measureAndOpen}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            measureAndOpen();
          }
        }}
      >
        {item.label}
        <span className='sr-only'> open menu</span>
      </button>

      {/* Mega panel */}
      <div
        id={`panel-${id}`}
        ref={panelRef}
        role='region'
        aria-label={`${item.label} menu`}
        onMouseLeave={onClose}
        className={cn(
          // positioning (auto-flip near right edge)
          'absolute top-full z-40 mt-2',
          alignRight ? 'right-0 left-auto' : 'left-0',
          // never overflow viewport; cap at 780px
          'w-[min(100vw-2rem,780px)]',
          // panel styling
          'rounded-lg border bg-white p-4 shadow-xl',
          // layout
          'grid grid-cols-12 gap-6',
          isOpen ? 'block' : 'hidden'
        )}
      >
        {/* Columns */}
        <div className='grid grid-cols-1 col-span-12 gap-6 md:col-span-8 md:grid-cols-3'>
          {item.columns.map((col) => (
            <ColumnBlock key={col.title} {...col} />
          ))}
        </div>

        {/* Right rail (quick find + highlight) */}
        <div className='hidden space-y-3 md:block md:col-span-4'>
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Quick find</p>
            <input
              className='w-full px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-neutral-400'
              placeholder='Search products, docs, SKUs…'
              aria-label='Quick find'
            />
          </div>
          <div className='w-full h-px bg-neutral-200' />
          {item.highlight ? (
            <div className='p-4 border rounded-lg bg-neutral-50'>
              <p className='text-sm font-semibold'>{item.highlight.title}</p>
              <p className='mt-1 text-sm text-neutral-600'>
                {item.highlight.desc}
              </p>
              <a
                href={item.highlight.href}
                className='inline-block mt-2 text-sm font-medium underline'
              >
                {item.highlight.cta}
              </a>
            </div>
          ) : (
            <p className='text-sm text-neutral-600'>
              Explore documentation, downloads, and application notes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
