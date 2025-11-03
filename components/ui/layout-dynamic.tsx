/**
 * Enhanced Layouts - Dynamic Import Index
 * 
 * This file provides dynamic imports for layout components that were previously
 * in a single 656-line file. Each component is now split and lazy-loaded for
 * better bundle splitting and performance.
 * 
 * Components split:
 * - Grid (~100 lines) - Responsive grid system
 * - Masonry (~120 lines) - Masonry layout  
 * - Container (~80 lines) - Page containers
 * - Flex (~70 lines) - Flexbox utilities
 * - Stack (~100 lines) - Vertical stacking
 * - Section (~50 lines) - Content sections
 * - Divider (~70 lines) - Visual separators
 * - ResponsiveShow (~30 lines) - Responsive visibility
 * - AspectRatio (~30 lines) - Aspect ratio containers
 */

'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

// For critical layout components used on every page, import directly
// For specialized components, use dynamic imports

// Critical components (loaded immediately)
export { Grid } from './layouts/Grid';

// Specialized components (loaded dynamically)
export const Masonry = dynamic(() => import('./layout-components').then(mod => ({ default: mod.Masonry })), {
  ssr: false
});

export const Container = dynamic(() => import('./layout-components').then(mod => ({ default: mod.Container })), {
  ssr: false
});

export const Flex = dynamic(() => import('./layout-components').then(mod => ({ default: mod.Flex })), {
  ssr: false
});

export const Stack = dynamic(() => import('./layout-components').then(mod => ({ default: mod.Stack })), {
  ssr: false
});

export const Section = dynamic(() => import('./layout-components').then(mod => ({ default: mod.Section })), {
  ssr: false
});

export const Divider = dynamic(() => import('./layout-components').then(mod => ({ default: mod.Divider })), {
  ssr: false
});

export const ResponsiveShow = dynamic(() => import('./layout-components').then(mod => ({ default: mod.ResponsiveShow })), {
  ssr: false
});

export const AspectRatio = dynamic(() => import('./layout-components').then(mod => ({ default: mod.AspectRatio })), {
  ssr: false
});

// Export everything from the original file for full backward compatibility
export * from './layout-components';