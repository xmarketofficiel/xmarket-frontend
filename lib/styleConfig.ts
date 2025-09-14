/**
 * XMarket Style Configuration System
 * 
 * This file contains all the design tokens, color schemes, spacing values,
 * and component style configurations used throughout the application.
 * 
 * Usage:
 * - Import specific style objects from this file
 * - Use the styleConfig object for dynamic theme switching
 * - Extend configurations for new components
 */

// Base Design Tokens
export const designTokens = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      main: '#009F9C',
      light: '#1AB5B2',
      dark: '#007A77',
      50: '#E6F7F7',
      100: '#B3ECED',
      200: '#80E1E2',
      300: '#4DD6D7',
      400: '#1ACBCC',
      500: '#009F9C',
      600: '#007F7D',
      700: '#005F5D',
      800: '#003F3E',
      900: '#001F1F',
    },
    
    // Secondary Colors
    secondary: {
      main: '#6B7280',
      light: '#9CA3AF',
      dark: '#374151',
    },
    
    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutral Colors
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    
    // Background Colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    
    // Text Colors
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
    },
  },
  
  // Spacing Scale (matches Tailwind)
  spacing: {
    xs: '0.25rem',   // 1
    sm: '0.5rem',    // 2
    md: '0.75rem',   // 3
    lg: '1rem',      // 4
    xl: '1.25rem',   // 5
    '2xl': '1.5rem', // 6
    '3xl': '2rem',   // 8
    '4xl': '2.5rem', // 10
    '5xl': '3rem',   // 12
    '6xl': '4rem',   // 16
  },
  
  // Border Radius Scale
  borderRadius: {
    sm: '0.25rem',   // rounded-sm
    md: '0.375rem',  // rounded-md
    lg: '0.5rem',    // rounded-lg
    xl: '0.75rem',   // rounded-xl
    '2xl': '1rem',   // rounded-2xl
    '3xl': '1.5rem', // rounded-3xl
    full: '9999px',  // rounded-full
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

// Component Style Configurations
export const componentStyles = {
  // Button Styles
  button: {
    base: {
      padding: 'px-4 py-2',
      borderRadius: 'rounded-lg',
      fontSize: 'text-sm',
      fontWeight: 'font-medium',
      transition: 'transition-all duration-200',
      cursor: 'cursor-pointer',
      border: 'border-2',
    },
    
    variants: {
      primary: {
        background: 'bg-[#009F9C]',
        text: 'text-white',
        border: 'border-[#009F9C]',
        hover: 'hover:bg-[#007A77] hover:border-[#007A77]',
        shadow: 'shadow-lg',
      },
      
      secondary: {
        background: 'bg-white',
        text: 'text-gray-600',
        border: 'border-gray-200',
        hover: 'hover:border-[#009F9C] hover:text-[#009F9C]',
        shadow: 'shadow-sm',
      },
      
      outline: {
        background: 'bg-transparent',
        text: 'text-[#009F9C]',
        border: 'border-[#009F9C]',
        hover: 'hover:bg-[#009F9C] hover:text-white',
      },
    },
    
    sizes: {
      small: {
        padding: 'px-3 py-1.5',
        fontSize: 'text-sm',
        borderRadius: 'rounded-lg',
      },
      
      medium: {
        padding: 'px-4 py-2',
        fontSize: 'text-sm',
        borderRadius: 'rounded-lg',
      },
      
      large: {
        padding: 'px-6 py-3',
        fontSize: 'text-base',
        borderRadius: 'rounded-xl',
      },
    },
  },
  
  // Card Styles
  card: {
    base: {
      background: 'bg-white',
      border: 'border border-gray-200',
      borderRadius: 'rounded-xl',
      shadow: 'shadow-sm',
      padding: 'p-4',
      transition: 'transition-all duration-200',
    },
    
    variants: {
      default: {
        hover: 'hover:shadow-md hover:border-gray-300',
      },
      
      interactive: {
        hover: 'hover:shadow-lg hover:border-[#009F9C] hover:scale-[1.02]',
        cursor: 'cursor-pointer',
      },
      
      selected: {
        border: 'border-[#009F9C]',
        shadow: 'shadow-lg',
        background: 'bg-teal-50',
      },
    },
  },
  
  // Input Styles
  input: {
    base: {
      width: 'w-full',
      padding: 'px-4 py-2',
      border: 'border-2 border-gray-200',
      borderRadius: 'rounded-lg',
      fontSize: 'text-sm',
      background: 'bg-white',
      transition: 'transition-colors duration-200',
      placeholder: 'placeholder:text-gray-400',
    },
    
    states: {
      focus: 'focus:border-[#009F9C] focus:outline-none focus:ring-2 focus:ring-[#009F9C]/20',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
      disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed',
    },
  },
  
  // Navigation Styles
  navigation: {
    header: {
      background: 'bg-white',
      border: 'border-b border-gray-200',
      padding: 'px-4 py-3',
      shadow: 'shadow-sm',
    },
    
    link: {
      base: {
        padding: 'px-3 py-2',
        borderRadius: 'rounded-lg',
        fontSize: 'text-sm',
        fontWeight: 'font-medium',
        transition: 'transition-colors duration-200',
      },
      
      states: {
        default: 'text-gray-600 hover:text-[#009F9C] hover:bg-gray-50',
        active: 'text-[#009F9C] bg-teal-50',
      },
    },
  },
  
  // Category Filter Styles
  categoryFilter: {
    container: {
      background: 'bg-white',
      border: 'border-b border-gray-100',
      padding: 'px-4 py-3',
      shadow: 'shadow-sm',
    },
    
    scrollContainer: {
      display: 'flex space-x-3',
      overflow: 'overflow-x-auto',
      scrollbar: 'scrollbar-thin',
      padding: 'pb-1',
    },
    
    button: {
      base: {
        display: 'flex-shrink-0 flex items-center space-x-2',
        padding: 'px-3 py-1.5',
        borderRadius: 'rounded-lg',
        border: 'border-2',
        fontSize: 'text-sm',
        fontWeight: 'font-medium',
        transition: 'transition-all duration-200',
        whitespace: 'whitespace-nowrap',
      },
      
      states: {
        default: 'bg-white text-gray-600 border-gray-200 hover:border-[#009F9C] hover:text-[#009F9C]',
        selected: 'bg-[#009F9C] text-white border-[#009F9C] shadow-lg',
      },
    },
  },
  
  // Scrollbar Styles
  scrollbar: {
    thin: {
      width: '4px',
      height: '4px',
      track: 'transparent',
      thumb: 'rgba(0, 159, 156, 0.3)',
      thumbHover: 'rgba(0, 159, 156, 0.5)',
      borderRadius: '2px',
    },
    
    hidden: {
      display: 'none',
    },
  },
};

// Layout Configurations
export const layoutConfig = {
  // Container Sizes
  container: {
    sm: 'max-w-screen-sm',    // 640px
    md: 'max-w-screen-md',    // 768px
    lg: 'max-w-screen-lg',    // 1024px
    xl: 'max-w-screen-xl',    // 1280px
    '2xl': 'max-w-screen-2xl', // 1536px
  },
  
  // Grid Configurations
  grid: {
    responsive: {
      mobile: 'space-y-4',
      tablet: 'md:grid md:grid-cols-2 md:gap-4 md:space-y-0',
      desktop: 'lg:grid-cols-3 xl:grid-cols-4',
    },
    
    itemCard: {
      mobile: 'grid grid-cols-1 gap-4',
      tablet: 'sm:grid-cols-2',
      desktop: 'lg:grid-cols-3 xl:grid-cols-4',
    },
  },
  
  // Spacing Configurations
  spacing: {
    page: {
      padding: 'px-4 py-6',
      margin: 'mx-auto',
    },
    
    section: {
      margin: 'mb-6',
      padding: 'p-4',
    },
    
    component: {
      margin: 'mb-4',
      padding: 'p-3',
    },
  },
};

// Typography Configuration
export const typography = {
  headings: {
    h1: {
      fontSize: 'text-3xl',
      fontWeight: 'font-bold',
      lineHeight: 'leading-tight',
      color: 'text-gray-900',
      margin: 'mb-4',
    },
    
    h2: {
      fontSize: 'text-2xl',
      fontWeight: 'font-bold',
      lineHeight: 'leading-tight',
      color: 'text-gray-900',
      margin: 'mb-3',
    },
    
    h3: {
      fontSize: 'text-xl',
      fontWeight: 'font-semibold',
      lineHeight: 'leading-tight',
      color: 'text-gray-900',
      margin: 'mb-2',
    },
    
    h4: {
      fontSize: 'text-lg',
      fontWeight: 'font-semibold',
      lineHeight: 'leading-tight',
      color: 'text-gray-900',
      margin: 'mb-2',
    },
  },
  
  body: {
    text: {
      fontSize: 'text-base',
      lineHeight: 'leading-relaxed',
      color: 'text-gray-700',
    },
    
    textSmall: {
      fontSize: 'text-sm',
      lineHeight: 'leading-relaxed',
      color: 'text-gray-600',
    },
    
    textLarge: {
      fontSize: 'text-lg',
      lineHeight: 'leading-relaxed',
      color: 'text-gray-700',
    },
  },
};

// Animation Configurations
export const animations = {
  transitions: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-200',
    slow: 'transition-all duration-300',
  },
  
  hover: {
    scale: 'hover:scale-[1.02]',
    scaleSmall: 'hover:scale-[1.01]',
    shadow: 'hover:shadow-lg',
    opacity: 'hover:opacity-80',
  },
  
  loading: {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
  },
};

// Main Style Configuration Object
export const styleConfig = {
  designTokens,
  componentStyles,
  layoutConfig,
  typography,
  animations,
  
  // Utility Functions
  utils: {
    // Combine multiple style objects
    combine: (...styles: (string | undefined)[]) => {
      return styles.filter(Boolean).join(' ');
    },
    
    // Generate responsive classes
    responsive: (mobile: string, tablet?: string, desktop?: string) => {
      const classes = [mobile];
      if (tablet) classes.push(`md:${tablet}`);
      if (desktop) classes.push(`lg:${desktop}`);
      return classes.join(' ');
    },
    
    // Generate state classes (hover, focus, active)
    withStates: (base: string, states: { hover?: string; focus?: string; active?: string }) => {
      const classes = [base];
      if (states.hover) classes.push(states.hover);
      if (states.focus) classes.push(states.focus);
      if (states.active) classes.push(states.active);
      return classes.join(' ');
    },
  },
};

export default styleConfig;