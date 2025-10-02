# BAPI Navigation Menu - Developer Documentation

## Overview

The BAPI Navigation Menu is a modern, accessible, and performant navigation system built with Next.js, TypeScript, and Tailwind CSS. It's designed for the BAPI WordPress to Next.js migration with headless CMS capabilities.

## 🏗️ Architecture

### Core Components

```
src/components/navigation/
├── BapiMegaMenu.tsx              # Main desktop mega menu
├── MobileMenu.tsx                # Basic mobile drawer
├── EnhancedMobileMenu.tsx        # Advanced mobile menu with search
├── SiteHeader.tsx                # Header integration
├── context/
│   └── NavigationContext.tsx     # State management
├── primitives/
│   ├── DesktopMegaItem.tsx      # Desktop menu items
│   ├── ColumnBlock.tsx          # Menu column component
│   ├── MegaPanel.tsx            # Mega menu panel
│   ├── MobileDrawer.tsx         # Mobile drawer primitive
│   ├── NavTrigger.tsx           # Navigation trigger button
│   └── useOutsideClose.ts       # Outside click hook
├── hooks/
│   └── usePerformance.ts        # Performance utilities
├── types/
│   └── index.ts                 # Type definitions
├── ErrorBoundary.tsx            # Error handling
└── data/
    └── nav.data.ts              # Navigation data
```

## 🚀 Quick Start

### Basic Usage

```tsx
import BapiMegaMenu from '@/components/navigation/BapiMegaMenu';
import { NavigationProvider } from '@/components/navigation/context/NavigationContext';

function App() {
  return (
    <NavigationProvider>
      <header>
        <BapiMegaMenu />
      </header>
    </NavigationProvider>
  );
}
```

### With Configuration

```tsx
import { NavigationProvider } from '@/components/navigation/context/NavigationContext';
import {
  mockNavData,
  mockConfig,
} from '@/components/navigation/__tests__/test-utils';

function App() {
  const handleAnalytics = (event) => {
    // Send to your analytics service
    console.log('Navigation event:', event);
  };

  return (
    <NavigationProvider
      initialConfig={{
        ...mockConfig,
        enableAnalytics: true,
        enableSearch: true,
      }}
      initialItems={mockNavData}
      onAnalyticsEvent={handleAnalytics}
    >
      <BapiMegaMenu includeLabels={['Products', 'Resources']} />
    </NavigationProvider>
  );
}
```

## 📋 Data Structure

### Navigation Item Schema

```typescript
interface NavItem {
  label: string; // Display name
  href?: string; // Optional top-level link
  order?: number; // Sort order
  isVisible?: boolean; // Visibility toggle
  permissions?: string[]; // Access control
  trackingCategory?: string; // Analytics category
  columns: NavColumn[]; // Sub-navigation
  highlight?: NavHighlight; // Featured content
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
}

interface NavColumn {
  title: string; // Column header
  order?: number; // Sort order
  description?: string; // Optional description
  featured?: NavLink; // Highlighted link
  links: NavLink[]; // Navigation links
}

interface NavLink {
  label: string; // Link text
  href: string; // URL (internal or external)
  description?: string; // Tooltip/description
  badge?: string; // Status badge (New, Beta, etc.)
  isExternal?: boolean; // External link flag
  openInNewTab?: boolean; // Target behavior
  trackingId?: string; // Analytics identifier
}
```

### WordPress Integration

For WordPress integration, transform your WordPress menu data:

```typescript
import { WordPressTransformer } from '@/components/navigation/types';

const transformWordPressMenu: WordPressTransformer = (wpData) => {
  // Transform WordPress menu items to NavItem[]
  return wpData.map((item) => ({
    label: item.title,
    href: item.url,
    order: item.menu_order,
    isVisible: true,
    permissions: [],
    trackingCategory: 'navigation',
    columns: transformWordPressChildren(item.children || []),
  }));
};
```

