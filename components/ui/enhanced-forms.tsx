'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM, COLOR_SYSTEM, SPACING_SYSTEM } from '@/lib/design-system';
import { Button } from './button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

// Temporary any-typed wrappers to avoid Radix/Tooltip typing mismatches during build
const AnyTooltipTrigger = TooltipTrigger as unknown as React.ComponentType<any>;
const AnyTooltipContent = TooltipContent as unknown as React.ComponentType<any>;

// Enhanced Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  tooltip?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  inputSize?: 'sm' | 'default' | 'lg';
  showPasswordToggle?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const inputVariants = {
  default: 'border border-input bg-background',
  filled: 'border-0 bg-gray-100 hover:bg-gray-50 focus:bg-white',
  outlined: 'border-2 border-gray-300 bg-transparent',
  minimal: 'border-0 border-b-2 border-gray-300 bg-transparent rounded-none'
};

const inputSizes = {
  sm: 'h-9 px-3 text-sm',
  default: 'h-10 px-3',
  lg: 'h-12 px-4 text-lg'
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    success,
    hint,
    tooltip,
    leftIcon,
    rightIcon,
    variant = 'default',
    inputSize = 'default',
    showPasswordToggle = false,
    loading = false,
    fullWidth = true,
    disabled,
    id,
    ...props
  }: any, ref: any) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isPassword = type === 'password' || showPasswordToggle;
    const actualType = isPassword && showPassword ? 'text' : type;

    const hasError = !!error;
    const hasSuccess = !!success;
    const hasIcon = leftIcon || rightIcon || isPassword || loading;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label with tooltip */}
        {label && (
          <div className="flex items-center space-x-2">
            <label
              htmlFor={inputId}
              className={cn(
                'text-sm font-medium leading-none',
                hasError ? 'text-red-600' : hasSuccess ? 'text-green-600' : 'text-gray-700',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              )}
            >
              {label}
            </label>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <AnyTooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </AnyTooltipTrigger>
                  <AnyTooltipContent>
                    <p>{tooltip}</p>
                  </AnyTooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}

        {/* Input container */}
        <motion.div
          className={cn(
            'relative',
            fullWidth && 'w-full'
          )}
          animate={{
            scale: isFocused ? 1.01 : 1,
            transition: {
              duration: ANIMATION_SYSTEM.duration.fast / 1000,
              ease: ANIMATION_SYSTEM.framerEasing.easeOut
            }
          }}
        >
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            type={actualType}
            id={inputId}
            className={cn(
              'flex w-full rounded-md text-sm ring-offset-background',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              inputVariants[variant as keyof typeof inputVariants],
              inputSizes[inputSize as keyof typeof inputSizes],
              hasError && 'border-red-500 focus-visible:ring-red-500',
              hasSuccess && 'border-green-500 focus-visible:ring-green-500',
              leftIcon && 'pl-10',
              hasIcon && !leftIcon && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled || loading}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
            
            {hasSuccess && !loading && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            
            {hasError && !loading && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            
            {isPassword && !loading && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword(!showPassword)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            )}
            
            {rightIcon && !isPassword && !hasError && !hasSuccess && !loading && (
              <div className="text-gray-400">{rightIcon}</div>
            )}
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: ANIMATION_SYSTEM.duration.fast / 1000,
                ease: ANIMATION_SYSTEM.framerEasing.easeOut
              }}
              className="flex items-start space-x-2"
            >
              {error && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </>
              )}
              {success && !error && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-600">{success}</p>
                </>
              )}
              {hint && !error && !success && (
                <>
                  <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500">{hint}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Input.displayName = 'Input';

// Enhanced Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  tooltip?: string;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  showCharCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    success,
    hint,
    tooltip,
    variant = 'default',
    resize = 'vertical',
    showCharCount = false,
    maxLength,
    autoResize = false,
    fullWidth = true,
    disabled,
    id,
    value,
    onChange,
    ...props
  }: any, ref: any) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [charCount, setCharCount] = React.useState(0);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    React.useImperativeHandle(ref, () => textareaRef.current!);

    React.useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value]);

    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const hasError = !!error;
    const hasSuccess = !!success;
    const isNearLimit = maxLength && charCount > maxLength * 0.8;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label with tooltip */}
        {label && (
          <div className="flex items-center space-x-2">
            <label
              htmlFor={inputId}
              className={cn(
                'text-sm font-medium leading-none',
                hasError ? 'text-red-600' : hasSuccess ? 'text-green-600' : 'text-gray-700',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              )}
            >
              {label}
            </label>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <AnyTooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </AnyTooltipTrigger>
                  <AnyTooltipContent>
                    <p>{tooltip}</p>
                  </AnyTooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}

        {/* Textarea container */}
        <motion.div
          className={cn('relative', fullWidth && 'w-full')}
          animate={{
            scale: isFocused ? 1.01 : 1,
            transition: {
              duration: ANIMATION_SYSTEM.duration.fast / 1000,
              ease: ANIMATION_SYSTEM.framerEasing.easeOut
            }
          }}
        >
          <textarea
            id={inputId}
            ref={textareaRef}
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'ring-offset-background placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              resize === 'none' && 'resize-none',
              resize === 'vertical' && 'resize-y',
              resize === 'horizontal' && 'resize-x',
              resize === 'both' && 'resize',
              variant === 'filled' && 'border-0 bg-gray-100 hover:bg-gray-50 focus:bg-white',
              variant === 'outlined' && 'border-2 border-gray-300',
              hasError && 'border-red-500 focus-visible:ring-red-500',
              hasSuccess && 'border-green-500 focus-visible:ring-green-500',
              autoResize && 'overflow-hidden',
              className
            )}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            maxLength={maxLength}
            {...props}
          />

          {/* Character count */}
          {showCharCount && (
            <div className="absolute bottom-2 right-2">
              <span
                className={cn(
                  'text-xs',
                  isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-gray-400'
                )}
              >
                {charCount}{maxLength && `/${maxLength}`}
              </span>
            </div>
          )}
        </motion.div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: ANIMATION_SYSTEM.duration.fast / 1000,
                ease: ANIMATION_SYSTEM.framerEasing.easeOut
              }}
              className="flex items-start space-x-2"
            >
              {error && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </>
              )}
              {success && !error && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-600">{success}</p>
                </>
              )}
              {hint && !error && !success && (
                <>
                  <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500">{hint}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// Form Field Wrapper
export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  tooltip?: string;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function FormField({
  children,
  label,
  error,
  success,
  hint,
  tooltip,
  required = false,
  fullWidth = true,
  className
}: FormFieldProps) {
  const hasError = !!error;
  const hasSuccess = !!success;

  return (
    <div className={cn('space-y-2', fullWidth && 'w-full', className)}>
      {label && (
        <div className="flex items-center space-x-2">
          <label
            className={cn(
              'text-sm font-medium leading-none',
              hasError ? 'text-red-600' : hasSuccess ? 'text-green-600' : 'text-gray-700'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <AnyTooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </AnyTooltipTrigger>
                <AnyTooltipContent>
                  <p>{tooltip}</p>
                </AnyTooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {children}

      <AnimatePresence mode="wait">
        {(error || success || hint) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: ANIMATION_SYSTEM.duration.fast / 1000,
              ease: ANIMATION_SYSTEM.framerEasing.easeOut
            }}
            className="flex items-start space-x-2"
          >
            {error && (
              <>
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </>
            )}
            {success && !error && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-600">{success}</p>
              </>
            )}
            {hint && !error && !success && (
              <>
                <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-500">{hint}</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}