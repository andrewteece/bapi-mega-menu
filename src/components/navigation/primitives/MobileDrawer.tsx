'use client';

import { cn } from '@/lib/utils';
import { useOutsideClose } from './useOutsideClose';
import {
  NAV,
  type NavItem,
  type NavColumn,
  type NavLink,
} from '../data/nav.data';

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
      {/* trigger handled by parent; this is the drawer itself */}
      <div
        id='mobile-drawer'
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[320px] transform border-r bg-white shadow-xl transition-transform md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div ref={ref} className='h-full px-3 pb-10 overflow-y-auto'>
          <div className='flex items-center justify-between px-1 py-4'>
            <p className='text-sm font-semibold text-brand'>BAPI Navigation</p>
            <button
              onClick={() => onOpen(false)}
              className='px-2 py-1 text-sm border rounded-md text-brand hover:bg-brand/10'
            >
              Close
            </button>
          </div>

          {NAV.map((group: NavItem) => (
            <div key={group.label} className='px-1'>
              <p className='mt-3 mb-1 text-xs tracking-wide uppercase text-brand'>
                {group.label}
              </p>

              {group.columns.map((col: NavColumn) => (
                <div key={col.title} className='mb-2'>
                  <p className='px-1 text-xs text-neutral-500'>{col.title}</p>
                  <ul className='mt-1'>
                    {col.links.map((l: NavLink) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className='block rounded-md px-2 py-1.5 text-sm text-neutral-800 transition hover:bg-brand/10 hover:text-brand'
                          data-analytics={`nav:${group.label}:${l.label}`}
                          onClick={() => onOpen(false)}
                        >
                          <span>{l.label}</span>
                          {l.badge ? (
                            <span className='ml-2 rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand'>
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
        aria-label='Close mobile navigation'
        className={cn(
          'fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => onOpen(false)}
      />
    </>
  );
}
