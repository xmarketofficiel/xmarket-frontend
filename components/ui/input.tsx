import * as React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM } from '@/lib/design-system';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  withMotion?: boolean;
  hasError?: boolean;
  isSuccess?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, withMotion = true, hasError = false, isSuccess = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    const baseClasses = 'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all will-change-transform';
    
    const stateClasses = cn(
      // Border and ring states
      hasError 
        ? 'border-red-300 focus-visible:ring-red-500 focus-visible:border-red-500' 
        : isSuccess 
          ? 'border-green-300 focus-visible:ring-green-500 focus-visible:border-green-500'
          : 'border-input focus-visible:ring-ring focus-visible:border-ring',
      // Focus and hover effects
      'hover:border-accent focus-visible:ring-2 focus-visible:ring-offset-2',
      // Enhanced shadow effects
      isFocused ? 'shadow-md' : 'shadow-sm hover:shadow-md'
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    if (withMotion) {
      const { onFocus, onBlur, ...restProps } = props;
      return (
        <motion.input
          type={type}
          className={cn(baseClasses, stateClasses, className)}
          ref={ref as React.LegacyRef<HTMLInputElement>}
          onFocus={handleFocus}
          onBlur={handleBlur}
          whileFocus={{
            scale: 1.02,
            transition: {
              duration: ANIMATION_SYSTEM.duration.fast / 1000,
              ease: ANIMATION_SYSTEM.framerEasing.easeOut
            }
          }}
          animate={{
            scale: isFocused ? 1.02 : 1,
            transition: {
              duration: ANIMATION_SYSTEM.duration.normal / 1000,
              ease: ANIMATION_SYSTEM.framerEasing.easeOut
            }
          }}
          {...(restProps as any)}
        />
      );
    }

    return (
      <input
        type={type}
        className={cn(baseClasses, stateClasses, className)}
        ref={ref as React.LegacyRef<HTMLInputElement>}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
