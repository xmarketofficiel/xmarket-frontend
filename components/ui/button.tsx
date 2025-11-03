import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM, COLOR_SYSTEM } from '@/lib/design-system';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu will-change-transform relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 hover:shadow-md shadow-sm',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 hover:shadow-md shadow-sm',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95 hover:shadow-sm hover:border-accent',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 hover:shadow-md shadow-sm',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95',
        link: 'text-primary underline-offset-4 hover:underline active:scale-95',
        // New variants
        success: 'bg-green-600 text-white hover:bg-green-700 active:scale-95 hover:shadow-md shadow-sm',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700 active:scale-95 hover:shadow-md shadow-sm',
        info: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 hover:shadow-md shadow-sm',
        gradient: 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 active:scale-95 hover:shadow-lg shadow-md',
        'gradient-success': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 active:scale-95 hover:shadow-lg shadow-md',
        'gradient-danger': 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 active:scale-95 hover:shadow-lg shadow-md',
        'outline-primary': 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground active:scale-95 hover:shadow-md',
        'outline-success': 'border-2 border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white active:scale-95 hover:shadow-md',
        'outline-danger': 'border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white active:scale-95 hover:shadow-md',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-95 hover:shadow-lg',
        shimmer: 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95 hover:shadow-md shadow-sm relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
      },
      size: {
        xs: 'h-7 rounded px-2 text-xs',
        sm: 'h-9 rounded-md px-3 text-sm',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8 text-base',
        xl: 'h-12 rounded-lg px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  withMotion?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// @ts-ignore
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    withMotion = true, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;
    
    const motionProps: HTMLMotionProps<"button"> = withMotion && !isDisabled ? {
      whileHover: { 
        scale: 1.02,
        transition: { 
          duration: ANIMATION_SYSTEM.duration.fast / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }
      },
      whileTap: { 
        scale: 0.98,
        transition: { 
          duration: ANIMATION_SYSTEM.duration.fast / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }
      },
      animate: {
        transition: {
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut
        }
      }
    } : {};

    const content = (
      <>
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex-shrink-0">{leftIcon}</span>
        )}
        <span className="flex-1">
          {loading && loadingText ? loadingText : children}
        </span>
        {!loading && rightIcon && (
          <span className="ml-2 flex-shrink-0">{rightIcon}</span>
        )}
      </>
    );

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
          // @ts-ignore
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    if (withMotion && !isDisabled) {
      return (
        <motion.button
          className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
          // @ts-ignore
          ref={ref}
          disabled={isDisabled}
          {...motionProps}
          {...(props as any)}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        // @ts-ignore
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
