import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM } from '@/lib/design-system';

// Skeleton Loading Component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'avatar' | 'rectangle' | 'card';
  animate?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangle', animate = true, ...props }, ref) => {
    const baseClasses = 'bg-gray-200 rounded';
    
    const variantClasses = {
      text: 'h-4 w-full',
      avatar: 'h-12 w-12 rounded-full',
      rectangle: 'h-24 w-full',
      card: 'h-40 w-full rounded-lg'
    };

    const pulseAnimation = {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: ANIMATION_SYSTEM.duration.slower / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeInOut,
        repeat: Infinity
      }
    };

    if (animate) {
      const { ...restProps } = props;
      return (
        <motion.div
          ref={ref}
          className={cn(baseClasses, variantClasses[variant], className)}
          animate={pulseAnimation}
          {...(restProps as any)}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], 'animate-pulse', className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// Spinner Component
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', color = 'primary', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    const colorClasses = {
      primary: 'border-primary border-t-transparent',
      secondary: 'border-gray-300 border-t-transparent',
      white: 'border-white border-t-transparent'
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'border-2 rounded-full',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity
        }}
        {...(props as any)}
      />
    );
  }
);
Spinner.displayName = 'Spinner';

// Pulse Loader Component
interface PulseLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary';
}

const PulseLoader = React.forwardRef<HTMLDivElement, PulseLoaderProps>(
  ({ className, size = 'md', color = 'primary', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    };

    const colorClasses = {
      primary: 'bg-primary',
      secondary: 'bg-gray-400'
    };

    const containerClasses = cn('flex items-center gap-1', className);
    const dotClasses = cn('rounded-full', sizeClasses[size], colorClasses[color]);

    const pulseVariants = {
      initial: { scale: 0.8, opacity: 0.5 },
      animate: { scale: 1.2, opacity: 1 },
    };

    const containerVariants = {
      animate: {
        transition: {
          staggerChildren: 0.1,
          repeat: Infinity,
          repeatType: "reverse" as const
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        variants={containerVariants}
        animate="animate"
        {...(props as any)}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={dotClasses}
            variants={pulseVariants}
            transition={{
              duration: ANIMATION_SYSTEM.duration.normal / 1000,
              ease: ANIMATION_SYSTEM.framerEasing.easeInOut
            }}
          />
        ))}
      </motion.div>
    );
  }
);
PulseLoader.displayName = 'PulseLoader';

// Loading Overlay Component
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'spinner' | 'pulse';
  backdrop?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Loading...",
  variant = 'spinner',
  backdrop = true
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        backdrop && 'bg-black/20 backdrop-blur-sm'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: ANIMATION_SYSTEM.duration.fast / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut
      }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center gap-4 min-w-[200px]"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut
        }}
      >
        {variant === 'spinner' ? (
          <Spinner size="lg" />
        ) : (
          <PulseLoader size="lg" />
        )}
        <p className="text-sm text-gray-600 text-center">{message}</p>
      </motion.div>
    </motion.div>
  );
};

// Success/Error State Animations
interface StateIndicatorProps {
  state: 'success' | 'error' | 'warning';
  message?: string;
  isVisible: boolean;
}

const StateIndicator: React.FC<StateIndicatorProps> = ({
  state,
  message,
  isVisible
}) => {
  const stateConfig = {
    success: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: '✓'
    },
    error: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: '✗'
    },
    warning: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: '⚠'
    }
  };

  const config = stateConfig[state];

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 p-3 rounded-lg border',
        config.bgColor,
        config.borderColor
      )}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut
      }}
    >
      <motion.span
        className={cn('text-lg', config.color)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: ANIMATION_SYSTEM.duration.fast / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.bounce,
          delay: 0.1
        }}
      >
        {config.icon}
      </motion.span>
      {message && (
        <span className={cn('text-sm font-medium', config.color)}>
          {message}
        </span>
      )}
    </motion.div>
  );
};

export {
  Skeleton,
  Spinner,
  PulseLoader,
  LoadingOverlay,
  StateIndicator,
  type SkeletonProps,
  type SpinnerProps,
  type PulseLoaderProps,
  type LoadingOverlayProps,
  type StateIndicatorProps
};