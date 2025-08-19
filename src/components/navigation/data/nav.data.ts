// Types kept near data so they’re reusable
export type LinkItem = { label: string; href?: string; badge?: string };
export type Column = { title: string; links: LinkItem[] };
export type NavItem = {
  label: string;
  columns: Column[];
  highlight?: { title: string; desc: string; cta: string; href: string };
};

// BAPI-like top-level families
export const NAV: NavItem[] = [
  {
    label: 'Temperature',
    columns: [
      {
        title: 'Form Factor',
        links: [
          { label: 'Room / Wall', href: '#' },
          { label: 'Duct', href: '#' },
          { label: 'Immersion / Well', href: '#' },
          { label: 'Outdoor', href: '#' },
          { label: 'Averaging', href: '#' },
          { label: 'Wireless', href: '#', badge: 'Popular' },
        ],
      },
      {
        title: 'Signals',
        links: [
          { label: 'RTD / Thermistor', href: '#' },
          { label: '4–20 mA / 0–10 V', href: '#' },
          { label: 'BACnet', href: '#' },
        ],
      },
      {
        title: 'Featured',
        links: [
          { label: 'High Accuracy', href: '#' },
          { label: 'Harsh Environments', href: '#' },
        ],
      },
    ],
    highlight: {
      title: 'BAPI‑Backed® Quality',
      desc: 'Calibrated sensors, documented accuracy, industry‑leading support.',
      cta: 'See program',
      href: '#',
    },
  },
  // ... Humidity, Pressure, Air Quality, Accessories, Applications, Resources, Support, About (unchanged)
];
