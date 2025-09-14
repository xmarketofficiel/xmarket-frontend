'use client';

import * as React from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid as GridIcon, List, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM, SPACING_SYSTEM } from '@/lib/design-system';
import { Button } from './button';

// Responsive Grid System
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  autoFit?: boolean;
  minWidth?: string;
  animated?: boolean;
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  default: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12'
};

export function Grid({
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'default',
  responsive = true,
  autoFit = false,
  minWidth = '250px',
  animated = false,
  children,
  ...props
}: GridProps) {
  const gridCols = responsive 
    ? [
        cols.default && `grid-cols-${cols.default}`,
        cols.sm && `sm:grid-cols-${cols.sm}`,
        cols.md && `md:grid-cols-${cols.md}`,
        cols.lg && `lg:grid-cols-${cols.lg}`,
        cols.xl && `xl:grid-cols-${cols.xl}`,
        cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`
      ].filter(Boolean).join(' ')
    : `grid-cols-${cols.default || 1}`;

  if (autoFit) {
    return (
      <div
        className={cn(
          'grid',
          gapClasses[gap],
          className
        )}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`
        }}
        {...props}
      >
        {animated ? (
          <AnimatePresence>
            {React.Children.map(children, (child, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: ANIMATION_SYSTEM.duration.normal / 1000,
                  delay: index * 0.1,
                  ease: ANIMATION_SYSTEM.framerEasing.easeOut
                }}
              >
                {child}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid',
        gridCols,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {animated ? (
        <AnimatePresence>
          {React.Children.map(children, (child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: ANIMATION_SYSTEM.duration.normal / 1000,
                delay: index * 0.1,
                ease: ANIMATION_SYSTEM.framerEasing.easeOut
              }}
            >
              {child}
            </motion.div>
          ))}
        </AnimatePresence>
      ) : children}
    </div>
  );
}

// Masonry Layout Component
interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function Masonry({
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'default',
  animated = true,
  children,
  ...props
}: MasonryProps) {
  const [columns, setColumns] = React.useState<React.ReactNode[][]>([]);
  const [currentCols, setCurrentCols] = React.useState(cols.default || 1);

  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      let numCols = cols.default || 1;
      
      if (width >= 1280 && cols.xl) numCols = cols.xl;
      else if (width >= 1024 && cols.lg) numCols = cols.lg;
      else if (width >= 768 && cols.md) numCols = cols.md;
      else if (width >= 640 && cols.sm) numCols = cols.sm;

      setCurrentCols(numCols);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [cols]);

  React.useEffect(() => {
    const childArray = React.Children.toArray(children);
    const newColumns: React.ReactNode[][] = Array.from({ length: currentCols }, () => []);

    childArray.forEach((child, index) => {
      const columnIndex = index % currentCols;
      newColumns[columnIndex].push(child);
    });

    setColumns(newColumns);
  }, [children, currentCols]);

  return (
    <div
      className={cn(
        'flex',
        gap === 'none' ? 'space-x-0' : 
        gap === 'sm' ? 'space-x-2' :
        gap === 'default' ? 'space-x-4' :
        gap === 'md' ? 'space-x-6' :
        gap === 'lg' ? 'space-x-8' : 'space-x-12',
        className
      )}
      {...props}
    >
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={cn(
            'flex-1 flex flex-col',
            gap === 'none' ? 'space-y-0' : 
            gap === 'sm' ? 'space-y-2' :
            gap === 'default' ? 'space-y-4' :
            gap === 'md' ? 'space-y-6' :
            gap === 'lg' ? 'space-y-8' : 'space-y-12'
          )}
        >
          {animated ? (
            <AnimatePresence>
              {column.map((child, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: ANIMATION_SYSTEM.duration.normal / 1000,
                    delay: index * 0.1,
                    ease: ANIMATION_SYSTEM.framerEasing.easeOut
                  }}
                >
                  {child}
                </motion.div>
              ))}
            </AnimatePresence>
          ) : column}
        </div>
      ))}
    </div>
  );
}

// Container Component
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

const containerSizes = {
  sm: 'max-w-sm',
  default: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
};

const containerPadding = {
  none: 'px-0',
  sm: 'px-2 sm:px-4',
  default: 'px-4 sm:px-6 lg:px-8',
  md: 'px-6 sm:px-8 lg:px-12',
  lg: 'px-8 sm:px-12 lg:px-16',
  xl: 'px-12 sm:px-16 lg:px-24'
};

export function Container({
  className,
  size = 'default',
  padding = 'default',
  centered = true,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        containerSizes[size],
        containerPadding[padding],
        centered && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Flex Layout Component
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: boolean;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: Partial<FlexProps>;
    md?: Partial<FlexProps>;
    lg?: Partial<FlexProps>;
    xl?: Partial<FlexProps>;
  };
}

const flexDirection = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse'
};

const flexJustify = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly'
};

const flexAlign = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch'
};

