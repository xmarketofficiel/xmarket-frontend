'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

// @ts-ignore - Fix forwardRef type conflicts with Radix UI
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  // @ts-ignore - Fix ref type conflicts
  <AccordionPrimitive.Item
    // @ts-ignore - Fix ref type conflicts
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

// @ts-ignore - Fix forwardRef type conflicts with Radix UI
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  // @ts-ignore - Fix Header children type conflicts
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      // @ts-ignore - Fix ref type conflicts
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

// @ts-ignore - Fix forwardRef type conflicts with Radix UI
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    // @ts-ignore - Fix ref type conflicts
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
