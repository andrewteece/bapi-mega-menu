'use client';

import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  enabled: boolean;
  onEscape?: () => void;
  className?: string;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

export function FocusTrap({
  children,
  enabled,
  onEscape,
  className,
  autoFocus = true,
  restoreFocus = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Store the previously focused element
  useEffect(() => {
    if (enabled) {
      previousActiveElement.current = document.activeElement;

      if (autoFocus && containerRef.current) {
        // Find first focusable element
        const firstFocusable = containerRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;

        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    }

    return () => {
      if (
        restoreFocus &&
        previousActiveElement.current instanceof HTMLElement
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, autoFocus, restoreFocus]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || !containerRef.current) return;

      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = containerRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    },
    [enabled, onEscape]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className={className}
      role={enabled ? 'dialog' : undefined}
      aria-modal={enabled ? 'true' : undefined}
    >
      {children}
    </div>
  );
}

// Screen reader announcements
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  live?: 'off' | 'polite' | 'assertive';
}

export function ScreenReaderOnly({
  children,
  live = 'polite',
}: ScreenReaderOnlyProps) {
  return (
    <div className='sr-only' aria-live={live} aria-atomic='true'>
      {children}
    </div>
  );
}

// Live region for dynamic announcements
export function LiveRegion({
  message,
  level = 'polite',
}: {
  message: string;
  level?: 'off' | 'polite' | 'assertive';
}) {
  const [announcement, setAnnouncement] = React.useState('');

  React.useEffect(() => {
    if (message) {
      setAnnouncement(message);
      // Clear after announcement to allow repeated messages
      const timer = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div aria-live={level} aria-atomic='true' className='sr-only'>
      {announcement}
    </div>
  );
}

// Reduced motion preferences
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Enhanced button with comprehensive accessibility
interface AccessibleButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function AccessibleButton({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  disabled,
  className,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
}: AccessibleButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-4 py-2',
    lg: 'h-10 px-8',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        className || ''
      }`}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      whileHover={!prefersReducedMotion ? { scale: 1.02 } : undefined}
      whileTap={!prefersReducedMotion ? { scale: 0.98 } : undefined}
    >
      {loading && (
        <>
          <motion.div
            className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent'
            animate={!prefersReducedMotion ? { rotate: 360 } : undefined}
            transition={
              !prefersReducedMotion
                ? {
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }
                : undefined
            }
          />
          <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
        </>
      )}

      {!loading && leftIcon && (
        <span className='inline-flex' aria-hidden='true'>
          {leftIcon}
        </span>
      )}

      <span>{loading ? loadingText : children}</span>

      {!loading && rightIcon && (
        <span className='inline-flex' aria-hidden='true'>
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
}

// High contrast mode detection
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  React.useEffect(() => {
    const checkHighContrast = () => {
      // Check for high contrast mode indicators
      const testElement = document.createElement('div');
      testElement.style.cssText =
        'border: 1px solid; border-color: buttontext; position: absolute; visibility: hidden;';
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const isHighContrastActive =
        computedStyle.borderTopColor !== 'rgb(0, 0, 0)' &&
        computedStyle.borderTopColor !== 'rgba(0, 0, 0, 0)';

      document.body.removeChild(testElement);
      setIsHighContrast(isHighContrastActive);
    };

    checkHighContrast();

    // Re-check on focus events (Windows high contrast can change)
    window.addEventListener('focus', checkHighContrast);
    return () => window.removeEventListener('focus', checkHighContrast);
  }, []);

  return isHighContrast;
}

// Skip link component for better navigation
export function SkipLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-background text-foreground px-4 py-2 rounded-md border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      {children}
    </a>
  );
}
