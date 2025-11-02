'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<any, any>(({ className, value, ...props }, ref) => {
  const p = props as any;
  p.className = cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className, p.className);
  const p2: any = {
    className: 'h-full w-full flex-1 bg-primary transition-all',
    style: { transform: `translateX(-${100 - (value || 0)}%)` }
  };
  return (
    <ProgressPrimitive.Root ref={ref as React.LegacyRef<HTMLDivElement>} {...p}>
      <ProgressPrimitive.Indicator {...p2} />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
