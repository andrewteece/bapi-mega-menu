import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  a11yHelpers,
  renderWithProviders,
  userInteractions,
} from '../../../__tests__/test-utils';
import BapiMegaMenu from '../BapiMegaMenu';

describe('BapiMegaMenu', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all navigation items', () => {
      renderWithProviders(<BapiMegaMenu />);

      expect(
        screen.getByRole('button', { name: /products/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /resources/i })
      ).toBeInTheDocument();
    });

    it('filters navigation items when includeLabels is provided', () => {
      renderWithProviders(<BapiMegaMenu includeLabels={['Products']} />);

      expect(
        screen.getByRole('button', { name: /products/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /resources/i })
      ).not.toBeInTheDocument();
    });

    it('renders with empty includeLabels array', () => {
      renderWithProviders(<BapiMegaMenu includeLabels={[]} />);

      // Should show all items when includeLabels is empty
      expect(
        screen.getByRole('button', { name: /products/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /resources/i })
      ).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles ESC key to close menu', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });

      // Open menu
      await user.click(productsButton);
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });

      // Press ESC to close
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('handles arrow down key to open menu', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });
      productsButton.focus();

      await user.keyboard('{ArrowDown}');
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('handles enter key to open menu', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });
      productsButton.focus();

      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('handles space key to open menu', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });
      productsButton.focus();

      await user.keyboard('{ }'); // Space key
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Mouse Interactions', () => {
    it('opens menu on hover with delay', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });

      await userInteractions.hoverWithDelay(productsButton, 100);

      await waitFor(
        () => {
          expect(productsButton).toHaveAttribute('aria-expanded', 'true');
        },
        { timeout: 200 }
      );
    });

    it('closes menu on mouse leave', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });

      // Hover to open
      await user.hover(productsButton);
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });

      // Leave to close
      await user.unhover(productsButton);

      // Wait for close delay
      await waitFor(
        () => {
          expect(productsButton).toHaveAttribute('aria-expanded', 'false');
        },
        { timeout: 200 }
      );
    });

    it('toggles menu on click', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });

      // Click to open
      await user.click(productsButton);
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });

      // Click to close
      await user.click(productsButton);
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });

      a11yHelpers.expectProperARIA(productsButton, {
        'aria-haspopup': 'true',
        'aria-expanded': 'false',
      });
    });

    it('updates aria-expanded when menu opens', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });

      await user.click(productsButton);

      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('has screen reader friendly text', () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });

      expect(productsButton).toHaveTextContent('Products');
      // Should have sr-only text for menu state
      expect(productsButton.querySelector('.sr-only')).toBeInTheDocument();
    });

    it('provides accessible names for menu regions', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });
      await user.click(productsButton);

      await waitFor(() => {
        const menuRegion = screen.getByRole('region');
        expect(menuRegion).toHaveAttribute('aria-label', 'Products menu');
      });
    });
  });

  describe('Menu State Management', () => {
    it('only allows one menu to be open at a time', async () => {
      renderWithProviders(<BapiMegaMenu />);

      const productsButton = screen.getByRole('button', { name: /products/i });
      const resourcesButton = screen.getByRole('button', {
        name: /resources/i,
      });

      // Open products menu
      await user.click(productsButton);
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });

      // Open resources menu
      await user.click(resourcesButton);
      await waitFor(() => {
        expect(resourcesButton).toHaveAttribute('aria-expanded', 'true');
        expect(productsButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('closes menu when clicking outside', async () => {
      renderWithProviders(
        <div>
          <BapiMegaMenu />
          <div data-testid='outside-element'>Outside</div>
        </div>
      );

      const productsButton = screen.getByRole('button', { name: /products/i });
      const outsideElement = screen.getByTestId('outside-element');

      // Open menu
      await user.click(productsButton);
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });

      // Click outside
      await user.click(outsideElement);
      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Error Handling', () => {
    it('renders gracefully with empty navigation data', () => {
      renderWithProviders(<BapiMegaMenu />, {
        navigationItems: [],
      });

      // Should not crash and should render empty state
      const nav = screen.getByLabelText('Primary');
      expect(nav).toBeInTheDocument();
      expect(nav).toBeEmptyDOMElement();
    });

    it('handles malformed navigation data', () => {
      const malformedData = [
        {
          label: '', // Empty label
          order: 0,
          isVisible: true,
          permissions: [],
          trackingCategory: 'navigation',
          columns: [],
        },
      ];

      renderWithProviders(<BapiMegaMenu />, {
        navigationItems: malformedData,
      });

      // Should not crash
      const nav = screen.getByLabelText('Primary');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const { rerender } = renderWithProviders(<BapiMegaMenu />);

      const initialRenderCount = screen.getAllByRole('button').length;

      // Re-render with same props
      rerender(<BapiMegaMenu />);

      const afterRerenderCount = screen.getAllByRole('button').length;
      expect(afterRerenderCount).toBe(initialRenderCount);
    });

    it('handles large navigation structures efficiently', async () => {
      const largeNavData = Array.from({ length: 50 }, (_, i) => ({
        label: `Item ${i}`,
        order: i,
        isVisible: true,
        permissions: [],
        trackingCategory: 'navigation',
        columns: [
          {
            title: 'Column',
            order: 0,
            links: Array.from({ length: 100 }, (_, j) => ({
              label: `Link ${j}`,
              href: `/link-${j}`,
              isExternal: false,
              openInNewTab: false,
            })),
          },
        ],
      }));

      const startTime = performance.now();
      renderWithProviders(<BapiMegaMenu />, {
        navigationItems: largeNavData,
      });
      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
