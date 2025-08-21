'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='
        inline-flex h-9 w-9 items-center justify-center rounded-md
        border border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2
        transition
      '
    >
      {isDark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
    </button>
  );
}
