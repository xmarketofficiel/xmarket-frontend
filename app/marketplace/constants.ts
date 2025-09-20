// Marketplace Page Constants

export const MARKETPLACE_CONFIG = {
  // Pagination settings
  ITEMS_PER_PAGE: 12,
  MAX_PAGES_TO_SHOW: 5,
  
  // View modes
  DEFAULT_VIEW_MODE: 'grid' as const,
  VIEW_MODES: {
    GRID: 'grid',
    LIST: 'list'
  } as const,
  
  // Categories
  DEFAULT_CATEGORY: 'all',
  
  // Search settings
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 2,
  
  // Refresh settings
  PULL_TO_REFRESH_THRESHOLD: 60,
  REFRESH_COOLDOWN_MS: 2000,
  
  // Animation settings
  FILTER_ANIMATION_DURATION: 300,
  SCROLL_DEBOUNCE_MS: 100,
  
  // Layout breakpoints
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  
  // Performance settings
  VIRTUAL_SCROLL_THRESHOLD: 100,
  IMAGE_LAZY_LOAD_MARGIN: '50px'
};

// Category configuration with icons and colors
export const CATEGORY_CONFIG = {
  all: {
    name: 'All Items',
    icon: '🛍️',
    color: '#6B7280',
    description: 'Browse all available items'
  },
  electronics: {
    name: 'Electronics',
    icon: '💻',
    color: '#3B82F6',
    description: 'Phones, laptops, gadgets & more'
  },
  Electronics: {
    name: 'Electronics',
    icon: '💻',
    color: '#3B82F6',
    description: 'Phones, laptops, gadgets & more'
  },
  books: {
    name: 'Books',
    icon: '📚',
    color: '#10B981',
    description: 'Textbooks, novels & academic materials'
  },
  Books: {
    name: 'Books',
    icon: '📚',
    color: '#10B981',
    description: 'Textbooks, novels & academic materials'
  },
  furniture: {
    name: 'Furniture',
    icon: '🪑',
    color: '#8B5CF6',
    description: 'Dorm furniture & home decor'
  },
  Furniture: {
    name: 'Furniture',
    icon: '🪑',
    color: '#8B5CF6',
    description: 'Dorm furniture & home decor'
  },
  clothing: {
    name: 'Clothing',
    icon: '👕',
    color: '#F59E0B',
    description: 'Fashion, shoes & accessories'
  },
  Clothing: {
    name: 'Clothing',
    icon: '👕',
    color: '#F59E0B',
    description: 'Fashion, shoes & accessories'
  },
  sports: {
    name: 'Sports',
    icon: '⚽',
    color: '#EF4444',
    description: 'Sports equipment & fitness gear'
  },
  Sports: {
    name: 'Sports',
    icon: '⚽',
    color: '#EF4444',
    description: 'Sports equipment & fitness gear'
  },
  vehicles: {
    name: 'Vehicles',
    icon: '🚗',
    color: '#6366F1',
    description: 'Bikes, scooters & transportation'
  },
  transportation: {
    name: 'Transportation',
    icon: '🚗',
    color: '#6366F1',
    description: 'Bikes, scooters & transportation'
  },
  Transportation: {
    name: 'Transportation',
    icon: '🚗',
    color: '#6366F1',
    description: 'Bikes, scooters & transportation'
  },
  services: {
    name: 'Services',
    icon: '🔧',
    color: '#059669',
    description: 'Tutoring, cleaning, repairs'
  },
  Services: {
    name: 'Services',
    icon: '🔧',
    color: '#059669',
    description: 'Tutoring, cleaning, repairs'
  },
  'home & garden': {
    name: 'Home & Garden',
    icon: '🏡',
    color: '#059669',
    description: 'Home essentials & garden supplies'
  },
  other: {
    name: 'Other',
    icon: '📦',
    color: '#6B7280',
    description: 'Everything else'
  },
  Other: {
    name: 'Other',
    icon: '📦',
    color: '#6B7280',
    description: 'Everything else'
  },
  // Add more common categories that might come from backend
  'Health & Beauty': {
    name: 'Health & Beauty',
    icon: '💄',
    color: '#EC4899',
    description: 'Cosmetics, skincare & wellness products'
  },
  'Art & Crafts': {
    name: 'Art & Crafts',
    icon: '🎨',
    color: '#8B5CF6',
    description: 'Art supplies, crafts & creative materials'
  },
  'Automotive': {
    name: 'Automotive',
    icon: '🚗',
    color: '#6366F1',
    description: 'Car parts, accessories & maintenance'
  },
  'Pet Supplies': {
    name: 'Pet Supplies',
    icon: '🐾',
    color: '#F59E0B',
    description: 'Pet food, toys & accessories'
  },
  'Food & Beverages': {
    name: 'Food & Beverages',
    icon: '🍕',
    color: '#EF4444',
    description: 'Food, drinks & kitchen items'
  },
  'Music & Instruments': {
    name: 'Music & Instruments',
    icon: '🎵',
    color: '#10B981',
    description: 'Musical instruments & audio equipment'
  },
  'Toys & Games': {
    name: 'Toys & Games',
    icon: '🎲',
    color: '#F59E0B',
    description: 'Toys, games & entertainment'
  },
  'Office Supplies': {
    name: 'Office Supplies',
    icon: '📋',
    color: '#6B7280',
    description: 'Office equipment & stationery'
  }
};

