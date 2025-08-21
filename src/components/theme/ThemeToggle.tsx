'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleToggle = useCallback(() => {
    const active = theme === 'system' ? systemTheme : theme;
    const isDark = active === 'dark';
    setTheme(isDark ? 'light' : 'dark');

    // brief pulse on toggle (respects motion-safe)
    setBurst(true);
    window.setTimeout(() => setBurst(false), 260);
  }, [theme, systemTheme, setTheme]);

  if (!mounted) {
    return (
      <button
        aria-label='Toggle theme'
        className='inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/5'
      />
    );
  }

  const active = theme === 'system' ? systemTheme : theme;
  const isDark = active === 'dark';

  return (
    <button
      aria-label='Toggle theme'
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      onClick={handleToggle}
      className='
        relative inline-flex h-9 w-9 items-center justify-center rounded-md
        border border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2
        transition
        text-white
      '
    >
      {/* Pulse burst (short-lived) */}
      {burst && (
        <span
          className='
            pointer-events-none absolute inset-0 rounded-full
            bg-white/20 dark:bg-white/10
            motion-safe:animate-ping
          '
        />
      )}

      {/* Icon stack (cross-fade + rotate/scale) */}
      <span className='relative inline-block h-4 w-4'>
        {/* Sun for dark -> light (visible when dark) */}
        <Sun
          className={[
            'absolute inset-0 h-4 w-4',
            'motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out',
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-75',
          ].join(' ')}
        />
        {/* Moon for light -> dark (visible when light) */}
        <Moon
          className={[
            'absolute inset-0 h-4 w-4',
            'motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out',
            isDark
              ? 'opacity-0 rotate-90 scale-75'
              : 'opacity-100 rotate-0 scale-100',
          ].join(' ')}
        />
      </span>
    </button>
  );
}
