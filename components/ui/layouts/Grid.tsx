'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM } from '@/lib/design-system';

// Responsive Grid System
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  autoFit?: boolean;
  minWidth?: string;
  animated?: boolean;
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  default: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12'
};

export function Grid({
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'default',
  responsive = true,
  autoFit = false,
  minWidth = '250px',
  animated = false,
  children,
  ...props
}: GridProps) {
  const gridCols = responsive 
    ? [
        cols.default && `grid-cols-${cols.default}`,
        cols.sm && `sm:grid-cols-${cols.sm}`,
        cols.md && `md:grid-cols-${cols.md}`,
        cols.lg && `lg:grid-cols-${cols.lg}`,
        cols.xl && `xl:grid-cols-${cols.xl}`,
        cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`
      ].filter(Boolean).join(' ')
    : `grid-cols-${cols.default || 1}`;

  if (autoFit) {
    return (
      <div
        className={cn(
          'grid',
          gapClasses[gap],
          className
        )}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`
        }}
        {...props}
      >
        {animated ? (
          <AnimatePresence>
            {React.Children.map(children, (child, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: ANIMATION_SYSTEM.duration.normal / 1000,
                  delay: index * 0.1,
                  ease: ANIMATION_SYSTEM.framerEasing.easeOut
                }}
              >
                {child}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid',
        gridCols,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {animated ? (
        <AnimatePresence>
          {React.Children.map(children, (child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: ANIMATION_SYSTEM.duration.normal / 1000,
                delay: index * 0.1,
                ease: ANIMATION_SYSTEM.framerEasing.easeOut
              }}
            >
              {child}
            </motion.div>
          ))}
        </AnimatePresence>
      ) : children}
    </div>
  );
}