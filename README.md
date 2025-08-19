# BAPI Mega Menu Demo

A modern proof‑of‑concept navigation system built with **Next.js 15**, **React + TypeScript**, and **Tailwind CSS v3**.  
This project demonstrates a scalable, data‑driven mega‑menu for BAPI‑style product families, optimized for **speed, accessibility, and maintainability**.

---

## 🚀 Tech Stack
- Next.js 15 (App Router, TypeScript)
- React 18/19 compatible
- Tailwind CSS **3.4.x** (stable)
- clsx + tailwind‑merge (clean class composition)

---

## ✅ Features
- Responsive **mega‑menu** with split top‑level product families (Temperature, Humidity, Pressure, Air Quality, Accessories) plus Applications, Resources, Support, About
- **Keyboard‑friendly & accessible**: focus states, large hit areas, escape‑to‑close, semantic landmarks
- **Performance‑minded**: utility‑first CSS; minimal JS
- **Analytics‑ready**: `data-analytics="nav:Section:Item"` attributes for easy GA4/GTM mapping
- Clean, **pro‑level project structure** for easy scaling

---

## 📂 Project Structure
    bapi-mega-menu/
    ├─ app/                      # Next.js App Router pages
    │  ├─ layout.tsx             # Root layout
    │  ├─ page.tsx               # Demo homepage
    │  └─ globals.css            # Tailwind entrypoint
    ├─ components/
    │  ├─ layout/
    │  │  ├─ SiteHeader.tsx
    │  │  └─ SiteFooter.tsx
    │  ├─ navigation/
    │  │  └─ bapi-mega-menu.tsx  # Mega‑menu component (data‑driven)
    │  └─ ui/
    │     └─ TestButton.tsx      # Example using cn(clsx + tailwind‑merge)
    ├─ lib/
    │  ├─ analytics.ts
    │  ├─ seo.ts
    │  └─ utils.ts               # cn() helper
    ├─ public/
    ├─ styles/
    ├─ tailwind.config.js
    ├─ postcss.config.js
    ├─ tsconfig.json
    ├─ next.config.js
    ├─ package.json
    └─ README.md

---

## 🛠️ Getting Started

**1) Install**
    
    npm install

**2) Run dev server**
    
    npm run dev
    # Visit http://localhost:3000

**3) (If needed) Tailwind v3 sanity check**

- `tailwind.config.js` must include:
  
      module.exports = {
        content: [
          "./app/**/*.{js,ts,jsx,tsx,mdx}",
          "./components/**/*.{js,ts,jsx,tsx,mdx}",
          "./pages/**/*.{js,ts,jsx,tsx,mdx}",
          "./src/**/*.{js,ts,jsx,tsx,mdx}"
        ],
        theme: { extend: {} },
        plugins: [],
      };

- `app/globals.css` must start with:
  
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

---

## 📦 Scripts

    npm run dev       # start dev server
    npm run build     # production build
    npm start         # run production server
    npm run lint      # eslint

---

## 🔒 Tailwind Version (Pinned)

This repo is intentionally pinned to **Tailwind CSS v3.4.x** to ensure compatibility with the current ecosystem.

If you see a CLI showing `tailwindcss v4.x` in your terminal, force v3 for init:

    npx -p tailwindcss@3.4.14 tailwindcss init -p

---

## 📈 Analytics Mapping

Each nav link includes a `data-analytics` attribute (e.g., `nav:Temperature:Room / Wall`).  
Map this in **Google Tag Manager** to emit GA4 events (`nav_section`, `nav_item`).

---

## ☁️ Deploy (Vercel)

1. Push to GitHub:

       git init
       git add -A
       git commit -m "chore: initial setup"
       git branch -M main
       git remote add origin https://github.com/<your-user>/bapi-mega-menu.git
       git push -u origin main

2. Import the repo in Vercel → select **Next.js** preset → Deploy.

---

## 🗺️ Roadmap
- [ ] Fill `NAV` with real BAPI URLs
- [ ] Add **Resources / Knowledge Center** filters (Application Notes, Catalogs, Videos, Blog)
- [ ] Hook up GA4 via GTM (map `data-analytics`)
- [ ] Add visual regression tests (Chromatic or Storybook Test Runner)
- [ ] Optional: migrate primitives to shadcn/ui as needed

---

## 📝 License
MIT — free to use and adapt.
