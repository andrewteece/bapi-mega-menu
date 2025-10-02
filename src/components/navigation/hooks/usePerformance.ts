'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NavItem, NavLink } from '../types';

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const [metrics, setMetrics] = useState({
    averageRenderTime: 0,
    totalRenders: 0,
    lastRenderTime: 0,
  });

  useEffect(() => {
    startTime.current = performance.now();
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    renderCount.current += 1;

    setMetrics((prev) => ({
      averageRenderTime:
        (prev.averageRenderTime * (renderCount.current - 1) + renderTime) /
        renderCount.current,
      totalRenders: renderCount.current,
      lastRenderTime: renderTime,
    }));

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(
        `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
      );
    }
  }, [componentName]);

  const logMetrics = useCallback(() => {
    console.log(`Performance metrics for ${componentName}:`, metrics);
  }, [componentName, metrics]);

  return { metrics, logMetrics };
}

// Memoized navigation item processing
export function useProcessedNavItems(
  items: NavItem[],
  options?: {
    includeLabels?: string[];
    excludeLabels?: string[];
    maxDepth?: number;
  }
) {
  return useMemo(() => {
    let processedItems = [...items];

    // Filter by include/exclude labels
    if (options?.includeLabels?.length) {
      processedItems = processedItems.filter((item) =>
        options.includeLabels!.includes(item.label)
      );
    }

    if (options?.excludeLabels?.length) {
      processedItems = processedItems.filter(
        (item) => !options.excludeLabels!.includes(item.label)
      );
    }

    // Sort by order if available
    processedItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Limit depth if specified
    if (options?.maxDepth !== undefined) {
      processedItems = processedItems.map((item) => ({
        ...item,
        columns: item.columns.slice(0, options.maxDepth),
      }));
    }

    return processedItems;
  }, [
    items,
    options?.includeLabels,
    options?.excludeLabels,
    options?.maxDepth,
  ]);
}

// Debounced search hook
export function useDebouncedSearch(
  searchFn: (query: string) => NavLink[],
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NavLink[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const search = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      setIsSearching(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        const searchResults = searchFn(newQuery);
        setResults(searchResults);
        setIsSearching(false);
      }, delay);
    },
    [searchFn, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { query, results, isSearching, search };
}

// Virtualization hook for large navigation lists
export function useVirtualizedList<T>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
  }
) {
  const [scrollTop, setScrollTop] = useState(0);
  const { itemHeight, containerHeight, overscan = 5 } = options;

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(
    () => items.slice(visibleRange.start, visibleRange.end + 1),
    [items, visibleRange.start, visibleRange.end]
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

// Lazy loading hook for menu content
export function useLazyLoad<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const loadedRef = useRef(false);

  const load = useCallback(async () => {
    if (loadedRef.current || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await loader();
      setData(result);
      loadedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load'));
    } finally {
      setLoading(false);
    }
  }, [loader, loading]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    loadedRef.current = false;
  }, []);

  return { data, loading, error, load, reset };
}

// Intersection Observer hook for visibility tracking
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<Element, string>>(new Map());

  const observe = useCallback(
    (element: Element, id?: string) => {
      if (!observer.current) {
        observer.current = new IntersectionObserver((entries) => {
          setEntries(entries);
        }, options);
      }

      observer.current.observe(element);
      if (id) {
        elementsRef.current.set(element, id);
      }
    },
    [options]
  );

  const unobserve = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
      elementsRef.current.delete(element);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { entries, observe, unobserve };
}

// Preload hook for navigation items
export function useNavPreload() {
  const preloadedRoutes = useRef<Set<string>>(new Set());

  const preloadRoute = useCallback((href: string) => {
    if (preloadedRoutes.current.has(href)) return;

    // Preload the route using Next.js router
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);

      preloadedRoutes.current.add(href);

      // Clean up after 30 seconds
      setTimeout(() => {
        document.head.removeChild(link);
        preloadedRoutes.current.delete(href);
      }, 30000);
    }
  }, []);

  const preloadNavItem = useCallback(
    (item: NavItem) => {
      // Preload main item href
      if (item.href) {
        preloadRoute(item.href);
      }

      // Preload first few links in each column
      item.columns.forEach((column) => {
        column.links.slice(0, 3).forEach((link) => {
          if (!link.isExternal) {
            preloadRoute(link.href);
          }
        });
      });

      // Preload highlight
      if (item.highlight && !item.highlight.href.startsWith('http')) {
        preloadRoute(item.highlight.href);
      }
    },
    [preloadRoute]
  );

  return { preloadRoute, preloadNavItem };
}

// Animation frame hook for smooth animations
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(false);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      if (isActive) {
        requestRef.current = requestAnimationFrame(animate);
      }
    },
    [callback, isActive]
  );

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, animate]);

  return { start, stop, isActive };
}

// Memory info type
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);

  useEffect(() => {
    if (
      'memory' in performance &&
      (performance as Performance & { memory?: MemoryInfo }).memory
    ) {
      const updateMemoryInfo = () => {
        const perfMemory = (performance as Performance & { memory: MemoryInfo })
          .memory;
        setMemoryInfo(perfMemory);
      };

      updateMemoryInfo();
      const interval = setInterval(updateMemoryInfo, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  return memoryInfo;
}
