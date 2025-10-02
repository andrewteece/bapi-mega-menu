'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Clock,
  Keyboard,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  href: string;
  breadcrumb: string[];
  isExternal?: boolean;
  popularity?: number;
}

interface SmartSearchProps {
  onSearch: (query: string) => SearchResult[];
  placeholder?: string;
  className?: string;
  onResultSelect?: (result: SearchResult) => void;
}

// Simple debounced search hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SmartSearch({
  onSearch,
  placeholder = 'Search navigation...',
  className,
  onResultSelect,
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>([
    'Temperature sensors',
    'Humidity control',
    'Pressure measurement',
    'Air quality monitoring',
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const debouncedQuery = useDebounce(query, 200);
  const results = React.useMemo(
    () => (debouncedQuery ? onSearch(debouncedQuery) : []),
    [debouncedQuery, onSearch]
  );

  // Focus management
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Handle result selection
  const handleResultSelect = useCallback(
    (result: SearchResult) => {
      setQuery(result.title);
      setIsOpen(false);

      // Add to recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item !== result.title);
        return [result.title, ...filtered].slice(0, 5);
      });

      onResultSelect?.(result);
    },
    [onResultSelect]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
        default:
          break;
      }
    },
    [selectedIndex, results, handleResultSelect]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setSelectedIndex(-1);
    focusInput();
  }, [focusInput]);

  // Show results when there's a query or when focused with recent/popular searches
  const showResults =
    isOpen &&
    (debouncedQuery || recentSearches.length > 0 || popularSearches.length > 0);

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      {/* Search Input */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <motion.input
          ref={inputRef}
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border bg-background/95 backdrop-blur-sm pl-10 pr-10 py-2.5',
            'text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'transition-all duration-200'
          )}
          whileFocus={{
            boxShadow: '0 0 0 2px rgba(var(--ring), 0.2)',
            transition: { duration: 0.2 },
          }}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors'
            >
              <X className='h-3 w-3' />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcut Hint */}
        {!isOpen && (
          <motion.div
            className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground flex items-center gap-1'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Keyboard className='h-3 w-3' />
            <span>⌘K</span>
          </motion.div>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute top-full left-0 right-0 z-50 mt-2',
              'bg-popover/95 backdrop-blur-md rounded-lg border shadow-xl',
              'max-h-80 overflow-y-auto'
            )}
          >
            <div className='p-2'>
              {/* Search Results */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className='px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                    Results ({results.length})
                  </div>
                  <div className='space-y-1'>
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'rounded-md p-3 cursor-pointer transition-colors',
                          selectedIndex === index
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent/50'
                        )}
                        onClick={() => handleResultSelect(result)}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex-1 min-w-0'>
                            <div className='font-medium text-sm truncate'>
                              {result.title}
                            </div>
                            {result.description && (
                              <div className='text-xs text-muted-foreground mt-1 line-clamp-1'>
                                {result.description}
                              </div>
                            )}
                            <div className='flex items-center gap-1 text-xs text-muted-foreground mt-1'>
                              <span className='px-1.5 py-0.5 bg-muted rounded text-xs'>
                                {result.category}
                              </span>
                              {result.breadcrumb.length > 0 && (
                                <>
                                  <ChevronRight className='h-3 w-3' />
                                  <span className='truncate'>
                                    {result.breadcrumb.join(' > ')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <ChevronRight className='h-4 w-4 text-muted-foreground ml-2' />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* No Results */}
              {debouncedQuery && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='px-3 py-8 text-center text-muted-foreground'
                >
                  <Search className='h-8 w-8 mx-auto mb-2 opacity-50' />
                  <div className='text-sm font-medium'>No results found</div>
                  <div className='text-xs mt-1'>
                    Try adjusting your search terms
                  </div>
                </motion.div>
              )}

              {/* Recent Searches */}
              {!debouncedQuery && recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className='px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2'>
                    <Clock className='h-3 w-3' />
                    Recent Searches
                  </div>
                  <div className='space-y-1'>
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={search}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionSelect(search)}
                        className='w-full text-left rounded-md p-2 hover:bg-accent/50 transition-colors text-sm'
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Popular Searches */}
              {!debouncedQuery && popularSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={recentSearches.length > 0 ? 'mt-4' : ''}
                >
                  <div className='px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2'>
                    <TrendingUp className='h-3 w-3' />
                    Popular Searches
                  </div>
                  <div className='space-y-1'>
                    {popularSearches.map((search, index) => (
                      <motion.button
                        key={search}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionSelect(search)}
                        className='w-full text-left rounded-md p-2 hover:bg-accent/50 transition-colors text-sm'
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
