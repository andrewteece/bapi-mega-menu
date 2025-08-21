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
          open
            ? 'translate-y-0 rotate-45 delay-75'
            : '-translate-y-2 rotate-0 delay-0'
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
          open
            ? 'translate-y-0 -rotate-45 delay-100'
            : 'translate-y-2 rotate-0 delay-75'
        )}
      />
    </button>
  );
}
