export const PROFILE_CONSTANTS = {
  // Animation delays
  ANIMATION_DELAYS: {
    HEADER: 0,
    STATS: 0.1,
    NAVIGATION: 0.2,
    CONTENT: 0.3,
    FOOTER: 0.4,
  },

  // Tab configuration
  TABS: [
    {
      id: 'my-items',
      label: 'My Items',
      count: 'activeListingsCount',
      icon: 'Package',
      description: 'Items you\'ve listed for sale'
    },
    {
      id: 'my-interests',
      label: 'My Interests',
      count: 'savedItemsCount',
      icon: 'Heart',
      description: 'Items you\'ve saved'
    },
    {
      id: 'pending-sales',
      label: 'Pending Sales',
      count: 'pendingSalesCount',
      icon: 'Clock',
      description: 'Sales awaiting completion'
    },
    {
      id: 'purchase-history',
      label: 'Purchase History',
      count: 'purchaseHistoryCount',
      icon: 'ShoppingBag',
      description: 'Items you\'ve purchased'
    },
    {
      id: 'sold-items',
      label: 'Sold Items',
      count: 'soldItemsCount',
      icon: 'CheckCircle',
      description: 'Items you\'ve sold'
    },
    {
      id: 'viewed-items',
      label: 'Recently Viewed',
      count: 'viewedItemsCount',
      icon: 'Eye',
      description: 'Items you\'ve recently viewed'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      count: 'notificationsCount',
      icon: 'Bell',
      description: 'Your notifications'
    }
  ],

  // Stats configuration
  STATS: [
    {
      id: 'listings',
      label: 'Active Listings',
      value: 'activeListingsCount',
      icon: 'Package',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'sold',
      label: 'Items Sold',
      value: 'soldItemsCount',
      icon: 'TrendingUp',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'purchased',
      label: 'Items Purchased',
      value: 'purchaseHistoryCount',
      icon: 'ShoppingBag',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'saved',
      label: 'Saved Items',
      value: 'savedItemsCount',
      icon: 'Heart',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    }
  ],

  // Quick actions
  QUICK_ACTIONS: [
    {
      id: 'add-item',
      label: 'Add New Item',
      description: 'List something for sale',
      icon: 'Plus',
      href: '/add',
      color: 'from-[#009F9C] to-[#007A77]',
      hoverColor: 'hover:from-[#007A77] hover:to-[#006B68]'
    },
    {
      id: 'browse-marketplace',
      label: 'Browse Marketplace',
      description: 'Find items to buy',
      icon: 'Search',
      href: '/marketplace',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      description: 'Update your information',
      icon: 'Settings',
      href: '/settings/profile',
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700'
    }
  ],

  // Loading states
  LOADING_STATES: {
    SKELETON_ROWS: 6,
    SKELETON_ITEMS: 8,
    PLACEHOLDER_TEXT: 'Loading...'
  },

  // Empty states
  EMPTY_STATES: {
    MY_ITEMS: {
      title: 'No items listed yet',
      description: 'Start selling by adding your first item',
      actionText: 'Add Your First Item',
      actionHref: '/add',
      icon: 'Package'
    },
    MY_INTERESTS: {
      title: 'No saved items yet',
      description: 'Browse the marketplace and save items you like',
      actionText: 'Browse Marketplace',
      actionHref: '/marketplace',
      icon: 'Heart'
    },
    PENDING_SALES: {
      title: 'No pending sales',
      description: 'Sales will appear here when buyers show interest',
      icon: 'Clock',
      actionText: undefined,
      actionHref: undefined
    },
    PURCHASE_HISTORY: {
      title: 'No purchases yet',
      description: 'Items you buy will appear here',
      actionText: 'Start Shopping',
      actionHref: '/marketplace',
      icon: 'ShoppingBag'
    },
    SOLD_ITEMS: {
      title: 'No items sold yet',
      description: 'Keep your listings active to make sales',
      icon: 'CheckCircle',
      actionText: undefined,
      actionHref: undefined
    },
    VIEWED_ITEMS: {
      title: 'No recently viewed items',
      description: 'Items you view will appear here',
      actionText: 'Browse Items',
      actionHref: '/marketplace',
      icon: 'Eye'
    },
    NOTIFICATIONS: {
      title: 'No notifications',
      description: 'You\'re all caught up!',
      icon: 'Bell',
      actionText: undefined,
      actionHref: undefined
    }
  },

  // Error states
  ERROR_STATES: {
    LOAD_FAILED: {
      title: 'Failed to load profile data',
      description: 'Please try again or contact support if the problem persists',
      actionText: 'Try Again'
    },
    NETWORK_ERROR: {
      title: 'Network Error',
      description: 'Please check your internet connection',
      actionText: 'Retry'
    }
  },

  // Pagination
  PAGINATION: {
    ITEMS_PER_PAGE: 12,
    INITIAL_PAGE: 1
  },

  // Image settings
  IMAGE_SETTINGS: {
    DEFAULT_AVATAR: '/images/default-avatar.png',
    PLACEHOLDER_ITEM: '/images/placeholder-item.png',
    UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },

  // Responsive breakpoints
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px'
  },

  // Privacy settings
  PRIVACY_OPTIONS: [
    {
      id: 'showSoldItems',
      label: 'Show Sold Items',
      description: 'Other users can see items you\'ve sold'
    },
    {
      id: 'showPurchases',
      label: 'Show Purchases',
      description: 'Other users can see items you\'ve bought'
    }
  ],

  // Activity feed types
  ACTIVITY_TYPES: {
    ITEM_LISTED: 'item_listed',
    ITEM_SOLD: 'item_sold',
    ITEM_PURCHASED: 'item_purchased',
    ITEM_SAVED: 'item_saved',
    PROFILE_UPDATED: 'profile_updated'
  },

  // Notification types
  NOTIFICATION_TYPES: {
    ITEM_INTEREST: 'item_interest',
    ITEM_SOLD: 'item_sold',
    ITEM_PURCHASED: 'item_purchased',
    PRICE_DROP: 'price_drop',
    SYSTEM: 'system'
  },

  // Theme colors
  THEME_COLORS: {
    PRIMARY: '#009F9C',
    PRIMARY_DARK: '#007A77',
    PRIMARY_LIGHT: '#B3F5F4',
    SECONDARY: '#6B7280',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  }
} as const;

export type ProfileTab = typeof PROFILE_CONSTANTS.TABS[number]['id'];
export type StatType = typeof PROFILE_CONSTANTS.STATS[number]['id'];
export type ActivityType = typeof PROFILE_CONSTANTS.ACTIVITY_TYPES[keyof typeof PROFILE_CONSTANTS.ACTIVITY_TYPES];
export type NotificationType = typeof PROFILE_CONSTANTS.NOTIFICATION_TYPES[keyof typeof PROFILE_CONSTANTS.NOTIFICATION_TYPES];
