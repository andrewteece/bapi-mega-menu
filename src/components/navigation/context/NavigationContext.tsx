'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import type {
  NavigationAnalyticsEvent,
  NavigationConfig,
  NavItem,
  NavLink,
} from '../types';

// Navigation State
type NavigationState = {
  items: NavItem[];
  config: NavigationConfig;
  isLoading: boolean;
  error: string | null;
  openMenuIndex: number | null;
  mobileMenuOpen: boolean;
  searchQuery: string;
  searchResults: NavLink[];
  analytics: NavigationAnalyticsEvent[];
};

// Navigation Actions
type NavigationAction =
  | { type: 'SET_ITEMS'; payload: NavItem[] }
  | { type: 'SET_CONFIG'; payload: NavigationConfig }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'OPEN_MENU'; payload: number }
  | { type: 'CLOSE_MENU' }
  | { type: 'TOGGLE_MOBILE_MENU'; payload?: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: NavLink[] }
  | { type: 'ADD_ANALYTICS_EVENT'; payload: NavigationAnalyticsEvent }
  | { type: 'CLEAR_ANALYTICS' };

// Reducer
const navigationReducer = (
  state: NavigationState,
  action: NavigationAction
): NavigationState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, error: null };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'OPEN_MENU':
      return { ...state, openMenuIndex: action.payload };
    case 'CLOSE_MENU':
      return { ...state, openMenuIndex: null };
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        mobileMenuOpen: action.payload ?? !state.mobileMenuOpen,
        // Close desktop menu when opening mobile menu
        openMenuIndex: action.payload === true ? null : state.openMenuIndex,
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'ADD_ANALYTICS_EVENT':
      return {
        ...state,
        analytics: [...state.analytics.slice(-99), action.payload], // Keep last 100 events
      };
    case 'CLEAR_ANALYTICS':
      return { ...state, analytics: [] };
    default:
      return state;
  }
};

// Initial state
const initialState: NavigationState = {
  items: [],
  config: {
    items: [],
    maxColumns: 4,
    theme: 'auto',
    enableAnalytics: true,
    enableSearch: false,
    mobileBreakpoint: 768,
  },
  isLoading: false,
  error: null,
  openMenuIndex: null,
  mobileMenuOpen: false,
  searchQuery: '',
  searchResults: [],
  analytics: [],
};

// Context
type NavigationContextType = {
  state: NavigationState;
  actions: {
    setItems: (items: NavItem[]) => void;
    setConfig: (config: NavigationConfig) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    openMenu: (index: number) => void;
    closeMenu: () => void;
    toggleMobileMenu: (open?: boolean) => void;
    search: (query: string) => void;
    trackEvent: (event: Omit<NavigationAnalyticsEvent, 'timestamp'>) => void;
    handleLinkClick: (link: NavLink, context: 'desktop' | 'mobile') => void;
  };
};

const NavigationContext = createContext<NavigationContextType | null>(null);

// Provider Props
type NavigationProviderProps = {
  children: React.ReactNode;
  initialConfig?: Partial<NavigationConfig>;
  initialItems?: NavItem[];
  onAnalyticsEvent?: (event: NavigationAnalyticsEvent) => void;
};

