'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ArrowLeft, ChevronRight, ExternalLink, Search, X } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import {
  useNavigation,
  useNavigationSearch,
} from './context/NavigationContext';
import { MenuErrorBoundary } from './ErrorBoundary';
import { useDebouncedSearch } from './hooks/usePerformance';
import type { NavItem, NavLink } from './types';

type MobileMenuProps = {
  open: boolean;
  onOpen: (v: boolean) => void;
};

type SearchResult = NavLink & {
  category: string;
  breadcrumb: string[];
};

export default function EnhancedMobileMenu({ open, onOpen }: MobileMenuProps) {
  const { state } = useNavigation();
  const { isSearchEnabled } = useNavigationSearch();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Enhanced search function
  const performSearch = useCallback(
    (query: string): SearchResult[] => {
      if (!query.trim()) return [];

      const results: SearchResult[] = [];
      const searchTerm = query.toLowerCase();

      state.items.forEach((item: NavItem) => {
        item.columns.forEach((column) => {
          column.links.forEach((link) => {
            const matchesLabel = link.label.toLowerCase().includes(searchTerm);
            const matchesDescription =
              link.description?.toLowerCase().includes(searchTerm) || false;
            const matchesCategory = item.label
              .toLowerCase()
              .includes(searchTerm);

            if (matchesLabel || matchesDescription || matchesCategory) {
              results.push({
                ...link,
                category: item.label,
                breadcrumb: [item.label, column.title, link.label],
              });
            }
          });
        });
      });

      return results.slice(0, 20); // Limit results
    },
    [state.items]
  );

  const { query, results, isSearching, search } = useDebouncedSearch(
    performSearch,
    300
  );

  // Update search results when debounced search completes
  React.useEffect(() => {
    setSearchResults(results as SearchResult[]);
  }, [results]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      search(searchQuery);

      if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
        setRecentSearches((prev) => [searchQuery.trim(), ...prev.slice(0, 4)]);
      }
    },
    [search, recentSearches]
  );

  const handleLinkClick = useCallback(
    (link: NavLink) => {
      // Close menu when link is clicked
      onOpen(false);
      setSearchMode(false);
    },
    [onOpen]
  );

  const toggleSearchMode = useCallback(() => {
    setSearchMode((prev) => !prev);
    if (!searchMode) {
      // Focus search input when entering search mode
      setTimeout(() => {
        const searchInput = document.querySelector(
          '#mobile-search'
        ) as HTMLInputElement;
        searchInput?.focus();
      }, 100);
    }
  }, [searchMode]);

  return (
    <Sheet open={open} onOpenChange={onOpen}>
      {/* Trigger Button */}
      <SheetTrigger asChild>
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className={`
            group relative md:hidden
            inline-flex h-10 w-10 items-center justify-center
            rounded-md border border-white/20 bg-white/5 hover:bg-white/10 active:bg-white/15
            text-white dark:text-white
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2
            motion-safe:transition-transform motion-safe:duration-200 hover:scale-110 active:scale-95
            will-change-transform
          `}
        >
          {/* Hamburger Animation */}
          <span
            className={`
              absolute block h-0.5 w-6 rounded bg-current
              motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out
              ${
                open
                  ? 'translate-y-0 rotate-45 delay-75'
                  : '-translate-y-2 rotate-0 delay-0'
              }
            `}
          />
          <span
            className={`
              absolute block h-0.5 w-6 rounded bg-current
              motion-safe:transition-opacity motion-safe:duration-200
              ${open ? 'opacity-0' : 'opacity-100'}
            `}
          />
          <span
            className={`
              absolute block h-0.5 w-6 rounded bg-current
              motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out
              ${
                open
                  ? 'translate-y-0 -rotate-45 delay-100'
                  : 'translate-y-2 rotate-0 delay-75'
              }
            `}
          />
        </button>
      </SheetTrigger>

      {/* Drawer Content */}
      <SheetContent
        side='left'
        className='w-80 md:hidden p-0 [&>button.absolute]:hidden'
      >
        <MenuErrorBoundary>
          <div className='flex h-full flex-col'>
            {/* Header */}
            <SheetHeader className='border-b border-neutral-200 dark:border-neutral-800 p-4'>
              <div className='flex items-center justify-between'>
                {searchMode ? (
                  <button
                    onClick={toggleSearchMode}
                    className='flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  >
                    <ArrowLeft className='h-4 w-4' />
                    Back to Menu
                  </button>
                ) : (
                  <SheetTitle className='text-lg font-semibold'>
                    Navigation
                  </SheetTitle>
                )}

                {isSearchEnabled && !searchMode && (
                  <button
                    onClick={toggleSearchMode}
                    className='p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
                    aria-label='Search navigation'
                  >
                    <Search className='h-4 w-4' />
                  </button>
                )}
              </div>
            </SheetHeader>

            {/* Content */}
            <div className='flex-1 overflow-y-auto'>
              {searchMode ? (
                <SearchView
                  query={query}
                  onSearch={handleSearch}
                  results={searchResults}
                  isSearching={isSearching}
                  recentSearches={recentSearches}
                  onLinkClick={handleLinkClick}
                />
              ) : (
                <NavigationView
                  items={state.items}
                  onLinkClick={handleLinkClick}
                />
              )}
            </div>
          </div>
        </MenuErrorBoundary>
      </SheetContent>
    </Sheet>
  );
}

