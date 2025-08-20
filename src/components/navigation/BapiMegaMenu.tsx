'use client';

import { useEffect, useState } from 'react';
import DesktopMegaItem from './primitives/DesktopMegaItem';
import { NAV } from '@/components/navigation/data/nav.data';

type Props = {
  /** Restrict which top-level labels appear (e.g. ['Products','Resources']) */
  includeLabels?: string[];
};

export default function BapiMegaMenu({ includeLabels }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Close on ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  // Filter which top-level items show on desktop
  const desktopItems = includeLabels?.length
    ? NAV.filter((i) => includeLabels.includes(i.label))
    : NAV;

  return (
    <div aria-label='Primary' className='flex items-center gap-1'>
      {desktopItems.map((item, idx) => (
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
  );
}
