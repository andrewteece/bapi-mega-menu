# Navigation Primitives

Reusable navigation building blocks for Next.js + Tailwind projects.  
These are polished, accessible, motion-safe, and production-ready.

---

## Components

### NavTrigger.tsx
```tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type NavTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  open: boolean;
  /** For a11y: id of the controlled drawer/sheet */
  controlsId?: string;
  /** Line color; pass e.g. 'bg-white' or 'bg-neutral-900' */
  lineClassName?: string;
};

/** Boxed 40×40 trigger with polished morph animation + a11y + reduced-motion */
export default function NavTrigger({
  open,
  controlsId,
  lineClassName = 'bg-white',
  className,
  ...props
}: NavTriggerProps) {
  return (
    <button
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls={controlsId}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-md',
        'border border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2',
        'motion-safe:transition-transform motion-safe:duration-200 hover:scale-110 active:scale-95',
        'relative will-change-transform',
        className
      )}
      {...props}
    >
      {/* hamburger -> X with micro-stagger */}
      <span
        className={cn(
          'absolute block h-0.5 w-6 rounded',
          lineClassName,
          'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out',
          open ? 'translate-y-0 rotate-45 delay-75' : '-translate-y-2 rotate-0 delay-0'
        )}
      />
      <span
        className={cn(
          'absolute block h-0.5 w-6 rounded',
          lineClassName,
          'motion-safe:transition-opacity motion-safe:duration-200',
          open ? 'opacity-0' : 'opacity-100'
        )}
      />
      <span
        className={cn(
          'absolute block h-0.5 w-6 rounded',
          lineClassName,
          'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out',
          open ? 'translate-y-0 -rotate-45 delay-100' : 'translate-y-2 rotate-0 delay-75'
        )}
      />
    </button>
  );
}

### MegaPanel.tsx

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type MegaPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Controls visibility/animation */
  open: boolean;
  /** Max content width (Tailwind container size). Example: 'max-w-7xl' */
  maxWidthClass?: string;
  /** Clamp to viewport with gutter (default 2rem → 32px gutters) */
  clampGutterRem?: number;
};

/**
 * Anchors to the nearest positioned ancestor (header's inner wrapper should be `relative`).
 * Centers the panel and clamps its width so it never overflows at medium breakpoints.
 */
export default function MegaPanel({
  open,
  children,
  className,
  maxWidthClass = 'max-w-7xl',
  clampGutterRem = 2,
  ...props
}: MegaPanelProps) {
  const clampClass = `w-[min(100vw-${clampGutterRem}rem,72rem)]`;

  return (
    <div
      className={cn(
        'absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2',
        'mx-auto',
        maxWidthClass,
        clampClass,
        'overflow-hidden rounded-2xl border bg-white p-4 shadow-xl ring-1 ring-black/5',
        'origin-top motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out',
        open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
        className
      )}
      role="region"
      {...props}
    >
      {children}
    </div>
  );
}

