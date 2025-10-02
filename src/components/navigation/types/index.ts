// Navigation Types with Enhanced Type Safety
import { z } from 'zod';

// Runtime validation schemas
export const NavLinkSchema = z.object({
  label: z.string().min(1, 'Label cannot be empty'),
  href: z
    .string()
    .url('Must be a valid URL')
    .or(z.string().startsWith('/', 'Must be absolute path')),
  badge: z.string().optional(),
  description: z.string().optional(),
  isExternal: z.boolean().default(false),
  openInNewTab: z.boolean().default(false),
  // Analytics tracking
  trackingId: z.string().optional(),
});

export const NavColumnSchema = z.object({
  title: z.string().min(1, 'Column title cannot be empty'),
  links: z.array(NavLinkSchema).min(1, 'Column must have at least one link'),
  description: z.string().optional(),
  featured: NavLinkSchema.optional(),
  order: z.number().int().min(0).default(0),
});

export const NavHighlightSchema = z.object({
  title: z.string().min(1, 'Highlight title cannot be empty'),
  description: z.string().min(1, 'Highlight description cannot be empty'),
  cta: z.string().min(1, 'CTA text cannot be empty'),
  href: z.string().url().or(z.string().startsWith('/')),
  image: z.string().url().optional(),
  badge: z.string().optional(),
});

export const NavItemSchema = z.object({
  label: z.string().min(1, 'Navigation item label cannot be empty'),
  href: z.string().url().or(z.string().startsWith('/')).optional(),
  columns: z
    .array(NavColumnSchema)
    .min(1, 'Navigation item must have at least one column'),
  highlight: NavHighlightSchema.optional(),
  // CMS integration fields
  id: z.string().or(z.number()).optional(),
  order: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
  permissions: z.array(z.string()).default([]),
  // SEO fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  // Analytics
  trackingCategory: z.string().default('navigation'),
});

// Inferred types from schemas
export type NavLink = z.infer<typeof NavLinkSchema>;
export type NavColumn = z.infer<typeof NavColumnSchema>;
export type NavHighlight = z.infer<typeof NavHighlightSchema>;
export type NavItem = z.infer<typeof NavItemSchema>;

// Navigation configuration type
export type NavigationConfig = {
  items: NavItem[];
  maxColumns?: number;
  theme?: 'light' | 'dark' | 'auto';
  enableAnalytics?: boolean;
  enableSearch?: boolean;
  mobileBreakpoint?: number;
};

// Component prop types
export type DesktopMegaItemProps = {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onLinkClick?: (link: NavLink, context: 'desktop' | 'mobile') => void;
};

export type MobileMenuProps = {
  open: boolean;
  onOpen: (open: boolean) => void;
  items?: NavItem[];
  enableSearch?: boolean;
  onLinkClick?: (link: NavLink, context: 'desktop' | 'mobile') => void;
};

// Utility types for future WordPress integration
export type WordPressMenuItem = {
  ID: number;
  title: string;
  url: string;
  menu_order: number;
  menu_item_parent: number;
  object_id: number;
  classes: string[];
  target: '_blank' | '_self';
  xfn: string;
  description: string;
  attr_title: string;
  type_label: string;
};

// Transform function type for WordPress data
export type WordPressTransformer = (wpData: WordPressMenuItem[]) => NavItem[];

// Analytics event types
export type NavigationAnalyticsEvent = {
  action: 'click' | 'hover' | 'open' | 'close' | 'search';
  category: string;
  label: string;
  value?: number;
  customData?: Record<string, unknown>;
};

// Error types
export class NavigationError extends Error {
  constructor(
    message: string,
    public code:
      | 'VALIDATION_ERROR'
      | 'NETWORK_ERROR'
      | 'PERMISSION_ERROR'
      | 'UNKNOWN_ERROR',
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'NavigationError';
  }
}

// Validation helper functions
export const validateNavItem = (item: unknown): NavItem => {
  try {
    return NavItemSchema.parse(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new NavigationError(
        `Navigation item validation failed: ${error.errors
          .map((e: z.ZodIssue) => e.message)
          .join(', ')}`,
        'VALIDATION_ERROR',
        { item, errors: error.errors }
      );
    }
    throw new NavigationError('Unknown validation error', 'UNKNOWN_ERROR', {
      item,
    });
  }
};

export const validateNavigationConfig = (config: unknown): NavigationConfig => {
  const ConfigSchema = z.object({
    items: z.array(NavItemSchema),
    maxColumns: z.number().int().min(1).max(6).default(4),
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    enableAnalytics: z.boolean().default(true),
    enableSearch: z.boolean().default(false),
    mobileBreakpoint: z.number().int().min(320).default(768),
  });

  try {
    return ConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new NavigationError(
        `Navigation config validation failed: ${error.errors
          .map((e: z.ZodIssue) => e.message)
          .join(', ')}`,
        'VALIDATION_ERROR',
        { config, errors: error.errors }
      );
    }
    throw new NavigationError('Unknown validation error', 'UNKNOWN_ERROR', {
      config,
    });
  }
};
