/**
 * XMarket Design System - Core Design Principles
 * 
 * This file establishes the foundational design principles for XMarket,
 * enhancing the existing design without breaking functionality.
 * 
 * SAFETY FIRST: All changes preserve existing component behavior.
 */

// =============================================================================
// 🎨 CORE DESIGN PRINCIPLES
// =============================================================================

export const DESIGN_PRINCIPLES = {
  /**
   * 1. CONSISTENCY
   * Every element should feel like part of the same product
   */
  CONSISTENCY: {
    description: "Maintain visual and functional consistency across all interfaces",
    implementation: [
      "Use standardized spacing scale (4px base)",
      "Apply consistent border radius patterns", 
      "Maintain uniform color usage",
      "Follow established component patterns"
    ]
  },

  /**
   * 2. CLARITY
   * Users should understand what they can do and what's happening
   */
  CLARITY: {
    description: "Prioritize clear information hierarchy and user understanding",
    implementation: [
      "Strong typography hierarchy (h1-h6 scale)",
      "Clear visual feedback for interactions",
      "Obvious call-to-action buttons",
      "Meaningful loading and error states"
    ]
  },

  /**
   * 3. EFFICIENCY
   * Help users accomplish tasks quickly and easily
   */
  EFFICIENCY: {
    description: "Optimize user workflows and reduce cognitive load", 
    implementation: [
      "Logical navigation patterns",
      "Smart defaults and suggestions",
      "Minimal clicks for common actions",
      "Progressive disclosure of complex features"
    ]
  },

  /**
   * 4. ACCESSIBILITY
   * Design for all users regardless of ability
   */
  ACCESSIBILITY: {
    description: "Ensure inclusive design for users with diverse needs",
    implementation: [
      "WCAG 2.1 AA color contrast ratios",
      "Keyboard navigation support",
      "Screen reader friendly markup",
      "Focus indicators and states"
    ]
  },

  /**
   * 5. DELIGHT
   * Create positive emotional connections
   */
  DELIGHT: {
    description: "Add meaningful moments of joy without compromising usability",
    implementation: [
      "Subtle animations that provide feedback",
      "Celebratory micro-interactions",
      "Thoughtful empty states",
      "Personality in copywriting"
    ]
  }
} as const;

// =============================================================================
// 🎨 ENHANCED COLOR SYSTEM
// =============================================================================

/**
 * Enhanced color palette building on existing brand colors
 * Preserves current #009F9C primary while adding systematic variations
 */
export const COLOR_SYSTEM = {
  // PRIMARY BRAND COLORS (existing)
  brand: {
    primary: '#009F9C',      // Current main brand color - DO NOT CHANGE
    secondary: '#007B78',    // Current secondary - DO NOT CHANGE  
    accent: '#FF6B35'        // Current accent - DO NOT CHANGE
  },

  // ENHANCED PRIMARY SCALE
  primary: {
    50: '#E6F9F8',   // Lightest teal for backgrounds
    100: '#B3F0EE',  // Light teal for subtle accents
    200: '#80E7E3',  // Medium-light teal
    300: '#4DDED8',  // Medium teal
    400: '#1AD5CD',  // Medium-strong teal
    500: '#009F9C',  // MAIN BRAND COLOR - DO NOT CHANGE
    600: '#008F8C',  // Slightly darker
    700: '#007B78',  // Current secondary color
    800: '#006763',  // Dark teal
    900: '#00534F'   // Darkest teal
  },

  // SEMANTIC COLORS
  semantic: {
    success: '#10B981',      // Green for success states
    warning: '#F59E0B',      // Amber for warnings
    error: '#EF4444',        // Red for errors
    info: '#3B82F6'          // Blue for information
  },

  // NEUTRAL SYSTEM  
  neutral: {
    0: '#FFFFFF',            // Pure white
    50: '#F9FAFB',          // Off-white backgrounds
    100: '#F3F4F6',         // Light gray backgrounds
    200: '#E5E7EB',         // Border gray
    300: '#D1D5DB',         // Disabled elements
    400: '#9CA3AF',         // Placeholder text
    500: '#6B7280',         // Secondary text
    600: '#4B5563',         // Primary text light
    700: '#374151',         // Primary text
    800: '#1F2937',         // Dark text
    900: '#111827',         // Darkest text
    950: '#030712'          // Pure black
  },

  // SURFACE COLORS
  surface: {
    background: '#FFFFFF',   // Main background
    card: '#FFFFFF',         // Card backgrounds
    elevated: '#FFFFFF',     // Elevated surfaces
    overlay: 'rgba(0, 0, 0, 0.5)'  // Modal overlays
  }
} as const;

