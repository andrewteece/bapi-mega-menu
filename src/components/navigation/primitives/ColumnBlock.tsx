'use client';

import type { NavColumn, NavLink } from '../data/nav.data';

export default function ColumnBlock({ title, links }: NavColumn) {
  return (
    <div className='min-w-[220px]'>
      {title && (
        <h4 className='mb-2 text-[11px] font-semibold uppercase tracking-wide text-brand dark:text-brand-light'>
          {title}
        </h4>
      )}
      <ul className='space-y-1.5' role='menu' aria-label={title ?? 'Links'}>
        {links.map((l: NavLink) => (
          <li key={l.label} role='menuitem'>
            <a
              href={l.href}
              className='group flex items-center justify-between rounded-md px-2 py-1.5 text-[15px] leading-tight
                         text-neutral-800 dark:text-neutral-100
                         transition-colors
                         hover:bg-brand/10 hover:text-brand
                         dark:hover:bg-white/10 dark:hover:text-brand-light'
            >
              <span className='inline-flex items-center gap-2'>
                <span
                  className='h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600
                             transition-colors group-hover:bg-brand dark:group-hover:bg-brand-light'
                />
                {l.label}
              </span>
              {l.badge ? (
                <span className='ml-2 rounded bg-brand/10 dark:bg-brand/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand'>
                  {l.badge}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
