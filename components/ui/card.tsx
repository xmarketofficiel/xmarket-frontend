import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM } from '@/lib/design-system';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  withMotion?: boolean;
  hoverEffect?: 'subtle' | 'lift' | 'glow' | 'none';
}

// @ts-ignore
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, withMotion = true, hoverEffect = 'subtle', children, ...props }, ref) => {
    const motionProps: HTMLMotionProps<"div"> = withMotion ? {
      whileHover: hoverEffect === 'lift' ? {
        y: -4,
        scale: 1.02,
        transition: {
          duration: ANIMATION_SYSTEM.duration.fast / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut
        }
      } : hoverEffect === 'glow' ? {
        scale: 1.01,
        transition: {
          duration: ANIMATION_SYSTEM.duration.fast / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut
        }
      } : hoverEffect === 'subtle' ? {
        scale: 1.005,
        transition: {
          duration: ANIMATION_SYSTEM.duration.fast / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut
        }
      } : {},
      animate: {
        transition: {
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut
        }
      }
    } : {};

    const enhancedClasses = cn(
      // Enhanced with design system tokens while preserving existing functionality
      'design-card transition-all will-change-transform',
      // Enhanced hover effects based on hoverEffect prop
      hoverEffect === 'lift' && 'hover:shadow-xl',
      hoverEffect === 'glow' && 'hover:shadow-lg hover:ring-1 hover:ring-primary/20',
      hoverEffect === 'subtle' && 'hover:shadow-md',
      // Fallback for components not yet using design system
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    );

    if (withMotion) {
      return (
        <motion.div
          ref={ref}
          className={enhancedClasses}
          {...motionProps}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        // @ts-ignore
        ref={ref}
        className={enhancedClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// @ts-ignore
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    // @ts-ignore
    ref={ref}
    className={cn(
      // Enhanced spacing using design system
      'flex flex-col space-y-design-xs p-design-lg',
      // Fallback
      'space-y-1.5 p-6',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// @ts-ignore
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    // @ts-ignore
    ref={ref}
    className={cn(
      // Enhanced typography using design system
      'text-typography-h3 font-typography-semibold leading-typography-tight tracking-tight',
      // Fallback
      'text-2xl font-semibold leading-none',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// @ts-ignore
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    // @ts-ignore
    ref={ref}
    className={cn(
      // Enhanced using design system
      'text-typography-small text-semantic-text-secondary',
      // Fallback
      'text-sm text-muted-foreground',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// @ts-ignore
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    // @ts-ignore
    ref={ref} 
    className={cn(
      // Enhanced spacing
      'p-design-lg pt-0',
      // Fallback
      'p-6',
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

// @ts-ignore
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    // @ts-ignore
    ref={ref}
    className={cn(
      // Enhanced spacing
      'flex items-center p-design-lg pt-0',
      // Fallback
      'p-6',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
