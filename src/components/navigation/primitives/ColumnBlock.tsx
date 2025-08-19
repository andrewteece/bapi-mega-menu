'use client';
import { Column } from '../data/nav.data';

export default function ColumnBlock({ title, links }: Column) {
  return (
    <div className='space-y-2'>
      <p className='text-xs font-medium tracking-wide uppercase text-neutral-500'>
        {title}
      </p>
      <ul className='space-y-1'>
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href || '#'}
              className='group flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400'
              data-analytics={`nav:${title}:${l.label}`}
            >
              <span className='flex items-center gap-2'>
                <span
                  aria-hidden
                  className='h-1.5 w-1.5 rounded-full bg-neutral-400 group-hover:bg-neutral-600'
                />
                {l.label}
              </span>
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
  );
}
