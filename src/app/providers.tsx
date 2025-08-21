'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute='class' // adds 'class="dark"' on <html> or <body>
      defaultTheme='system' // respect OS
      enableSystem
      disableTransitionOnChange // avoid flash when toggling
    >
      {children}
    </ThemeProvider>
  );
}
