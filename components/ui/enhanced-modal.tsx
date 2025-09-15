'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM, COLOR_SYSTEM, SPACING_SYSTEM } from '@/lib/design-system';
import { Button } from './button';

// Animation variants for different modal entry styles
const modalVariants: Record<string, Variants> = {
  scale: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 20,
      transition: {
        duration: ANIMATION_SYSTEM.duration.fast / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeIn
      }
    }
  },
  slideUp: {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut
      }
    },
    exit: { 
      opacity: 0, 
      y: 100,
      scale: 0.95,
      transition: {
        duration: ANIMATION_SYSTEM.duration.fast / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeIn
      }
    }
  },
  slideDown: {
    hidden: { 
      opacity: 0, 
      y: -100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut
      }
    },
    exit: { 
      opacity: 0, 
      y: -100,
      scale: 0.95,
      transition: {
        duration: ANIMATION_SYSTEM.duration.fast / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeIn
      }
    }
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: ANIMATION_SYSTEM.duration.fast / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeIn
      }
    }
  }
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: ANIMATION_SYSTEM.duration.normal / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeOut
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: ANIMATION_SYSTEM.duration.fast / 1000,
      ease: ANIMATION_SYSTEM.framerEasing.easeIn
    }
  }
};

// Enhanced Dialog Root
const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

// Enhanced Dialog Overlay
interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  blur?: boolean;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, blur = true, ...props }, ref) => (
  <AnimatePresence>
    <DialogPrimitive.Overlay
      ref={ref}
      asChild
      {...props}
    >
      <motion.div
        className={cn(
          'fixed inset-0 z-50 bg-black/50',
          blur && 'backdrop-blur-sm',
          className
        )}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      />
    </DialogPrimitive.Overlay>
  </AnimatePresence>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Enhanced Dialog Content
interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  variant?: 'scale' | 'slideUp' | 'slideDown' | 'fade';
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ 
  className, 
  children, 
  variant = 'scale',
  size = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
        asChild
        {...props}
      >
        <motion.div
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%]',
            'gap-4 border bg-background p-6 shadow-lg duration-200',
            'rounded-lg md:w-full',
            sizeClasses[size],
            className
          )}
          variants={modalVariants[variant]}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-4 top-4 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Dialog Header
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

// Dialog Footer
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

// Dialog Title
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Dialog Description
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Confirmation Dialog Component
interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  loading = false,
  icon
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const getIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'destructive':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getConfirmVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive' as const;
      case 'warning':
        return 'warning' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="scale" size="sm">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmVariant()}
            onClick={handleConfirm}
            loading={isLoading || loading}
            loadingText="Processing..."
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Alert Dialog Component
interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  actionText?: string;
  onAction?: () => void;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  type = 'info',
  actionText = 'OK',
  onAction
}: AlertDialogProps) {
  const handleAction = () => {
    onAction?.();
    onOpenChange(false);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="scale" size="sm">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
          </div>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <DialogFooter>
          <Button onClick={handleAction} className="w-full sm:w-auto">
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Full Screen Modal Component
interface FullScreenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export function FullScreenModal({
  open,
  onOpenChange,
  title,
  children,
  showCloseButton = true
}: FullScreenModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        variant="fade" 
        size="full" 
        className="w-screen h-screen max-w-none max-h-none rounded-none border-0 p-0"
        showCloseButton={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white/95 backdrop-blur-sm">
            {title && (
              <h2 className="text-xl font-semibold">{title}</h2>
            )}
            {showCloseButton && (
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};