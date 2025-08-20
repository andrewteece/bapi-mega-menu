# Navigation Data Model (Mega Menu)

This project uses a **data‑driven** mega menu. All UI renders from a typed data source in `components/navigation/data/nav.data.ts`.

## Why this design
- **Separation of concerns:** Content lives in data, not JSX.
- **Type safety:** TS types catch mistakes at build time.
- **Easy to extend:** Add/rename sections without touching components.
- **Swap in CMS/API later:** This shape maps cleanly to CMS entries or JSON.

---

## Type Definitions

```ts
// components/navigation/data/nav.data.ts

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

export const NAV: NavItem[] = [/* ... */];