## 🎨 Styling & Theming

### CSS Custom Properties

The navigation supports dark mode and custom theming:

```css
:root {
  --nav-bg: theme('colors.white');
  --nav-text: theme('colors.neutral.900');
  --nav-border: theme('colors.neutral.200');
  --nav-hover-bg: theme('colors.neutral.100');
}

[data-theme='dark'] {
  --nav-bg: theme('colors.neutral.900');
  --nav-text: theme('colors.neutral.100');
  --nav-border: theme('colors.neutral.800');
  --nav-hover-bg: theme('colors.neutral.800');
}
```

### Component Customization

```tsx
// Custom styled navigation
import { cn } from '@/lib/utils';

function CustomNavigation() {
  return (
    <BapiMegaMenu
      className={cn('bg-brand-primary text-white', 'border-brand-secondary')}
    />
  );
}
```

## ⚡ Performance

### Built-in Optimizations

1. **Lazy Loading**: Menu content loads on demand
2. **Virtualization**: Large menus use virtual scrolling
3. **Memoization**: Components prevent unnecessary re-renders
4. **Debounced Search**: Search input has 300ms debounce
5. **Route Preloading**: Hover preloads navigation targets

### Performance Monitoring

```tsx
import { usePerformanceMonitor } from '@/components/navigation/hooks/usePerformance';

function MonitoredNavigation() {
  const { metrics, logMetrics } = usePerformanceMonitor('Navigation');

  // Log metrics in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logMetrics();
    }
  }, [logMetrics]);

  return <BapiMegaMenu />;
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Writing Tests

```tsx
import {
  renderWithProviders,
  mockNavData,
} from '@/components/navigation/__tests__/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('My Navigation Test', () => {
  it('should handle user interactions', async () => {
    const user = userEvent.setup();

    renderWithProviders(<BapiMegaMenu />, {
      navigationItems: mockNavData,
    });

    const menuButton = screen.getByRole('button', { name: /products/i });
    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });
});
```

### Accessibility Testing

```tsx
import { a11yHelpers } from '@/components/navigation/__tests__/test-utils';

it('meets accessibility standards', () => {
  renderWithProviders(<BapiMegaMenu />);

  const menuButton = screen.getByRole('button', { name: /products/i });

  a11yHelpers.expectProperARIA(menuButton, {
    'aria-haspopup': 'true',
    'aria-expanded': 'false',
  });
});
```

## 🔧 Error Handling

### Error Boundaries

The navigation includes comprehensive error boundaries:

```tsx
import { NavigationErrorBoundary } from '@/components/navigation/ErrorBoundary';

function App() {
  return (
    <NavigationErrorBoundary
      onError={(error, errorInfo) => {
        // Send to error tracking service
        console.error('Navigation error:', error, errorInfo);
      }}
    >
      <BapiMegaMenu />
    </NavigationErrorBoundary>
  );
}
```

### Custom Error Fallbacks

```tsx
import type { ErrorFallbackProps } from '@/components/navigation/ErrorBoundary';

const CustomErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  level,
}) => (
  <div className='p-4 text-center'>
    <h3>Navigation Unavailable</h3>
    <p>Please try refreshing the page.</p>
    <button onClick={resetError}>Retry</button>
  </div>
);

<NavigationErrorBoundary fallback={CustomErrorFallback}>
  <BapiMegaMenu />
</NavigationErrorBoundary>;
```

## 📊 Analytics

### Event Tracking

```tsx
import { useNavigationAnalytics } from '@/components/navigation/context/NavigationContext';

