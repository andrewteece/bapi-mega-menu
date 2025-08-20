// app/components/navigation/data/nav.data.ts

// Type definitions
export type NavColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type NavItem = {
  label: string;
  columns: NavColumn[];
  highlight?: {
    title: string;
    desc: string;
    cta: string;
    href: string;
  };
};

// Mock data for testing the mega menu
export const NAV: NavItem[] = [
  {
    label: 'Products',
    columns: [
      {
        title: 'Sensors',
        links: [
          { label: 'Temperature', href: '#' },
          { label: 'Humidity', href: '#' },
          { label: 'Wireless', href: '#' },
        ],
      },
      {
        title: 'Controllers',
        links: [
          { label: 'Wall Units', href: '#' },
          { label: 'Zone Controllers', href: '#' },
          { label: 'Integration', href: '#' },
        ],
      },
      {
        title: 'Accessories',
        links: [
          { label: 'Mounting Kits', href: '#' },
          { label: 'Power Supplies', href: '#' },
          { label: 'Adapters', href: '#' },
        ],
      },
    ],
    highlight: {
      title: 'BAPI-Backed Guarantee',
      desc: 'Learn about our quality promise and industry-leading warranty.',
      cta: 'Read more',
      href: '#',
    },
  },
  {
    label: 'Resources',
    columns: [
      {
        title: 'Documentation',
        links: [
          { label: 'Application Notes', href: '#' },
          { label: 'Catalogs', href: '#' },
          { label: 'Whitepapers', href: '#' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Contact Us', href: '#' },
          { label: 'Warranty Info', href: '#' },
          { label: 'RMA Form', href: '#' },
        ],
      },
      {
        title: 'Media',
        links: [
          { label: 'Videos', href: '#' },
          { label: 'Case Studies', href: '#' },
          { label: 'Press Releases', href: '#' },
        ],
      },
    ],
  },
];
