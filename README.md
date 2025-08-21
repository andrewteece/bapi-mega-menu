# BAPI Mega Menu Demo

A modern proof-of-concept navigation system built with **Next.js 15**, **React + TypeScript**, and **Tailwind CSS v3**.  
This project demonstrates a scalable, data-driven mega-menu for BAPI-style product families, optimized for **speed, accessibility, polish, and maintainability**.

---

[![Live Demo](https://img.shields.io/badge/demo-online-green?style=for-the-badge&logo=vercel)](https://bapi-mega-menu-m73dqtqha-andrewteeces-projects.vercel.app/)

---

## 🚀 Tech Stack
- Next.js 15 (App Router, TypeScript)
- React 18/19 compatible
- Tailwind CSS **3.4.x** (stable)
- clsx + tailwind-merge (clean class composition)
- shadcn/ui primitives (Sheet, Accordion) for mobile drawer
- next-themes for light/dark mode

---

## ✅ Features
- Responsive **mega-menu** with split top-level product families (Temperature, Humidity, Pressure, Air Quality, Accessories) plus Applications, Resources, Support, About
- **Keyboard-friendly & accessible**: focus states, large hit areas, escape-to-close, semantic landmarks
- **Mobile drawer** with polished hamburger → X animation, bounce interactions, and motion-safe transitions
- **Desktop mega-menu** panels anchored to the header container with clamped width — no overflow at any breakpoint
- **Light & Dark Theme Support**: persistent toggle in header via `ThemeToggle` and `next-themes`
- **Polished hover states**:
  - Light mode → brand-colored hover backgrounds
  - Dark mode → subtle translucent overlays (`white/10`) and lighter brand text for readability
  - Promo cards use soft light glows in dark mode instead of heavy shadows
- **Performance-minded**: utility-first CSS; minimal JS
- **Analytics-ready**: `data-analytics="nav:Section:Item"` attributes for GA4/GTM mapping
- Clean, **pro-level project structure** for easy scaling
- Includes reusable **Navigation Primitives** (`NavTrigger`, `MegaPanel`, `ColumnBlock`, `MobileMenu`, `ThemeToggle`) for future projects

---