function AnalyticsExample() {
  const { trackEvent, analytics } = useNavigationAnalytics();

  const handleCustomEvent = () => {
    trackEvent({
      action: 'custom_interaction',
      category: 'navigation',
      label: 'Special Menu Action',
      value: 1,
      customData: {
        userId: 'user123',
        timestamp: Date.now(),
      },
    });
  };

  return (
    <div>
      <BapiMegaMenu />
      <button onClick={handleCustomEvent}>Track Custom Event</button>

      {/* Display analytics in development */}
      {process.env.NODE_ENV === 'development' && (
        <pre>{JSON.stringify(analytics, null, 2)}</pre>
      )}
    </div>
  );
}
```

### Integration with Analytics Services

```tsx
// Google Analytics 4
function setupGA4Integration() {
  return (event) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: event.customData?.userId,
      });
    }
  };
}

// Adobe Analytics
function setupAdobeAnalytics() {
  return (event) => {
    if (window.digitalData) {
      window.digitalData.events = window.digitalData.events || [];
      window.digitalData.events.push({
        eventName: `navigation.${event.action}`,
        category: event.category,
        label: event.label,
      });
    }
  };
}
```

## 🔒 Security

### Content Security Policy

Add these directives to your CSP:

```
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
connect-src 'self' https://api.wordpress.site;
```

### Input Sanitization

Search inputs are automatically sanitized:

```tsx
// Built-in XSS protection
const sanitizedQuery = DOMPurify.sanitize(userInput);
```

## 📱 Mobile Optimization

### Enhanced Mobile Features

```tsx
import EnhancedMobileMenu from '@/components/navigation/EnhancedMobileMenu';

function MobileOptimizedHeader() {
  return (
    <header>
      {/* Desktop */}
      <div className='hidden md:block'>
        <BapiMegaMenu />
      </div>

      {/* Mobile with search */}
      <div className='md:hidden'>
        <EnhancedMobileMenu />
      </div>
    </header>
  );
}
```

### Touch Optimization

```css
/* Increased touch targets for mobile */
@media (max-width: 768px) {
  .nav-button {
    min-height: 44px;
    min-width: 44px;
  }
}
```

## 🛠️ Development

### Local Development

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Building for Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 API Reference

### Hooks

- `useNavigation()` - Access navigation state and actions
- `useNavigationState()` - Get current navigation state
- `useNavigationActions()` - Get navigation action methods
- `useNavigationAnalytics()` - Analytics tracking utilities
- `useNavigationSearch()` - Search functionality
- `usePerformanceMonitor()` - Performance tracking
- `useDebouncedSearch()` - Debounced search input
- `useVirtualizedList()` - Virtual scrolling for large lists

### Components

- `<BapiMegaMenu />` - Main desktop navigation
- `<EnhancedMobileMenu />` - Mobile navigation with search
- `<NavigationProvider />` - Context provider
- `<NavigationErrorBoundary />` - Error boundary wrapper

### Utilities

- `validateNavItem()` - Runtime validation
- `validateNavigationConfig()` - Config validation
- `withErrorBoundary()` - HOC for error boundaries

## 🚀 Deployment

### Vercel Deployment

```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wp-site.com/wp-json/wp/v2
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 📝 Contributing

### Code Standards

- Use TypeScript strict mode
- Follow ESLint configuration
- Maintain 80%+ test coverage
- Write accessible components
- Document public APIs

### Pull Request Process

1. Create feature branch
2. Write tests for new functionality
3. Update documentation
4. Ensure all tests pass
5. Request code review

## 🆘 Troubleshooting

### Common Issues

**Menu doesn't open on hover**

- Check if `useOutsideClose` hook is properly implemented
- Verify hover delay timers are not conflicting

**Search not working**

- Ensure `enableSearch` is true in NavigationConfig
- Check if search data is properly indexed

**TypeScript errors**

- Run `npm run type-check` to identify issues
- Ensure all navigation data matches schema

**Performance issues**

- Use React DevTools Profiler
- Check for unnecessary re-renders
- Verify virtualization for large datasets

## 📞 Support

For issues and questions:

1. Check the troubleshooting guide above
2. Review existing GitHub issues
3. Create a new issue with reproduction steps
4. Include browser and environment details

## 📄 License

MIT License - see LICENSE file for details.
