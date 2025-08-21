'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type MegaPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Controls visibility/animation */
  open: boolean;
  /** Max content width (Tailwind container size). Example: 'max-w-7xl' */
  maxWidthClass?: string;
  /** Clamp to viewport with gutter (default 2rem → use 32px gutters) */
  clampGutterRem?: number;
};

/**
 * Anchors to the nearest positioned ancestor (your header's inner wrapper should be `relative`).
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
  // Build clamp class like w-[min(100vw-2rem,72rem)] using tailwind arbitrary values.
  // Consumers should ensure their container uses the same max width (e.g., max-w-7xl).
  const clampClass = `w-[min(100vw-${clampGutterRem}rem,72rem)]`;

  return (
    <div
      className={cn(
        'absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2',
        'mx-auto',
        maxWidthClass,
        clampClass,
        // surface
        'overflow-hidden rounded-2xl border bg-white p-4 shadow-xl ring-1 ring-black/5',
        // motion
        'origin-top motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out',
        open
          ? 'visible translate-y-0 opacity-100'
          : 'invisible -translate-y-1 opacity-0',
        className
      )}
      role='region'
      {...props}
    >
      {children}
    </div>
  );
}
