'use client';

import { useEffect, useState } from 'react';
import DesktopMegaItem from './primitives/DesktopMegaItem';
import MobileDrawer from './primitives/MobileDrawer';
import { NAV } from './data/nav.data';

export default function BapiMegaMenu() {
  // Centralized state: which desktop item is open (null = none)
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Global ESC behavior: close desktop panel or mobile drawer
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openIndex !== null) setOpenIndex(null);
      if (mobileOpen) setMobileOpen(false);
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [openIndex, mobileOpen]);

  return (
    <nav aria-label='Primary' className='flex items-center gap-1'>
      {/* Desktop */}
      <div className='items-center hidden gap-1 md:flex'>
        {NAV.map((item, idx) => (
          <DesktopMegaItem
            key={item.label}
            item={item}
            isOpen={openIndex === idx}
            onOpen={() => setOpenIndex(idx)}
            onClose={() => setOpenIndex(null)}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>

      {/* Mobile */}
      <div className='md:hidden'>
        <MobileDrawer open={mobileOpen} onOpen={setMobileOpen} />
      </div>
    </nav>
  );
}
