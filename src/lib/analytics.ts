export function trackNavClick(section: string, item: string) {
  // Example hook-up for GA4/GTM
  // window.dataLayer?.push({ event: "nav_click", section, item });
  console.debug('[analytics] nav_click:', { section, item });
}
