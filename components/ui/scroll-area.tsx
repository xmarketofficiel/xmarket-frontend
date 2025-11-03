'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef<any, any>(({ className, children, ...props }, ref) => {
  const p = props as any;
  p.className = cn('relative overflow-hidden', className, p.className);
  const p2: any = { className: 'h-full w-full rounded-[inherit]', children };
  return (
    <ScrollAreaPrimitive.Root ref={ref as React.LegacyRef<HTMLDivElement>} {...p}>
      <ScrollAreaPrimitive.Viewport {...p2} />
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<any, any>(({ className, orientation = 'vertical', ...props }, ref) => {
  const p = props as any;
  p.className = cn(
    'flex touch-none select-none transition-colors',
    orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
    orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
    className,
    p.className
  );
  p.orientation = orientation;
  const p3: any = { className: 'relative flex-1 rounded-full bg-border' };
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar ref={ref as React.LegacyRef<HTMLDivElement>} {...p}>
      <ScrollAreaPrimitive.ScrollAreaThumb {...p3} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