// =============================================================================
// 📏 SPACING SYSTEM
// =============================================================================

/**
 * Consistent spacing scale based on 4px base unit
 * Maps to Tailwind's spacing scale for easy implementation
 */
export const SPACING_SYSTEM = {
  base: 4,  // 4px base unit
  scale: {
    xs: 4,    // 0.25rem - 4px
    sm: 8,    // 0.5rem  - 8px  
    md: 16,   // 1rem    - 16px
    lg: 24,   // 1.5rem  - 24px
    xl: 32,   // 2rem    - 32px
    '2xl': 48, // 3rem   - 48px
    '3xl': 64, // 4rem   - 64px
    '4xl': 96  // 6rem   - 96px
  },
  
  // SEMANTIC SPACING
  component: {
    padding: {
      tight: 8,     // Compact components
      normal: 16,   // Standard components  
      relaxed: 24   // Spacious components
    },
    margin: {
      tight: 8,     // Close elements
      normal: 16,   // Standard separation
      relaxed: 32   // Section separation  
    },
    gap: {
      tight: 4,     // List items, form fields
      normal: 8,    // Cards, buttons
      relaxed: 16   // Sections
    }
  }
} as const;

// =============================================================================
// 🔤 TYPOGRAPHY SYSTEM  
// =============================================================================

/**
 * Enhanced typography building on existing Inter font
 * Preserves current implementation while adding systematic scale
 */
export const TYPOGRAPHY_SYSTEM = {
  // FONT FAMILIES (preserve existing)
  families: {
    primary: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace']
  },

  // TYPE SCALE
  scale: {
    // HEADINGS
    h1: {
      fontSize: '2.25rem',    // 36px
      lineHeight: '2.5rem',   // 40px  
      fontWeight: '700',      // Bold
      letterSpacing: '-0.025em'
    },
    h2: {
      fontSize: '1.875rem',   // 30px
      lineHeight: '2.25rem',  // 36px
      fontWeight: '700',      // Bold
      letterSpacing: '-0.025em'
    },
    h3: {
      fontSize: '1.5rem',     // 24px
      lineHeight: '2rem',     // 32px
      fontWeight: '600',      // Semibold
      letterSpacing: '-0.025em'
    },
    h4: {
      fontSize: '1.25rem',    // 20px
      lineHeight: '1.75rem',  // 28px
      fontWeight: '600',      // Semibold
      letterSpacing: '0'
    },
    h5: {
      fontSize: '1.125rem',   // 18px
      lineHeight: '1.75rem',  // 28px
      fontWeight: '600',      // Semibold
      letterSpacing: '0'
    },
    h6: {
      fontSize: '1rem',       // 16px
      lineHeight: '1.5rem',   // 24px
      fontWeight: '600',      // Semibold
      letterSpacing: '0'
    },

    // BODY TEXT
    body: {
      large: {
        fontSize: '1.125rem',  // 18px
        lineHeight: '1.75rem', // 28px
        fontWeight: '400',     // Normal
        letterSpacing: '0'
      },
      medium: {
        fontSize: '1rem',      // 16px
        lineHeight: '1.5rem',  // 24px
        fontWeight: '400',     // Normal
        letterSpacing: '0'
      },
      small: {
        fontSize: '0.875rem',  // 14px
        lineHeight: '1.25rem', // 20px
        fontWeight: '400',     // Normal
        letterSpacing: '0'
      }
    },

    // UTILITY TEXT
    caption: {
      fontSize: '0.75rem',     // 12px
      lineHeight: '1rem',      // 16px
      fontWeight: '400',       // Normal
      letterSpacing: '0.025em'
    },
    overline: {
      fontSize: '0.75rem',     // 12px
      lineHeight: '1rem',      // 16px
      fontWeight: '600',       // Semibold
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }
} as const;

// =============================================================================
// 🔲 BORDER RADIUS SYSTEM
// =============================================================================

/**
 * Consistent border radius scale for different component types
 */
export const BORDER_RADIUS_SYSTEM = {
  none: '0',
  sm: '0.125rem',    // 2px - Small elements
  base: '0.25rem',   // 4px - Default radius  
  md: '0.375rem',    // 6px - Cards, inputs
  lg: '0.5rem',      // 8px - Buttons, large cards
  xl: '0.75rem',     // 12px - Special components
  '2xl': '1rem',     // 16px - Hero sections
  '3xl': '1.5rem',   // 24px - Large containers
  full: '9999px'     // Full rounding for pills/avatars
} as const;

// =============================================================================
// 🌟 ELEVATION SYSTEM
// =============================================================================

/**
 * Consistent shadow system for depth and hierarchy
 */
export const ELEVATION_SYSTEM = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
} as const;

