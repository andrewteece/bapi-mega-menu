'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedMegaPanelProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  panelId: string;
}

// Stagger animation variants for menu items
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    x: -5,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export default function AnimatedMegaPanel({
  isOpen,
  children,
  className,
  panelId,
}: AnimatedMegaPanelProps) {
  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <motion.div
          id={panelId}
          role='menu'
          className={cn(
            'absolute left-0 top-full z-50 mt-1 w-screen max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl',
            'rounded-lg border bg-popover/95 backdrop-blur-md p-6 text-popover-foreground shadow-xl',
            'ring-1 ring-black/5 dark:ring-white/10',
            className
          )}
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          layout
        >
          <motion.div variants={itemVariants}>{children}</motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced column block with stagger animations
export function AnimatedColumnBlock({
  title,
  items,
  className,
}: {
  title: string;
  items: Array<{
    href: string;
    title: string;
    description?: string;
    isExternal?: boolean;
  }>;
  className?: string;
}) {
  const columnVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const linkVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={cn('space-y-3', className)}
      variants={columnVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.h3
        className='font-semibold text-sm tracking-wider text-muted-foreground uppercase'
        variants={linkVariants}
      >
        {title}
      </motion.h3>
      <motion.div className='space-y-2' variants={columnVariants}>
        {items.map((item, index) => (
          <motion.div
            key={`${item.href}-${index}`}
            variants={linkVariants}
            whileHover={{
              x: 4,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.a
              href={item.href}
              className={cn(
                'group block rounded-md p-2 hover:bg-accent/50 transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              role='menuitem'
              whileHover={{
                backgroundColor: 'rgba(var(--accent), 0.1)',
                transition: { duration: 0.15 },
              }}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <motion.div
                    className='font-medium text-sm group-hover:text-accent-foreground'
                    initial={{ color: 'var(--foreground)' }}
                    whileHover={{
                      color: 'var(--accent-foreground)',
                      transition: { duration: 0.15 },
                    }}
                  >
                    {item.title}
                  </motion.div>
                  {item.description && (
                    <motion.div
                      className='text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100'
                      initial={{ opacity: 0, y: -5 }}
                      whileHover={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.2, delay: 0.1 },
                      }}
                    >
                      {item.description}
                    </motion.div>
                  )}
                </div>
                {item.isExternal && (
                  <motion.div
                    className='ml-2 opacity-0 group-hover:opacity-100'
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.2, delay: 0.1 },
                    }}
                  >
                    <div className='h-3 w-3 text-muted-foreground'>
                      <svg
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.a>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// Animated trigger button with sophisticated hover effects
interface AnimatedNavTriggerProps {
  children: ReactNode;
  isOpen: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-haspopup'?: boolean;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

export function AnimatedNavTrigger({
  children,
  isOpen,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  type = 'button',
  'aria-haspopup': ariaHaspopup,
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
}: AnimatedNavTriggerProps) {
  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      aria-haspopup={ariaHaspopup}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      whileHover={{
        scale: 1.02,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
        transition: { duration: 0.2 },
      }}
    >
      <motion.span
        animate={{
          color: isOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
          transition: { duration: 0.2 },
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
