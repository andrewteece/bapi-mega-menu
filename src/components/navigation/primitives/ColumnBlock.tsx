// src/components/navigation/primitives/ColumnBlock.tsx
'use client';

import type { NavColumn } from '../data/nav.data';

export default function ColumnBlock({ title, links }: NavColumn) {
  return (
    <div className='min-w-[200px]'>
      {title && (
        <h4 className='mb-2 text-xs font-semibold tracking-wide uppercase text-neutral-500'>
          {title}
        </h4>
      )}
      <ul className='space-y-1'>
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className='block rounded-md px-2 py-1.5 text-[15px] hover:bg-neutral-100'
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