// =============================================================================
// 🎬 ANIMATION PRINCIPLES
// =============================================================================

/**
 * Animation system building on existing Framer Motion usage
 */
export const ANIMATION_SYSTEM = {
  // DURATION - For CSS and direct usage
  duration: {
    fast: 150,      // Quick interactions
    normal: 300,    // Standard transitions  
    slow: 500,      // Complex animations
    slower: 700     // Page transitions
  },

  // DURATION STRINGS - For CSS transitions
  durationString: {
    fast: "150ms",      // Quick interactions
    normal: "300ms",    // Standard transitions  
    slow: "500ms",      // Complex animations
    slower: "700ms"     // Page transitions
  },

  // EASING - For CSS transitions
  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)', 
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // FRAMER MOTION EASING - For Framer Motion animations
  framerEasing: {
    linear: 'linear',
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1], 
    easeInOut: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55]
  },

  // COMMON VARIANTS (preserve existing patterns)
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    }
  }
} as const;

// =============================================================================
// 📱 RESPONSIVE BREAKPOINTS
// =============================================================================

/**
 * Responsive design breakpoints matching Tailwind defaults
 */
export const BREAKPOINTS = {
  sm: '640px',    // Small devices
  md: '768px',    // Medium devices
  lg: '1024px',   // Large devices  
  xl: '1280px',   // Extra large devices
  '2xl': '1536px' // 2X large devices
} as const;

// =============================================================================
// 🎯 COMPONENT CATEGORIES
// =============================================================================

/**
 * Component classification for systematic styling
 */
export const COMPONENT_CATEGORIES = {
  // FOUNDATIONAL
  foundational: [
    'Button', 'Input', 'Select', 'Checkbox', 'Radio', 'Switch', 'Slider'
  ],

  // LAYOUT  
  layout: [
    'Container', 'Grid', 'Flex', 'Stack', 'Divider', 'Spacer'
  ],

  // NAVIGATION
  navigation: [
    'Navbar', 'Sidebar', 'Breadcrumb', 'Pagination', 'Tabs', 'Steps'
  ],

  // FEEDBACK
  feedback: [
    'Alert', 'Toast', 'Modal', 'Tooltip', 'Progress', 'Skeleton', 'Spinner'
  ],

  // DATA DISPLAY
  dataDisplay: [
    'Card', 'List', 'Table', 'Avatar', 'Badge', 'Chip', 'Tag'
  ],

  // COMPLEX
  complex: [
    'Form', 'Search', 'Filter', 'Calendar', 'Chart', 'Map'
  ]
} as const;

export default {
  DESIGN_PRINCIPLES,
  COLOR_SYSTEM,
  SPACING_SYSTEM,
  TYPOGRAPHY_SYSTEM,
  BORDER_RADIUS_SYSTEM,
  ELEVATION_SYSTEM,
  ANIMATION_SYSTEM,
  BREAKPOINTS,
  COMPONENT_CATEGORIES
} as const;