// Search View Component
type SearchViewProps = {
  query: string;
  onSearch: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  recentSearches: string[];
  onLinkClick: (link: NavLink) => void;
};

function SearchView({
  query,
  onSearch,
  results,
  isSearching,
  recentSearches,
  onLinkClick,
}: SearchViewProps) {
  return (
    <div className='p-4 space-y-4'>
      {/* Search Input */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400' />
        <input
          id='mobile-search'
          type='text'
          placeholder='Search navigation...'
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        {query && (
          <button
            onClick={() => onSearch('')}
            aria-label='Clear search'
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Search Results */}
      {query ? (
        <div className='space-y-2'>
          {isSearching ? (
            <div className='text-center py-8 text-neutral-500'>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <h3 className='text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2'>
                Search Results ({results.length})
              </h3>
              {results.map((result, index) => (
                <SearchResultItem
                  key={`${result.href}-${index}`}
                  result={result}
                  onClick={() => onLinkClick(result)}
                />
              ))}
            </>
          ) : (
            <div className='text-center py-8 text-neutral-500'>
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      ) : (
        /* Recent Searches */
        recentSearches.length > 0 && (
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
              Recent Searches
            </h3>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onSearch(search)}
                className='w-full text-left px-2 py-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800'
              >
                {search}
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// Search Result Item Component
type SearchResultItemProps = {
  result: SearchResult;
  onClick: () => void;
};

function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  return (
    <div
      onClick={onClick}
      className='p-3 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors'
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <h4 className='font-medium text-neutral-900 dark:text-neutral-100'>
              {result.label}
            </h4>
            {result.badge && (
              <span className='px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded'>
                {result.badge}
              </span>
            )}
            {result.isExternal && (
              <ExternalLink className='h-3 w-3 text-neutral-400' />
            )}
          </div>

          <div className='text-xs text-neutral-500 dark:text-neutral-400 mt-1'>
            {result.breadcrumb.join(' > ')}
          </div>

          {result.description && (
            <p className='text-sm text-neutral-600 dark:text-neutral-300 mt-1'>
              {result.description}
            </p>
          )}
        </div>

        <ChevronRight className='h-4 w-4 text-neutral-400 flex-shrink-0 ml-2' />
      </div>
    </div>
  );
}

// Navigation View Component
type NavigationViewProps = {
  items: NavItem[];
  onLinkClick: (link: NavLink) => void;
};

function NavigationView({ items, onLinkClick }: NavigationViewProps) {
  return (
    <div className='p-4'>
      <Accordion type='multiple' className='space-y-2'>
        {items
          .filter((item) => item.isVisible)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item) => (
            <AccordionItem
              key={item.label}
              value={item.label}
              className='border border-neutral-200 dark:border-neutral-800 rounded-md'
            >
              <AccordionTrigger className='px-4 py-3 hover:no-underline hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-t-md'>
                <span className='font-medium'>{item.label}</span>
              </AccordionTrigger>
              <AccordionContent className='px-0 pb-0'>
                {item.columns.map((column) => (
                  <div
                    key={column.title}
                    className='border-t border-neutral-200 dark:border-neutral-800'
                  >
                    <h4 className='px-4 py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50'>
                      {column.title}
                    </h4>
                    <div className='px-4 py-2 space-y-1'>
                      {column.links.map((link) => (
                        <MobileNavLink
                          key={link.href}
                          link={link}
                          onClick={() => onLinkClick(link)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
}

// Mobile Navigation Link Component
type MobileNavLinkProps = {
  link: NavLink;
  onClick: () => void;
};

function MobileNavLink({ link, onClick }: MobileNavLinkProps) {
  const Component = link.isExternal ? 'a' : Link;
  const props = link.isExternal
    ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
    : { href: link.href };

  return (
    <Component
      {...props}
      onClick={onClick}
      className='flex items-center justify-between group w-full px-2 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors'
    >
      <div className='flex items-center gap-2 flex-1'>
        <span>{link.label}</span>
        {link.badge && (
          <span className='px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded'>
            {link.badge}
          </span>
        )}
      </div>

      <div className='flex items-center gap-1'>
        {link.isExternal && (
          <ExternalLink className='h-3 w-3 text-neutral-400' />
        )}
        <ChevronRight className='h-3 w-3 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300' />
      </div>
    </Component>
  );
}
