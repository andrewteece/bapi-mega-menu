// ---------- Types ----------
export type NavLink = {
  label: string;
  href: string;
  badge?: string; // optional (e.g., "New", "Beta", "Sale")
};

export type NavColumn = {
  title: string;
  links: NavLink[];
};

export type NavItem = {
  label: string; // e.g., "Products", "Resources"
  href?: string; // optional top-level link if you want it clickable
  columns: NavColumn[];
  highlight?: {
    title: string;
    desc: string;
    cta: string;
    href: string; // mega menu content
  };
};

// ---------- Data ----------
export const NAV: NavItem[] = [
  {
    label: 'Products',
    columns: [
      {
        title: 'Temperature',
        links: [
          {
            label: 'Room / Wall Sensors',
            href: '/products/temperature/room-wall',
          },
          { label: 'Duct Sensors', href: '/products/temperature/duct' },
          {
            label: 'Immersion / Well',
            href: '/products/temperature/immersion',
          },
        ],
      },
      {
        title: 'Humidity',
        links: [
          { label: 'Wall Mount', href: '/products/humidity/wall' },
          { label: 'Duct Mount', href: '/products/humidity/duct' },
          { label: 'Outdoor', href: '/products/humidity/outdoor' },
        ],
      },
      {
        title: 'Wireless',
        links: [
          { label: 'Gateways', href: '/products/wireless/gateways' },
          {
            label: 'Transmitters',
            href: '/products/wireless/transmitters',
            badge: 'New',
          },
          { label: 'Receivers', href: '/products/wireless/receivers' },
        ],
      },
      {
        title: 'Pressure / Airflow',
        links: [
          {
            label: 'Differential Pressure',
            href: '/products/pressure/differential',
          },
          { label: 'Static Pressure', href: '/products/pressure/static' },
          { label: 'Airflow Probes', href: '/products/airflow/probes' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    columns: [
      {
        title: 'Documentation',
        links: [
          { label: 'Application Notes', href: '/resources/application-notes' },
          {
            label: 'Installation Guides',
            href: '/resources/installation-guides',
          },
          { label: 'Spec Sheets', href: '/resources/spec-sheets' },
        ],
      },
      {
        title: 'Media',
        links: [
          { label: 'Videos', href: '/resources/videos' },
          { label: 'Blog', href: '/resources/blog' },
          { label: 'Webinars', href: '/resources/webinars', badge: 'New' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About BAPI', href: '/resources/company/about' },
          { label: 'Support', href: '/resources/support' },
          { label: 'Contact', href: '/resources/company/contact' },
        ],
      },
    ],
  },
];
