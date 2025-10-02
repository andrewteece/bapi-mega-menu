'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

// Base skeleton component with shimmer animation
export function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        'rounded-md bg-muted/50 relative overflow-hidden',
        className
      )}
      animate={
        animate
          ? {
              backgroundColor: [
                'rgba(var(--muted), 0.5)',
                'rgba(var(--muted), 0.8)',
                'rgba(var(--muted), 0.5)',
              ],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined
      }
    >
      {animate && (
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full'
          animate={{
            translateX: ['100%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  );
}

// Navigation menu skeleton loader
export function NavigationSkeleton() {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: i * 0.1,
            duration: 0.3,
            ease: 'easeOut',
          }}
        >
          <Skeleton className='h-9 w-20 rounded-md' />
        </motion.div>
      ))}
    </div>
  );
}

// Mega menu panel skeleton
export function MegaMenuSkeleton() {
  return (
    <motion.div
      className='absolute left-0 top-full z-50 mt-1 w-screen max-w-4xl rounded-lg border bg-popover/95 backdrop-blur-md p-6 shadow-xl'
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {Array.from({ length: 3 }).map((_, colIndex) => (
          <motion.div
            key={colIndex}
            className='space-y-3'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: colIndex * 0.1,
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            {/* Column title */}
            <Skeleton className='h-4 w-24' />

            {/* Column items */}
            <div className='space-y-2'>
              {Array.from({ length: 4 }).map((_, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  className='p-2 rounded-md'
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: colIndex * 0.1 + itemIndex * 0.05,
                    duration: 0.2,
                    ease: 'easeOut',
                  }}
                >
                  <Skeleton className='h-4 w-full mb-1' />
                  <Skeleton className='h-3 w-3/4 opacity-60' />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Mobile menu search skeleton
export function SearchSkeleton() {
  return (
    <motion.div
      className='space-y-3'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className='space-y-2'>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className='flex items-center gap-3 p-2 rounded-md'
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.1,
              duration: 0.2,
              ease: 'easeOut',
            }}
          >
            <Skeleton className='h-4 w-4 rounded-full' />
            <div className='flex-1 space-y-1'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-3 w-2/3 opacity-60' />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Loading states for different contexts
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-foreground',
        sizeClasses[size]
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// Smart loading indicator with contextual messages
export function SmartLoadingIndicator({
  message = 'Loading...',
  progress,
  className,
}: {
  message?: string;
  progress?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg bg-muted/20',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <LoadingSpinner size='sm' />
      <div className='flex-1'>
        <motion.div
          className='text-sm font-medium'
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.div>
        {typeof progress === 'number' && (
          <div className='mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden'>
            <motion.div
              className='bg-primary h-full rounded-full'
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