// Provider Component
export function NavigationProvider({
  children,
  initialConfig = {},
  initialItems = [],
  onAnalyticsEvent,
}: NavigationProviderProps) {
  const [state, dispatch] = useReducer(navigationReducer, {
    ...initialState,
    items: initialItems,
    config: { ...initialState.config, ...initialConfig },
  });

  // Define callback functions outside of useMemo
  const search = useCallback(
    (query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });

      if (!query.trim()) {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
        return;
      }

      // Simple search implementation
      const results: NavLink[] = [];
      const searchTerm = query.toLowerCase();

      state.items.forEach((item) => {
        item.columns.forEach((column) => {
          column.links.forEach((link) => {
            if (
              link.label.toLowerCase().includes(searchTerm) ||
              link.description?.toLowerCase().includes(searchTerm)
            ) {
              results.push(link);
            }
          });
        });
      });

      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results.slice(0, 10) });
    },
    [state.items]
  );

  const trackEvent = useCallback(
    (event: Omit<NavigationAnalyticsEvent, 'timestamp'>) => {
      const fullEvent: NavigationAnalyticsEvent = {
        ...event,
        timestamp: new Date().toISOString(),
      } as NavigationAnalyticsEvent & { timestamp: string };

      dispatch({ type: 'ADD_ANALYTICS_EVENT', payload: fullEvent });
      onAnalyticsEvent?.(fullEvent);
    },
    [onAnalyticsEvent]
  );

  const handleLinkClick = useCallback(
    (link: NavLink, context: 'desktop' | 'mobile') => {
      // Track the click
      if (state.config.enableAnalytics) {
        const event: Omit<NavigationAnalyticsEvent, 'timestamp'> = {
          action: 'click',
          category: 'navigation',
          label: link.label,
          customData: {
            href: link.href,
            context,
            hasExternal: link.isExternal,
            trackingId: link.trackingId,
          },
        };

        dispatch({
          type: 'ADD_ANALYTICS_EVENT',
          payload: {
            ...event,
            timestamp: new Date().toISOString(),
          } as NavigationAnalyticsEvent & { timestamp: string },
        });
        onAnalyticsEvent?.(event as NavigationAnalyticsEvent);
      }

      // Close menus after click
      if (context === 'mobile') {
        dispatch({ type: 'TOGGLE_MOBILE_MENU', payload: false });
      } else {
        dispatch({ type: 'CLOSE_MENU' });
      }

      // Handle external links
      if (link.isExternal || link.openInNewTab) {
        window.open(link.href, '_blank', 'noopener,noreferrer');
      }
    },
    [state.config.enableAnalytics, onAnalyticsEvent]
  );

  // Actions
  const actions = useMemo(
    () => ({
      setItems: (items: NavItem[]) =>
        dispatch({ type: 'SET_ITEMS', payload: items }),
      setConfig: (config: NavigationConfig) =>
        dispatch({ type: 'SET_CONFIG', payload: config }),
      setLoading: (loading: boolean) =>
        dispatch({ type: 'SET_LOADING', payload: loading }),
      setError: (error: string | null) =>
        dispatch({ type: 'SET_ERROR', payload: error }),
      openMenu: (index: number) =>
        dispatch({ type: 'OPEN_MENU', payload: index }),
      closeMenu: () => dispatch({ type: 'CLOSE_MENU' }),
      toggleMobileMenu: (open?: boolean) =>
        dispatch({ type: 'TOGGLE_MOBILE_MENU', payload: open }),
      search,
      trackEvent,
      handleLinkClick,
    }),
    [search, trackEvent, handleLinkClick]
  );

  const contextValue = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

// Hook to use navigation context
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// Specialized hooks
export function useNavigationState() {
  const { state } = useNavigation();
  return state;
}

export function useNavigationActions() {
  const { actions } = useNavigation();
  return actions;
}

export function useNavigationAnalytics() {
  const {
    state: { analytics },
    actions: { trackEvent },
  } = useNavigation();

  const getEventsByCategory = useCallback(
    (category: string) =>
      analytics.filter((event) => event.category === category),
    [analytics]
  );

  const getEventsByAction = useCallback(
    (action: NavigationAnalyticsEvent['action']) =>
      analytics.filter((event) => event.action === action),
    [analytics]
  );

  return {
    analytics,
    trackEvent,
    getEventsByCategory,
    getEventsByAction,
  };
}

// Search hook
export function useNavigationSearch() {
  const {
    state: { searchQuery, searchResults, config },
    actions: { search },
  } = useNavigation();

  const isSearchEnabled = config.enableSearch;

  return {
    searchQuery,
    searchResults,
    search: isSearchEnabled ? search : () => {},
    isSearchEnabled,
  };
}
