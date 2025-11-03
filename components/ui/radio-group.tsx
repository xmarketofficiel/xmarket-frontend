'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  const p = props as any;
  p.className = cn('grid gap-2', className, p.className);
  return <RadioGroupPrimitive.Root ref={ref as React.LegacyRef<HTMLDivElement>} {...p} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  const p = props as any;
  p.className = cn(
    'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    className,
    p.className
  );
  const p2: any = { className: 'flex items-center justify-center', children: <Circle className="h-2.5 w-2.5 fill-current text-current" /> };
  return (
    <RadioGroupPrimitive.Item ref={ref as React.LegacyRef<HTMLButtonElement>} {...p}>
      <RadioGroupPrimitive.Indicator {...p2} />
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
