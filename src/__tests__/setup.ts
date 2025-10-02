import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return React.createElement('a', props, children);
  };
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
}));

// Mock IntersectionObserver
(
  global as unknown as { IntersectionObserver: unknown }
).IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver
(global as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

// Enhanced console.error for tests
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is deprecated in React 18')
  ) {
    return;
  }
  originalError.call(console, ...args);
};
