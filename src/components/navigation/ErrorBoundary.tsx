'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'navigation' | 'menu' | 'item';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

export interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  resetError: () => void;
  level: 'navigation' | 'menu' | 'item';
}

class NavigationErrorBoundaryClass extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `nav-error-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error(
      'Navigation Error Boundary caught an error:',
      error,
      errorInfo
    );

    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Auto-retry after 5 seconds for non-critical errors
    if (this.props.level !== 'navigation') {
      this.resetTimeoutId = window.setTimeout(() => {
        this.resetError();
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          level={this.props.level || 'navigation'}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback components
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  level,
}) => {
  const getErrorContent = () => {
    switch (level) {
      case 'item':
        return {
          title: 'Menu Item Error',
          description: 'This menu item could not be displayed.',
          showDetails: false,
          className: 'p-2 text-sm',
        };
      case 'menu':
        return {
          title: 'Menu Error',
          description: 'This menu section is temporarily unavailable.',
          showDetails: false,
          className: 'p-4',
        };
      case 'navigation':
      default:
        return {
          title: 'Navigation Error',
          description: 'The navigation menu encountered an error.',
          showDetails: true,
          className: 'p-6',
        };
    }
  };

  const { title, description, showDetails, className } = getErrorContent();

  return (
    <div
      className={`${className} flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-center`}
    >
      <AlertTriangle className='h-6 w-6 text-red-500 dark:text-red-400 mb-2' />
      <h3 className='font-semibold text-red-900 dark:text-red-100 mb-1'>
        {title}
      </h3>
      <p className='text-red-700 dark:text-red-200 text-sm mb-3'>
        {description}
      </p>

      {showDetails && (
        <details className='mb-3 text-xs text-red-600 dark:text-red-300'>
          <summary className='cursor-pointer hover:underline'>
            Error Details
          </summary>
          <pre className='mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-left overflow-auto max-h-32'>
            {error?.message || 'Unknown error'}
          </pre>
        </details>
      )}

      <div className='flex gap-2'>
        <button
          onClick={resetError}
          className='inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-200 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors'
        >
          <RefreshCw className='h-3 w-3' />
          Retry
        </button>

        {level === 'navigation' && (
          <Link
            href='/'
            className='inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-200 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors'
          >
            <Home className='h-3 w-3' />
            Home
          </Link>
        )}
      </div>
    </div>
  );
};

// Specialized error boundaries for different navigation components
export const NavigationErrorBoundary = NavigationErrorBoundaryClass;

export const MenuErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <NavigationErrorBoundaryClass {...props} level='menu' />
);

export const MenuItemErrorBoundary: React.FC<Omit<Props, 'level'>> = (
  props
) => <NavigationErrorBoundaryClass {...props} level='item' />;

// HOC for wrapping components with error boundaries
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  level: 'navigation' | 'menu' | 'item' = 'item'
) {
  const WrappedComponent: React.FC<T> = (props) => (
    <NavigationErrorBoundaryClass level={level}>
      <Component {...props} />
    </NavigationErrorBoundaryClass>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

// Hook for error reporting
export function useErrorHandler() {
  const handleError = React.useCallback(
    (error: Error, errorInfo?: ErrorInfo) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Navigation error caught:', error, errorInfo);
      }

      // In production, you might want to send errors to a logging service
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to error tracking service
        // errorTrackingService.captureException(error, { extra: errorInfo });
      }
    },
    []
  );

  return { handleError };
}

export default NavigationErrorBoundaryClass;
