'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM, COLOR_SYSTEM } from '@/lib/design-system';
import { Button } from './button';

// Enhanced Tooltip System
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
// Any-typed shim to avoid TooltipTrigger prop typing conflicts during build
const AnyTooltipTrigger = TooltipTrigger as unknown as React.ComponentType<any>;

interface EnhancedTooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  variant?: 'default' | 'dark' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'default' | 'lg';
  hasArrow?: boolean;
  maxWidth?: string;
  showDelay?: number;
  hideDelay?: number;
}

const tooltipVariants = {
  default: 'bg-popover text-popover-foreground border',
  dark: 'bg-gray-900 text-white border-gray-700',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
};

const tooltipSizes = {
  sm: 'px-2 py-1 text-xs',
  default: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

const EnhancedTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  EnhancedTooltipContentProps
>(({ 
  className, 
  sideOffset = 8,
  variant = 'default',
  size = 'default',
  hasArrow = true,
  maxWidth = '300px',
  showDelay = 200,
  hideDelay = 100,
  children,
  ...props 
}: any, ref: any) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-lg shadow-lg',
      'animate-in fade-in-0 zoom-in-95 duration-200',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  tooltipVariants[variant as keyof typeof tooltipVariants],
  tooltipSizes[size as keyof typeof tooltipSizes],
      className
    )}
    style={{ maxWidth }}
    {...props}
  >
    {children}
    {hasArrow && (() => {
      const TooltipArrowAny = TooltipPrimitive.Arrow as any;
      return (
        <TooltipArrowAny
          className={cn(
            'fill-current',
            variant === 'dark' && 'text-gray-900',
            variant === 'success' && 'text-green-50',
            variant === 'warning' && 'text-yellow-50',
            variant === 'error' && 'text-red-50',
            variant === 'info' && 'text-blue-50'
          )}
        />
      );
    })()}
  </TooltipPrimitive.Content>
));
EnhancedTooltipContent.displayName = 'EnhancedTooltipContent';

// Enhanced Tooltip Component
interface EnhancedTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'default' | 'lg';
  side?: 'top' | 'right' | 'bottom' | 'left';
  hasArrow?: boolean;
  disabled?: boolean;
  showDelay?: number;
  hideDelay?: number;
  maxWidth?: string;
  className?: string;
}

