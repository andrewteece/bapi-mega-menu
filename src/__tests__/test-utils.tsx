import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { NavigationProvider } from '../components/navigation/context/NavigationContext';
import { NavigationErrorBoundary } from '../components/navigation/ErrorBoundary';
import type { NavigationConfig, NavItem } from '../components/navigation/types';

// Mock navigation data for testing
export const mockNavData: NavItem[] = [
  {
    label: 'Products',
    order: 0,
    isVisible: true,
    permissions: [],
    trackingCategory: 'navigation',
    columns: [
      {
        title: 'Temperature',
        order: 0,
        links: [
          {
            label: 'Room Sensors',
            href: '/products/temperature/room',
            isExternal: false,
            openInNewTab: false,
          },
          {
            label: 'Duct Sensors',
            href: '/products/temperature/duct',
            badge: 'New',
            isExternal: false,
            openInNewTab: false,
          },
        ],
      },
      {
        title: 'Humidity',
        order: 1,
        links: [
          {
            label: 'Wall Mount',
            href: '/products/humidity/wall',
            isExternal: false,
            openInNewTab: false,
          },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    order: 1,
    isVisible: true,
    permissions: [],
    trackingCategory: 'navigation',
    columns: [
      {
        title: 'Documentation',
        order: 0,
        links: [
          {
            label: 'Application Notes',
            href: '/resources/notes',
            isExternal: false,
            openInNewTab: false,
          },
          {
            label: 'External Guide',
            href: 'https://example.com/guide',
            isExternal: true,
            openInNewTab: true,
          },
        ],
      },
    ],
  },
];

export const mockConfig: NavigationConfig = {
  items: mockNavData,
  maxColumns: 4,
  theme: 'auto',
  enableAnalytics: true,
  enableSearch: true,
  mobileBreakpoint: 768,
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  navigationConfig?: Partial<NavigationConfig>;
  navigationItems?: NavItem[];
  withErrorBoundary?: boolean;
}

function AllProviders({
  children,
  navigationConfig = {},
  navigationItems = mockNavData,
  withErrorBoundary = true,
}: {
  children: React.ReactNode;
  navigationConfig?: Partial<NavigationConfig>;
  navigationItems?: NavItem[];
  withErrorBoundary?: boolean;
}) {
  const content = (
    <NavigationProvider
      initialConfig={{ ...mockConfig, ...navigationConfig }}
      initialItems={navigationItems}
    >
      {children}
    </NavigationProvider>
  );

  if (withErrorBoundary) {
    return <NavigationErrorBoundary>{content}</NavigationErrorBoundary>;
  }

  return content;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    navigationConfig,
    navigationItems,
    withErrorBoundary = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  return render(ui, {
    wrapper: (props) => (
      <AllProviders
        {...props}
        navigationConfig={navigationConfig}
        navigationItems={navigationItems}
        withErrorBoundary={withErrorBoundary}
      />
    ),
    ...renderOptions,
  });
}

// Test utilities for user interactions
export const userInteractions = {
  // Hover with delay simulation
  async hoverWithDelay(element: HTMLElement, delay = 100) {
    const userEvent = (await import('@testing-library/user-event')).default;
    const user = userEvent.setup({ delay });
    await user.hover(element);
    // Wait for hover delay
    await new Promise((resolve) => setTimeout(resolve, delay));
  },

  // Keyboard navigation
  async navigateWithKeyboard(startElement: HTMLElement, keys: string[]) {
    const userEvent = (await import('@testing-library/user-event')).default;
    const user = userEvent.setup();

    startElement.focus();

    for (const key of keys) {
      await user.keyboard(`{${key}}`);
    }
  },

  // Touch interactions for mobile testing
  async touchStart(element: HTMLElement) {
    const touchEvent = new TouchEvent('touchstart', {
      touches: [{} as Touch],
      bubbles: true,
    });
    element.dispatchEvent(touchEvent);
  },
};

// Accessibility testing utilities
export const a11yHelpers = {
  // Check if element has proper ARIA attributes
  expectProperARIA(
    element: HTMLElement,
    expectedAttrs: Record<string, string>
  ) {
    Object.entries(expectedAttrs).forEach(([attr, value]) => {
      expect(element).toHaveAttribute(attr, value);
    });
  },

  // Check keyboard navigation
  async expectKeyboardNavigation(
    container: HTMLElement,
    expectedOrder: string[]
  ) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    expect(focusableElements).toHaveLength(expectedOrder.length);

    for (let i = 0; i < expectedOrder.length; i++) {
      const element = focusableElements[i] as HTMLElement;
      expect(element).toHaveAccessibleName(expectedOrder[i]);
    }
  },

  // Check color contrast (simplified)
  expectSufficientContrast(element: HTMLElement) {
    const styles = getComputedStyle(element);
    const bgColor = styles.backgroundColor;
    const textColor = styles.color;

    // Basic check - should not have same color for bg and text
    expect(bgColor).not.toBe(textColor);
    expect(textColor).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
  },
};

// Performance testing utilities
export const performanceHelpers = {
  // Measure render time
  async measureRenderTime(renderFn: () => void): Promise<number> {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    return end - start;
  },

  // Check for memory leaks
  expectNoMemoryLeaks(cleanup: () => void) {
    const initialMemory =
      (performance as Performance & { memory?: { usedJSHeapSize: number } })
        .memory?.usedJSHeapSize || 0;

    cleanup();

    // Force garbage collection if available
    if ('gc' in global) {
      (global as { gc: () => void }).gc();
    }

    const finalMemory =
      (performance as Performance & { memory?: { usedJSHeapSize: number } })
        .memory?.usedJSHeapSize || 0;

    // Memory should not have increased significantly
    expect(finalMemory - initialMemory).toBeLessThan(1024 * 1024); // Less than 1MB increase
  },
};

// Mock data generators
export const mockDataGenerators = {
  createNavItem(overrides: Partial<NavItem> = {}): NavItem {
    return {
      label: 'Test Item',
      order: 0,
      isVisible: true,
      permissions: [],
      trackingCategory: 'navigation',
      columns: [
        {
          title: 'Test Column',
          order: 0,
          links: [
            {
              label: 'Test Link',
              href: '/test',
              isExternal: false,
              openInNewTab: false,
            },
          ],
        },
      ],
      ...overrides,
    };
  },

  createLargeNavStructure(itemCount = 10, linksPerColumn = 20): NavItem[] {
    return Array.from({ length: itemCount }, (_, i) => ({
      label: `Item ${i + 1}`,
      order: i,
      isVisible: true,
      permissions: [],
      trackingCategory: 'navigation',
      columns: [
        {
          title: `Column ${i + 1}`,
          order: 0,
          links: Array.from({ length: linksPerColumn }, (_, j) => ({
            label: `Link ${j + 1}`,
            href: `/item-${i}/link-${j}`,
            isExternal: false,
            openInNewTab: false,
          })),
        },
      ],
    }));
  },
};

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
