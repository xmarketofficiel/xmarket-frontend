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
export const Masonry = dynamic(() => import('./enhanced-layouts').then(mod => ({ default: mod.Masonry })), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-48" />
});

export const Container = dynamic(() => import('./enhanced-layouts').then(mod => ({ default: mod.Container })), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-24" />
});

export const Flex = dynamic(() => import('./enhanced-layouts').then(mod => ({ default: mod.Flex })), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-12" />
});

export const Stack = dynamic(() => import('./enhanced-layouts').then(mod => ({ default: mod.Stack })), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-32" />
});

export const Section = dynamic(() => import('./enhanced-layouts').then(mod => ({ default: mod.Section })), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-64" />
});

export const Divider = dynamic(() => import('./enhanced-layouts').then(mod => ({ default: mod.Divider })), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-1" />
});

export const ResponsiveShow = dynamic(() => import('./enhanced-layouts').then(mod => ({ default: mod.ResponsiveShow })), {
  loading: () => <span className="animate-pulse">Loading...</span>
});

export const AspectRatio = dynamic(() => import('./enhanced-layouts').then(mod => ({ default: mod.AspectRatio })), {
  loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded aspect-video" />
});

// Export everything from the original file for full backward compatibility
export * from './enhanced-layouts';