export function Flex({
  className,
  direction = 'row',
  wrap = false,
  justify = 'start',
  align = 'start',
  gap = 'default',
  responsive,
  children,
  ...props
}: FlexProps) {
  const responsiveClasses = responsive ? Object.entries(responsive).map(([breakpoint, config]) => {
    const prefix = breakpoint === 'sm' ? 'sm:' : breakpoint === 'md' ? 'md:' : 
                   breakpoint === 'lg' ? 'lg:' : 'xl:';
    
    return [
      config.direction && `${prefix}${flexDirection[config.direction]}`,
      config.justify && `${prefix}${flexJustify[config.justify]}`,
      config.align && `${prefix}${flexAlign[config.align]}`,
    ].filter(Boolean);
  }).flat() : [];

  return (
    <div
      className={cn(
        'flex',
        flexDirection[direction],
        flexJustify[justify],
        flexAlign[align],
        wrap && 'flex-wrap',
        gapClasses[gap],
        ...responsiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Stack Component (Vertical spacing)
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'none' | 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  divider?: React.ReactNode;
  animated?: boolean;
}

const stackSpacing = {
  none: 'space-y-0',
  xs: 'space-y-1',
  sm: 'space-y-2',
  default: 'space-y-4',
  md: 'space-y-6',
  lg: 'space-y-8',
  xl: 'space-y-12',
  '2xl': 'space-y-16'
};

const stackAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch'
};

export function Stack({
  className,
  spacing = 'default',
  align = 'stretch',
  divider,
  animated = false,
  children,
  ...props
}: StackProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div
      className={cn(
        'flex flex-col',
        !divider && stackSpacing[spacing],
        stackAlign[align],
        className
      )}
      {...props}
    >
      {divider ? (
        childArray.map((child, index) => (
          <React.Fragment key={index}>
            {animated ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_SYSTEM.duration.normal / 1000,
                  delay: index * 0.1,
                  ease: ANIMATION_SYSTEM.framerEasing.easeOut
                }}
              >
                {child}
              </motion.div>
            ) : (
              child
            )}
            {index < childArray.length - 1 && (
              <div className={cn('my-2', stackAlign[align])}>{divider}</div>
            )}
          </React.Fragment>
        ))
      ) : animated ? (
        <AnimatePresence>
          {childArray.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: ANIMATION_SYSTEM.duration.normal / 1000,
                delay: index * 0.1,
                ease: ANIMATION_SYSTEM.framerEasing.easeOut
              }}
            >
              {child}
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        children
      )}
    </div>
  );
}

// Section Component
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article' | 'aside';
  padding?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'muted' | 'accent' | 'card';
  border?: 'none' | 'top' | 'bottom' | 'both';
  fullWidth?: boolean;
}

const sectionPadding = {
  none: 'py-0',
  sm: 'py-4',
  default: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24'
};

const sectionBackground = {
  none: '',
  muted: 'bg-muted/50',
  accent: 'bg-accent/50',
  card: 'bg-card'
};

const sectionBorder = {
  none: '',
  top: 'border-t',
  bottom: 'border-b',
  both: 'border-t border-b'
};

export function Section({
  className,
  as: Component = 'section',
  padding = 'default',
  background = 'none',
  border = 'none',
  fullWidth = false,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        'w-full',
        sectionPadding[padding],
        sectionBackground[background],
        sectionBorder[border],
        !fullWidth && 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Divider Component
interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: 'thin' | 'default' | 'thick';
  spacing?: 'none' | 'sm' | 'default' | 'md' | 'lg';
  label?: string;
}

const dividerThickness = {
  thin: 'border-t',
  default: 'border-t-2',
  thick: 'border-t-4'
};

const dividerSpacing = {
  none: 'my-0',
  sm: 'my-2',
  default: 'my-4',
  md: 'my-6',
  lg: 'my-8'
};

export function Divider({
  className,
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'default',
  spacing = 'default',
  label,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'border-l border-border',
          variant === 'dashed' && 'border-dashed',
          variant === 'dotted' && 'border-dotted',
          thickness === 'thin' ? 'border-l' : thickness === 'thick' ? 'border-l-4' : 'border-l-2',
          'mx-2',
          className
        )}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div className={cn('relative', dividerSpacing[spacing], className)} {...props}>
        <div className="absolute inset-0 flex items-center">
          <span
            className={cn(
              'w-full border-t border-border',
              variant === 'dashed' && 'border-dashed',
              variant === 'dotted' && 'border-dotted',
              thickness === 'thick' && 'border-t-4'
            )}
          />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <hr
      className={cn(
        'border-border',
        variant === 'dashed' && 'border-dashed',
        variant === 'dotted' && 'border-dotted',
        dividerThickness[thickness],
        dividerSpacing[spacing],
        className
      )}
      {...props}
    />
  );
}

// Responsive Show/Hide Component
interface ResponsiveProps {
  children: React.ReactNode;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  direction?: 'up' | 'down';
  className?: string;
}

export function ResponsiveShow({
  children,
  breakpoint = 'md',
  direction = 'up',
  className
}: ResponsiveProps) {
  const showClasses = {
    sm: direction === 'up' ? 'hidden sm:block' : 'block sm:hidden',
    md: direction === 'up' ? 'hidden md:block' : 'block md:hidden',
    lg: direction === 'up' ? 'hidden lg:block' : 'block lg:hidden',
    xl: direction === 'up' ? 'hidden xl:block' : 'block xl:hidden',
    '2xl': direction === 'up' ? 'hidden 2xl:block' : 'block 2xl:hidden'
  };

  return (
    <div className={cn(showClasses[breakpoint], className)}>
      {children}
    </div>
  );
}

// Aspect Ratio Container
interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: 'square' | 'video' | 'wide' | 'ultrawide' | number;
  className?: string;
}

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[4/3]',
  ultrawide: 'aspect-[21/9]'
};

export function AspectRatio({
  children,
  ratio = 'video',
  className,
  ...props
}: AspectRatioProps) {
  const aspectClass = typeof ratio === 'number' 
    ? `aspect-[${ratio}]` 
    : aspectRatios[ratio];

  return (
    <div className={cn('relative overflow-hidden', aspectClass, className)} {...props}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}