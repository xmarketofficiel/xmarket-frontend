'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  const p = props as any;
  p.className = cn(labelVariants(), className, p.className);
  return (
    <LabelPrimitive.Root ref={ref as React.LegacyRef<HTMLLabelElement>} {...p} />
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
