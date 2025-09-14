# XMarket Style Configuration System

## Overview

The XMarket Style Configuration System is a comprehensive design system that provides consistent styling, theming, and component configurations across the entire application. This system promotes maintainability, consistency, and scalability in the frontend codebase.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Core Concepts](#core-concepts)
3. [Design Tokens](#design-tokens)
4. [Component Styles](#component-styles)
5. [Layout Configuration](#layout-configuration)
6. [Typography System](#typography-system)
7. [Animation Framework](#animation-framework)
8. [Usage Examples](#usage-examples)
9. [Best Practices](#best-practices)
10. [Extending the System](#extending-the-system)
11. [Migration Guide](#migration-guide)

## Installation & Setup

### Basic Import

```typescript
import { styleConfig } from '@/lib/styleConfig';
import { designTokens, componentStyles, layoutConfig } from '@/lib/styleConfig';
```

### Component Usage

```typescript
// Import specific configuration objects
import { componentStyles } from '@/lib/styleConfig';

// Use in your component
const buttonClasses = `
  ${componentStyles.button.base.padding}
  ${componentStyles.button.base.borderRadius}
  ${componentStyles.button.variants.primary.background}
  ${componentStyles.button.variants.primary.text}
`;
```

## Core Concepts

### 1. Design Tokens
Design tokens are the foundational elements of the design system - colors, spacing, typography scales, shadows, and other visual properties.

### 2. Component Styles
Predefined style configurations for common UI components with variants, sizes, and states.

### 3. Layout Configuration
Responsive grid systems, container sizes, and spacing configurations.

### 4. Typography System
Consistent text styling with semantic hierarchy and responsive behavior.

### 5. Animation Framework
Smooth transitions and micro-interactions with performance-optimized animations.

## Design Tokens

### Color System

The color system follows a semantic approach with primary brand colors, semantic colors, and neutral grays.

```typescript
import { designTokens } from '@/lib/styleConfig';

// Primary brand colors
const primary = designTokens.colors.primary.main; // #009F9C
const primaryLight = designTokens.colors.primary.light; // #1AB5B2
const primaryDark = designTokens.colors.primary.dark; // #007A77

// Semantic colors
const success = designTokens.colors.success; // #10B981
const warning = designTokens.colors.warning; // #F59E0B
const error = designTokens.colors.error; // #EF4444

// Usage in Tailwind classes
<div className="bg-[#009F9C] text-white">
  Primary button
</div>
```

### Spacing Scale

The spacing scale matches Tailwind's default spacing system for consistency.

```typescript
const spacing = designTokens.spacing;
// xs: '0.25rem' (1 in Tailwind)
// sm: '0.5rem'  (2 in Tailwind)
// md: '0.75rem' (3 in Tailwind)
// lg: '1rem'    (4 in Tailwind)
// xl: '1.25rem' (5 in Tailwind)
```

### Border Radius

```typescript
const borderRadius = designTokens.borderRadius;
// sm: '0.25rem'  (rounded-sm)
// md: '0.375rem' (rounded-md)
// lg: '0.5rem'   (rounded-lg)
// xl: '0.75rem'  (rounded-xl)
// 2xl: '1rem'    (rounded-2xl)
```

## Component Styles

### Button Component

The button component comes with multiple variants and sizes:

```typescript
import { componentStyles, styleConfig } from '@/lib/styleConfig';

// Primary button
const primaryButton = styleConfig.utils.combine(
  componentStyles.button.base.padding,
  componentStyles.button.base.borderRadius,
  componentStyles.button.base.fontSize,
  componentStyles.button.base.fontWeight,
  componentStyles.button.base.transition,
  componentStyles.button.variants.primary.background,
  componentStyles.button.variants.primary.text,
  componentStyles.button.variants.primary.border,
  componentStyles.button.variants.primary.hover
);

// Secondary button
const secondaryButton = styleConfig.utils.combine(
  componentStyles.button.base.padding,
  componentStyles.button.base.borderRadius,
  componentStyles.button.variants.secondary.background,
  componentStyles.button.variants.secondary.text,
  componentStyles.button.variants.secondary.border,
  componentStyles.button.variants.secondary.hover
);

// Small button
const smallButton = styleConfig.utils.combine(
  componentStyles.button.sizes.small.padding,
  componentStyles.button.sizes.small.fontSize,
  componentStyles.button.sizes.small.borderRadius,
  componentStyles.button.variants.primary.background,
  componentStyles.button.variants.primary.text
);
```

### Card Component

```typescript
// Interactive card
const interactiveCard = styleConfig.utils.combine(
  componentStyles.card.base.background,
  componentStyles.card.base.border,
  componentStyles.card.base.borderRadius,
  componentStyles.card.base.shadow,
  componentStyles.card.base.padding,
  componentStyles.card.base.transition,
  componentStyles.card.variants.interactive.hover,
  componentStyles.card.variants.interactive.cursor
);

// Selected state card
const selectedCard = styleConfig.utils.combine(
  componentStyles.card.base.background,
  componentStyles.card.base.borderRadius,
  componentStyles.card.base.padding,
  componentStyles.card.variants.selected.border,
  componentStyles.card.variants.selected.shadow,
  componentStyles.card.variants.selected.background
);
```

### Input Component

```typescript
// Standard input
const inputClasses = styleConfig.utils.combine(
  componentStyles.input.base.width,
  componentStyles.input.base.padding,
  componentStyles.input.base.border,
  componentStyles.input.base.borderRadius,
  componentStyles.input.base.fontSize,
  componentStyles.input.base.background,
  componentStyles.input.base.transition,
  componentStyles.input.base.placeholder,
  componentStyles.input.states.focus
);

// Error state input
const errorInputClasses = styleConfig.utils.combine(
  componentStyles.input.base.width,
  componentStyles.input.base.padding,
  componentStyles.input.base.borderRadius,
  componentStyles.input.base.fontSize,
  componentStyles.input.states.error
);
```

## Layout Configuration

### Responsive Grids

```typescript
import { layoutConfig } from '@/lib/styleConfig';

// Responsive item grid (like ItemCard layout)
const itemGridClasses = styleConfig.utils.combine(
  layoutConfig.grid.itemCard.mobile,
  layoutConfig.grid.itemCard.tablet,
  layoutConfig.grid.itemCard.desktop
);
// Results in: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Responsive layout (like FavoritesList)
const responsiveLayoutClasses = styleConfig.utils.combine(
  layoutConfig.grid.responsive.mobile,
  layoutConfig.grid.responsive.tablet,
  layoutConfig.grid.responsive.desktop
);
// Results in: "space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3 xl:grid-cols-4"
```

### Container Sizes

```typescript
// Page container
const containerClasses = styleConfig.utils.combine(
  layoutConfig.container.xl,
  layoutConfig.spacing.page.padding,
  layoutConfig.spacing.page.margin
);
// Results in: "max-w-screen-xl px-4 py-6 mx-auto"
```

## Typography System

### Headings

```typescript
import { typography } from '@/lib/styleConfig';

// Page title
const pageTitleClasses = styleConfig.utils.combine(
  typography.headings.h1.fontSize,
  typography.headings.h1.fontWeight,
  typography.headings.h1.lineHeight,
  typography.headings.h1.color,
  typography.headings.h1.margin
);

// Section title
const sectionTitleClasses = styleConfig.utils.combine(
  typography.headings.h2.fontSize,
  typography.headings.h2.fontWeight,
  typography.headings.h2.color
);
```

### Body Text

```typescript
// Standard body text
const bodyTextClasses = styleConfig.utils.combine(
  typography.body.text.fontSize,
  typography.body.text.lineHeight,
  typography.body.text.color
);

// Small text (captions, labels)
const smallTextClasses = styleConfig.utils.combine(
  typography.body.textSmall.fontSize,
  typography.body.textSmall.lineHeight,
  typography.body.textSmall.color
);
```

## Animation Framework

### Transitions

```typescript
import { animations } from '@/lib/styleConfig';

// Fast transition
const quickHover = styleConfig.utils.combine(
  animations.transitions.fast,
  animations.hover.scale
);

// Normal transition with shadow
const cardHover = styleConfig.utils.combine(
  animations.transitions.normal,
  animations.hover.shadow,
  animations.hover.scaleSmall
);
```

### Loading States

```typescript
// Loading skeleton
const loadingClasses = styleConfig.utils.combine(
  'bg-gray-200',
  'rounded-lg',
  animations.loading.pulse
);
```

## Usage Examples

### Complete Component Example

```typescript
import React from 'react';
import { componentStyles, styleConfig } from '@/lib/styleConfig';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick 
}) => {
  const buttonClasses = styleConfig.utils.combine(
    // Base styles
    componentStyles.button.base.borderRadius,
    componentStyles.button.base.fontSize,
    componentStyles.button.base.fontWeight,
    componentStyles.button.base.transition,
    componentStyles.button.base.cursor,
    componentStyles.button.base.border,
    
    // Size styles
    componentStyles.button.sizes[size].padding,
    componentStyles.button.sizes[size].fontSize,
    componentStyles.button.sizes[size].borderRadius,
    
    // Variant styles
    componentStyles.button.variants[variant].background,
    componentStyles.button.variants[variant].text,
    componentStyles.button.variants[variant].border,
    componentStyles.button.variants[variant].hover,
    componentStyles.button.variants[variant].shadow
  );

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};
```

### Category Filter Example

```typescript
import { componentStyles } from '@/lib/styleConfig';

const CategoryButton: React.FC<{ category: string; isSelected: boolean; onClick: () => void }> = ({ 
  category, 
  isSelected, 
  onClick 
}) => {
  const buttonClasses = styleConfig.utils.combine(
    // Base category button styles
    componentStyles.categoryFilter.button.base.display,
    componentStyles.categoryFilter.button.base.padding,
    componentStyles.categoryFilter.button.base.borderRadius,
    componentStyles.categoryFilter.button.base.border,
    componentStyles.categoryFilter.button.base.fontSize,
    componentStyles.categoryFilter.button.base.fontWeight,
    componentStyles.categoryFilter.button.base.transition,
    componentStyles.categoryFilter.button.base.whitespace,
    
    // State-based styles
    isSelected 
      ? componentStyles.categoryFilter.button.states.selected
      : componentStyles.categoryFilter.button.states.default
  );

  return (
    <button className={buttonClasses} onClick={onClick}>
      {category}
    </button>
  );
};
```

## Best Practices

### 1. Use Semantic Classes
Always prefer semantic class names over direct styling:

```typescript
// ✅ Good
const primaryButton = componentStyles.button.variants.primary;

// ❌ Avoid
const blueButton = 'bg-blue-500 text-white';
```

### 2. Combine Utilities
Use the `utils.combine` function for cleaner code:

```typescript
// ✅ Good
const cardClasses = styleConfig.utils.combine(
  componentStyles.card.base.background,
  componentStyles.card.base.border,
  componentStyles.card.variants.interactive.hover
);

// ❌ Avoid
const cardClasses = `${componentStyles.card.base.background} ${componentStyles.card.base.border} ${componentStyles.card.variants.interactive.hover}`;
```

### 3. Responsive Design
Use the responsive utility for mobile-first design:

```typescript
// ✅ Good
const responsiveText = styleConfig.utils.responsive(
  'text-sm',
  'text-base',
  'text-lg'
);

// ❌ Avoid
const responsiveText = 'text-sm md:text-base lg:text-lg';
```

### 4. State Management
Use the `withStates` utility for interactive elements:

```typescript
// ✅ Good
const interactiveElement = styleConfig.utils.withStates(
  'bg-white border border-gray-200',
  {
    hover: 'hover:border-teal-500',
    focus: 'focus:ring-2 focus:ring-teal-500/20',
    active: 'active:scale-95'
  }
);
```

## Extending the System

### Adding New Component Styles

1. Add your component configuration to `componentStyles`:

```typescript
// In styleConfig.ts
export const componentStyles = {
  // ... existing components
  
  modal: {
    base: {
      position: 'fixed inset-0',
      background: 'bg-black/50',
      display: 'flex items-center justify-center',
      zIndex: 'z-50',
    },
    
    content: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      padding: 'p-6',
      shadow: 'shadow-2xl',
      maxWidth: 'max-w-md',
      width: 'w-full',
      margin: 'mx-4',
    },
    
    variants: {
      small: { maxWidth: 'max-w-sm' },
      medium: { maxWidth: 'max-w-md' },
      large: { maxWidth: 'max-w-lg' },
    },
  },
};
```

2. Use the new configuration:

```typescript
import { componentStyles, styleConfig } from '@/lib/styleConfig';

const Modal: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const overlayClasses = styleConfig.utils.combine(
    componentStyles.modal.base.position,
    componentStyles.modal.base.background,
    componentStyles.modal.base.display,
    componentStyles.modal.base.zIndex
  );
  
  const contentClasses = styleConfig.utils.combine(
    componentStyles.modal.content.background,
    componentStyles.modal.content.borderRadius,
    componentStyles.modal.content.padding,
    componentStyles.modal.content.shadow,
    componentStyles.modal.content.width,
    componentStyles.modal.content.margin,
    componentStyles.modal.variants[size].maxWidth
  );
  
  return (
    <div className={overlayClasses}>
      <div className={contentClasses}>
        {/* Modal content */}
      </div>
    </div>
  );
};
```

### Adding New Design Tokens

```typescript
// Extend colors
export const designTokens = {
  colors: {
    // ... existing colors
    
    tertiary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    
    brand: {
      purple: '#8B5CF6',
      orange: '#F97316',
      pink: '#EC4899',
    },
  },
  
  // Add new spacing values
  spacing: {
    // ... existing spacing
    '7xl': '5rem',   // 20
    '8xl': '6rem',   // 24
  },
};
```

## Migration Guide

### Migrating Existing Components

1. **Identify current styles**: Look for hardcoded Tailwind classes
2. **Map to design tokens**: Find equivalent values in the style config
3. **Update component**: Replace hardcoded classes with config values
4. **Test responsiveness**: Ensure mobile-first design is maintained

### Example Migration

Before:
```typescript
const Button = ({ children }: { children: React.ReactNode }) => (
  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
    {children}
  </button>
);
```

After:
```typescript
import { componentStyles, styleConfig } from '@/lib/styleConfig';

const Button = ({ children }: { children: React.ReactNode }) => {
  const buttonClasses = styleConfig.utils.combine(
    componentStyles.button.base.padding,
    componentStyles.button.base.borderRadius,
    componentStyles.button.base.transition,
    componentStyles.button.variants.primary.background,
    componentStyles.button.variants.primary.text,
    componentStyles.button.variants.primary.hover
  );
  
  return (
    <button className={buttonClasses}>
      {children}
    </button>
  );
};
```

## Troubleshooting

### Common Issues

1. **Classes not applying**: Ensure Tailwind is configured to include the style config file
2. **Responsive breakpoints**: Verify mobile-first approach is being used
3. **Color consistency**: Use design tokens instead of hardcoded colors
4. **Performance**: Use the `combine` utility to avoid string concatenation issues

### Performance Optimization

1. **Tree shaking**: Import only the parts of the config you need
2. **Memoization**: Cache computed class strings in components
3. **Bundle analysis**: Ensure the style config doesn't bloat your bundle

```typescript
// ✅ Good - Import only what you need
import { componentStyles } from '@/lib/styleConfig';
const { button } = componentStyles;

// ❌ Avoid - Importing entire config when not needed
import styleConfig from '@/lib/styleConfig';
```

## Contributing

When contributing to the style system:

1. Follow the existing naming conventions
2. Add comprehensive examples for new components
3. Update this documentation
4. Test across different screen sizes
5. Ensure backward compatibility

---

For questions or suggestions about the style configuration system, please refer to the project's contribution guidelines or reach out to the development team.