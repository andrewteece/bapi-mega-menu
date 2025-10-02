'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// User preferences interface
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  menuBehavior: 'hover' | 'click';
  searchEnabled: boolean;
  recentItemsCount: number;
  shortcuts: Record<string, string>;
  autoComplete: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
}

// Navigation usage analytics
export interface NavigationUsage {
  clickCounts: Record<string, number>;
  searchQueries: string[];
  recentItems: Array<{
    id: string;
    title: string;
    href: string;
    timestamp: number;
    category: string;
  }>;
  favoriteItems: string[];
  sessionTime: number;
  lastAccessed: Record<string, number>;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  reducedMotion: false,
  fontSize: 'md',
  menuBehavior: 'hover',
  searchEnabled: true,
  recentItemsCount: 5,
  shortcuts: {
    search: 'cmd+k',
    home: 'cmd+h',
    products: 'cmd+p',
  },
  autoComplete: true,
  soundEnabled: false,
  compactMode: false,
};

const defaultUsage: NavigationUsage = {
  clickCounts: {},
  searchQueries: [],
  recentItems: [],
  favoriteItems: [],
  sessionTime: 0,
  lastAccessed: {},
};

// Context for user preferences
interface UserPreferencesContextType {
  preferences: UserPreferences;
  usage: NavigationUsage;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  recordNavigation: (
    itemId: string,
    title: string,
    href: string,
    category: string
  ) => void;
  recordSearch: (query: string) => void;
  toggleFavorite: (itemId: string) => void;
  getRecentItems: () => NavigationUsage['recentItems'];
  getPopularItems: (limit?: number) => Array<{ id: string; count: number }>;
  resetUsage: () => void;
  exportPreferences: () => string;
  importPreferences: (data: string) => boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(
  null
);

// Provider component
export function UserPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [usage, setUsage] = useState<NavigationUsage>(defaultUsage);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('bapi-nav-preferences');
      const savedUsage = localStorage.getItem('bapi-nav-usage');

      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      }

      if (savedUsage) {
        const parsed = JSON.parse(savedUsage);
        setUsage({ ...defaultUsage, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bapi-nav-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }, [preferences]);

  // Save usage data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bapi-nav-usage', JSON.stringify(usage));
    } catch (error) {
      console.warn('Failed to save usage data:', error);
    }
  }, [usage]);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  // Record navigation interaction
  const recordNavigation = useCallback(
    (itemId: string, title: string, href: string, category: string) => {
      const timestamp = Date.now();

      setUsage((prev) => ({
        ...prev,
        clickCounts: {
          ...prev.clickCounts,
          [itemId]: (prev.clickCounts[itemId] || 0) + 1,
        },
        lastAccessed: {
          ...prev.lastAccessed,
          [itemId]: timestamp,
        },
        recentItems: [
          { id: itemId, title, href, timestamp, category },
          ...prev.recentItems.filter((item) => item.id !== itemId),
        ].slice(0, preferences.recentItemsCount),
      }));
    },
    [preferences.recentItemsCount]
  );

  // Record search query
  const recordSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    setUsage((prev) => ({
      ...prev,
      searchQueries: [
        query,
        ...prev.searchQueries.filter((q) => q !== query),
      ].slice(0, 20), // Keep last 20 searches
    }));
  }, []);

  // Toggle favorite item
  const toggleFavorite = useCallback((itemId: string) => {
    setUsage((prev) => ({
      ...prev,
      favoriteItems: prev.favoriteItems.includes(itemId)
        ? prev.favoriteItems.filter((id) => id !== itemId)
        : [...prev.favoriteItems, itemId],
    }));
  }, []);

  // Get recent items sorted by timestamp
  const getRecentItems = useCallback(() => {
    return usage.recentItems
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, preferences.recentItemsCount);
  }, [usage.recentItems, preferences.recentItemsCount]);

  // Get popular items by click count
  const getPopularItems = useCallback(
    (limit = 10) => {
      return Object.entries(usage.clickCounts)
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    },
    [usage.clickCounts]
  );

  // Reset usage data
  const resetUsage = useCallback(() => {
    setUsage(defaultUsage);
  }, []);

  // Export preferences as JSON string
  const exportPreferences = useCallback(() => {
    return JSON.stringify(
      {
        preferences,
        usage,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  }, [preferences, usage]);

  // Import preferences from JSON string
  const importPreferences = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);

      if (parsed.preferences) {
        setPreferences({ ...defaultPreferences, ...parsed.preferences });
      }

      if (parsed.usage) {
        setUsage({ ...defaultUsage, ...parsed.usage });
      }

      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }, []);

  const contextValue: UserPreferencesContextType = {
    preferences,
    usage,
    updatePreferences,
    recordNavigation,
    recordSearch,
    toggleFavorite,
    getRecentItems,
    getPopularItems,
    resetUsage,
    exportPreferences,
    importPreferences,
  };

  return React.createElement(
    UserPreferencesContext.Provider,
    { value: contextValue },
    children
  );
}

// Hook to use preferences
export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      'useUserPreferences must be used within UserPreferencesProvider'
    );
  }
  return context;
}

// Keyboard shortcuts hook
export function useKeyboardShortcuts() {
  const { preferences } = useUserPreferences();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Check for registered shortcuts
      Object.entries(preferences.shortcuts).forEach(([action, shortcut]) => {
        const [modifier, key] = shortcut.split('+');

        if (
          modifier === 'cmd' &&
          cmdKey &&
          e.key.toLowerCase() === key.toLowerCase()
        ) {
          e.preventDefault();

          // Trigger actions based on shortcut
          switch (action) {
            case 'search':
              (
                document.querySelector(
                  '[data-search-input]'
                ) as HTMLInputElement
              )?.focus();
              break;
            case 'home':
              window.location.href = '/';
              break;
            case 'products':
              // Focus on products menu
              (
                document.querySelector(
                  '[data-nav-products]'
                ) as HTMLButtonElement
              )?.focus();
              break;
            default:
              break;
          }
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [preferences.shortcuts]);
}

// Custom hook for theme preferences
export function useThemePreference() {
  const { preferences, updatePreferences } = useUserPreferences();

  const setTheme = useCallback(
    (theme: UserPreferences['theme']) => {
      updatePreferences({ theme });

      // Apply theme to document
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    },
    [updatePreferences]
  );

  useEffect(() => {
    setTheme(preferences.theme);
  }, [preferences.theme, setTheme]);

  return { theme: preferences.theme, setTheme };
}

// Analytics hook for tracking navigation patterns
export function useNavigationAnalytics() {
  const { recordNavigation, recordSearch, usage } = useUserPreferences();

  const trackNavigation = useCallback(
    (itemId: string, title: string, href: string, category: string) => {
      recordNavigation(itemId, title, href, category);

      // Optional: Send to external analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (
          window as {
            gtag?: (
              event: string,
              action: string,
              parameters: Record<string, string>
            ) => void;
          }
        ).gtag;
        if (gtag) {
          gtag('event', 'navigation_click', {
            item_id: itemId,
            item_category: category,
            item_title: title,
          });
        }
      }
    },
    [recordNavigation]
  );

  const trackSearch = useCallback(
    (query: string, resultCount: number) => {
      recordSearch(query);

      // Optional: Send to external analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (
          window as {
            gtag?: (
              event: string,
              action: string,
              parameters: Record<string, string | number>
            ) => void;
          }
        ).gtag;
        if (gtag) {
          gtag('event', 'search', {
            search_term: query,
            result_count: resultCount,
          });
        }
      }
    },
    [recordSearch]
  );

  return {
    trackNavigation,
    trackSearch,
    usage,
  };
}
