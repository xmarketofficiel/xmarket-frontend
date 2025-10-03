'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle';

const ToggleGroupContext: any = React.createContext();

const ToggleGroup = React.forwardRef<any, any>(({ className, variant, size, children, ...props }, ref) => {
  const p = props as any;
  p.className = cn('flex items-center justify-center gap-1', className, p.className);
  return (
    <ToggleGroupPrimitive.Root ref={ref as React.LegacyRef<HTMLDivElement>} {...p}>
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<any, any>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext) as any || { size: 'default', variant: 'default' };
  const p = props as any;
  p.className = cn(
    toggleVariants({
      variant: (context && context.variant) || variant,
      size: (context && context.size) || size,
    }),
    className,
    p.className
  );
  p.children = children;
  return <ToggleGroupPrimitive.Item ref={ref as React.LegacyRef<HTMLButtonElement>} {...p} />;
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