export function EnhancedTooltip({
  content,
  children,
  variant = 'default',
  size = 'default',
  side = 'top',
  hasArrow = true,
  disabled = false,
  showDelay = 200,
  hideDelay = 100,
  maxWidth = '300px',
  className
}: EnhancedTooltipProps) {
  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={showDelay}>
      <TooltipRoot>
        <AnyTooltipTrigger asChild>
          {children}
        </AnyTooltipTrigger>
        <EnhancedTooltipContent
          side={side}
          variant={variant}
          size={size}
          hasArrow={hasArrow}
          maxWidth={maxWidth}
          className={className}
        >
          {content}
        </EnhancedTooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

// Info Tooltip Component
interface InfoTooltipProps {
  content: React.ReactNode;
  variant?: 'default' | 'info';
  size?: 'sm' | 'default';
  className?: string;
}

export function InfoTooltip({ 
  content, 
  variant = 'info',
  size = 'sm',
  className 
}: InfoTooltipProps) {
  return (
    <EnhancedTooltip content={content} variant={variant} size={size}>
      <Info className={cn('h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-help', className)} />
    </EnhancedTooltip>
  );
}

// Enhanced Popover System
const PopoverRoot = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
// Any-typed shim for PopoverPrimitive.Close to avoid typing conflicts during build
const AnyPopoverClose = PopoverPrimitive.Close as unknown as React.ComponentType<any>;
// Any-typed shim for PopoverPrimitive.Arrow to allow className prop
const AnyPopoverArrow = PopoverPrimitive.Arrow as unknown as React.ComponentType<any>;
// Any-typed shim for PopoverTrigger
const AnyPopoverTrigger = PopoverTrigger as unknown as React.ComponentType<any>;
// Any-typed shims for HoverCard primitives
const AnyHoverCardTrigger = HoverCardPrimitive.Trigger as unknown as React.ComponentType<any>;
const AnyHoverCardContent = HoverCardPrimitive.Content as unknown as React.ComponentType<any>;
const AnyHoverCardArrow = HoverCardPrimitive.Arrow as unknown as React.ComponentType<any>;

interface EnhancedPopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  variant?: 'default' | 'minimal' | 'elevated';
  hasArrow?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const popoverVariants = {
  default: 'bg-popover text-popover-foreground border shadow-md',
  minimal: 'bg-white text-gray-900 border-0 shadow-sm',
  elevated: 'bg-white text-gray-900 border-0 shadow-xl'
};

const EnhancedPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  EnhancedPopoverContentProps
>(({ 
  className, 
  align = 'center',
  sideOffset = 8,
  variant = 'default',
  hasArrow = true,
  dismissible = true,
  onDismiss,
  children,
  ...props 
}: any, ref: any) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 rounded-lg p-4 outline-none',
        'animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  popoverVariants[variant as keyof typeof popoverVariants],
        className
      )}
      {...props}
    >
      {dismissible && (
        <AnyPopoverClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </AnyPopoverClose>
      )}
      {children}
      {hasArrow && (
        <AnyPopoverArrow className="fill-current text-popover" />
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
EnhancedPopoverContent.displayName = 'EnhancedPopoverContent';

// Enhanced Popover Component
interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  trigger?: 'click' | 'hover';
  variant?: 'default' | 'minimal' | 'elevated';
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  hasArrow?: boolean;
  dismissible?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Popover({
  children,
  content,
  trigger = 'click',
  variant = 'default',
  side = 'bottom',
  align = 'center',
  hasArrow = true,
  dismissible = true,
  open,
  onOpenChange,
  disabled = false,
  className
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  if (disabled) {
    return <>{children}</>;
  }

  if (trigger === 'hover') {
    return (
      <HoverCardPrimitive.Root
        open={isOpen}
        onOpenChange={handleOpenChange}
        openDelay={200}
        closeDelay={300}
      >
        <AnyHoverCardTrigger asChild>
            {children}
          </AnyHoverCardTrigger>
          <AnyHoverCardContent
          side={side}
          align={align}
          className={cn(
            'z-50 rounded-lg p-4 outline-none',
            'animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            popoverVariants[variant],
            className
          )}
        >
          {content}
          {hasArrow && (
            <AnyHoverCardArrow className="fill-current text-popover" />
          )}
        </AnyHoverCardContent>
      </HoverCardPrimitive.Root>
    );
  }

  return (
    <PopoverRoot open={isOpen} onOpenChange={handleOpenChange}>
      <AnyPopoverTrigger asChild>
        {children}
      </AnyPopoverTrigger>
      <EnhancedPopoverContent
        side={side}
        align={align}
        variant={variant}
        hasArrow={hasArrow}
        dismissible={dismissible}
        className={className}
      >
        {content}
      </EnhancedPopoverContent>
    </PopoverRoot>
  );
}

// Loading Skeleton Component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'rounded' | 'circular';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  animated = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-muted',
        variant === 'rounded' && 'rounded-md',
        variant === 'circular' && 'rounded-full',
        animated && 'animate-pulse',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}

// Loading State Component
interface LoadingStateProps {
  size?: 'sm' | 'default' | 'lg';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

export function LoadingState({
  size = 'default',
  text,
  variant = 'spinner',
  className
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-primary', sizeClasses[size])} />
        {text && <span className={cn('text-muted-foreground', textSizeClasses[size])}>{text}</span>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn('bg-primary rounded-full animate-pulse', 
                size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5'
              )}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        {text && <span className={cn('text-muted-foreground', textSizeClasses[size])}>{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className={cn('bg-primary rounded-full animate-pulse', sizeClasses[size])} />
        {text && <span className={cn('text-muted-foreground', textSizeClasses[size])}>{text}</span>}
      </div>
    );
  }

  return null;
}

// Progress Indicator Component
interface ProgressIndicatorProps {
  value: number;
  max?: number;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressIndicator({
  value,
  max = 100,
  size = 'default',
  variant = 'default',
  showValue = false,
  animated = true,
  className
}: ProgressIndicatorProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={cn('space-y-1', className)}>
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            variantClasses[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

// Badge Component with Enhanced Variants
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'default' | 'lg';
  dot?: boolean;
  pulse?: boolean;
}

const badgeVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
  success: 'bg-green-500 text-white hover:bg-green-600',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  info: 'bg-blue-500 text-white hover:bg-blue-600'
};

const badgeSizes = {
  sm: 'text-xs px-1.5 py-0.5',
  default: 'text-xs px-2.5 py-0.5',
  lg: 'text-sm px-3 py-1'
};

export function Badge({
  className,
  variant = 'default',
  size = 'default',
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  if (dot) {
    return (
      <span
        className={cn(
          'inline-flex h-2 w-2 rounded-full',
          badgeVariants[variant].split(' ')[0], // Just the background color
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[variant],
        badgeSizes[size],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Export all components
export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  EnhancedTooltipContent as TooltipContent,
  PopoverRoot as PopoverBase,
  PopoverTrigger,
  PopoverAnchor,
  EnhancedPopoverContent as PopoverContent,
};