'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

const Separator = React.forwardRef<any, any>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    const p = props as any;
    p.decorative = decorative;
    p.orientation = orientation;
    p.className = cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
      p.className
    );
    return <SeparatorPrimitive.Root ref={ref as React.LegacyRef<HTMLDivElement>} {...p} />;
  }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