// View mode configurations
export const VIEW_MODE_CONFIG = {
  grid: {
    name: 'Grid View',
    icon: 'Grid',
    description: 'Card-based grid layout',
    itemsPerRow: {
      mobile: 2,
      tablet: 3,
      desktop: 4
    }
  },
  list: {
    name: 'List View', 
    icon: 'List',
    description: 'Detailed list layout',
    itemsPerRow: {
      mobile: 1,
      tablet: 1,
      desktop: 1
    }
  }
};

// Filter options
export const FILTER_OPTIONS = {
  sortBy: [
    { value: 'newest', label: 'Newest First', icon: '🕒' },
    { value: 'oldest', label: 'Oldest First', icon: '📅' },
    { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
    { value: 'price-high', label: 'Price: High to Low', icon: '💎' },
    { value: 'popular', label: 'Most Popular', icon: '⭐' },
    { value: 'alphabetical', label: 'A to Z', icon: '🔤' }
  ],
  priceRanges: [
    { value: 'all', label: 'Any Price', min: 0, max: Infinity },
    { value: 'under-25', label: 'Under $25', min: 0, max: 25 },
    { value: '25-50', label: '$25 - $50', min: 25, max: 50 },
    { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
    { value: '100-250', label: '$100 - $250', min: 100, max: 250 },
    { value: 'over-250', label: 'Over $250', min: 250, max: Infinity }
  ],
  conditions: [
    { value: 'all', label: 'Any Condition' },
    { value: 'New', label: 'New' },
    { value: 'Like New', label: 'Like New' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' }
  ]
};

// Search suggestions
export const SEARCH_SUGGESTIONS = {
  popular: [
    'textbooks',
    'laptop',
    'furniture',
    'bike',
    'phone',
    'books',
    'clothing',
    'electronics'
  ],
  trending: [
    'gaming chair',
    'calculus textbook',
    'iphone',
    'macbook',
    'desk lamp',
    'backpack'
  ]
};

// Empty states
export const EMPTY_STATES = {
  noItems: {
    title: 'No items found',
    description: 'Try adjusting your search or filters',
    icon: '🔍',
    action: 'Clear filters'
  },
  noSearch: {
    title: 'Start exploring',
    description: 'Search for items or browse by category',
    icon: '🛍️',
    action: 'Browse categories'
  },
  loading: {
    title: 'Loading marketplace...',
    description: 'Finding the best deals for you',
    icon: '⏳'
  },
  error: {
    title: 'Something went wrong',
    description: 'Unable to load items. Please try again.',
    icon: '⚠️',
    action: 'Retry'
  }
};

// Performance thresholds
export const PERFORMANCE_CONFIG = {
  LARGE_LIST_THRESHOLD: 50,
  INFINITE_SCROLL_BUFFER: 10,
  IMAGE_OPTIMIZATION: {
    quality: 85,
    sizes: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
  },
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  STALE_WHILE_REVALIDATE: 10 * 60 * 1000 // 10 minutes
};

// Accessibility settings
export const A11Y_CONFIG = {
  ARIA_LABELS: {
    searchInput: 'Search marketplace items',
    categoryFilter: 'Filter by category',
    viewModeToggle: 'Change view mode',
    sortOptions: 'Sort items',
    loadMore: 'Load more items',
    filterToggle: 'Toggle filters panel'
  },
  KEYBOARD_SHORTCUTS: {
    focusSearch: '/',
    clearFilters: 'Escape',
    toggleView: 'v'
  }
};

// Analytics tracking
export const ANALYTICS_EVENTS = {
  SEARCH_PERFORMED: 'marketplace_search',
  CATEGORY_SELECTED: 'category_filter',
  ITEM_VIEWED: 'item_viewed',
  VIEW_MODE_CHANGED: 'view_mode_changed',
  FILTER_APPLIED: 'filter_applied',
  LOAD_MORE_TRIGGERED: 'load_more_items'
};
