'use client';
import { cn } from '@/lib/utils';
import { useOutsideClose } from './useOutsideClose';
import { NAV } from '../data/nav.data';

export default function MobileDrawer({
  open,
  onOpen,
}: {
  open: boolean;
  onOpen: (v: boolean) => void;
}) {
  const ref = useOutsideClose<HTMLDivElement>(() => onOpen(false));
  return (
    <>
      <button
        className='inline-flex items-center justify-center border rounded-md md:hidden h-9 w-9'
        aria-expanded={open}
        aria-controls='mobile-drawer'
        onClick={() => onOpen(!open)}
      >
        <span className='sr-only'>Open menu</span>
        <div className='w-4 h-4'>
          <div className='h-0.5 w-full bg-black' />
          <div className='mt-1 h-0.5 w-full bg-black' />
          <div className='mt-1 h-0.5 w-full bg-black' />
        </div>
      </button>

      <div
        id='mobile-drawer'
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[320px] transform border-r bg-white shadow-xl transition-transform md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div ref={ref} className='h-full px-3 pb-10 overflow-y-auto'>
          <div className='flex items-center justify-between px-1 py-4'>
            <p className='text-sm font-semibold'>BAPI Navigation</p>
            <button
              onClick={() => onOpen(false)}
              className='px-2 py-1 text-sm border rounded-md hover:bg-neutral-100'
            >
              Close
            </button>
          </div>
          {NAV.map((group) => (
            <div key={group.label} className='px-1'>
              <p className='mt-3 mb-1 text-xs tracking-wide uppercase text-neutral-500'>
                {group.label}
              </p>
              {group.columns.map((col) => (
                <div key={col.title} className='mb-2'>
                  <p className='px-1 text-xs text-neutral-500'>{col.title}</p>
                  <ul className='mt-1'>
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href || '#'}
                          className='block rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100'
                          data-analytics={`nav:${group.label}:${l.label}`}
                          onClick={() => onOpen(false)}
                        >
                          <span>{l.label}</span>
                          {l.badge ? (
                            <span className='ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700'>
                              {l.badge}
                            </span>
                          ) : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className='w-full h-px my-2 bg-neutral-200' />
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      <button
        aria-hidden
        className={cn(
          'fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => onOpen(false)}
      />
    </>
  );
}
