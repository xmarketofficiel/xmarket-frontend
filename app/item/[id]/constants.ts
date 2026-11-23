// Item Detail Page Constants

export const ITEM_DETAIL_CONFIG = {
  // Image settings
  MAX_IMAGES_TO_SHOW: 10,
  IMAGE_QUALITY: 85,
  PLACEHOLDER_IMAGE: '/images/placeholder-item.jpg',
  
  // Animation settings
  ANIMATION_DURATION: 0.3,
  CAROUSEL_TRANSITION_MS: 300,
  MODAL_ANIMATION_DURATION: 0.2,
  
  // Layout settings
  MAX_DESCRIPTION_LENGTH: 500,
  EXPANDED_DESCRIPTION_LENGTH: 2000,
  
  // API settings
  INTEREST_DEBOUNCE_MS: 500,
  RETRY_ATTEMPTS: 3,
  
  // Social features
  MAX_REPORT_LENGTH: 500,
  SHARE_PLATFORMS: ['whatsapp', 'email', 'copy-link'] as const,
  
  // Performance
  LAZY_LOAD_THRESHOLD: '100px',
  IMAGE_SIZES: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
};

// Item condition configuration
export const CONDITION_CONFIG = {
  'New': {
    color: '#10B981',
    bgColor: '#ECFDF5',
    icon: '✨',
    description: 'Brand new, never used'
  },
  'Like New': {
    color: '#059669',
    bgColor: '#F0FDF4',
    icon: '⭐',
    description: 'Excellent condition, barely used'
  },
  'Good': {
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    icon: '👍',
    description: 'Good condition with minor wear'
  },
  'Fair': {
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    icon: '👌',
    description: 'Shows wear but fully functional'
  }
};

// Action button configurations
export const ACTION_BUTTONS = {
  interested: {
    label: 'Contact member',
    loadingLabel: 'Opening WhatsApp...',
    successLabel: 'Opening WhatsApp!',
    icon: '📱',
    bgColor: 'bg-gradient-to-r from-[#009F9C] to-[#00B8B5]',
    hoverColor: 'hover:from-[#008A87] hover:to-[#009F9C]',
    textColor: 'text-white'
  },
  message: {
    label: 'Send Message',
    icon: '💬',
    bgColor: 'bg-white',
    hoverColor: 'hover:bg-gray-50',
    borderColor: 'border-[#009F9C]',
    textColor: 'text-[#009F9C]'
  },
  favorite: {
    label: 'Add to Favorites',
    activeLabel: 'Remove from Favorites',
    icon: '❤️',
    activeIcon: '💖',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    textColor: 'text-gray-700',
    activeColor: 'text-red-500'
  }
};

// Share options
export const SHARE_OPTIONS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: '📱',
    color: '#25D366',
    getUrl: (item: any) => `https://wa.me/?text=Check out this item: ${item.title} - ${window.location.href}`
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    color: '#6B7280',
    getUrl: (item: any) => `mailto:?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(`Check out this item: ${item.title}\n\n${window.location.href}`)}`
  },
  {
    id: 'copy-link',
    name: 'Copy Link',
    icon: '🔗',
    color: '#3B82F6',
    getUrl: () => window.location.href
  }
];

// Report reasons
export const REPORT_REASONS = [
  {
    id: 'spam',
    label: 'Spam or misleading',
    description: 'Fake listing or spam content'
  },
  {
    id: 'inappropriate',
    label: 'Inappropriate content',
    description: 'Offensive or inappropriate material'
  },
  {
    id: 'fraud',
    label: 'Fraud or scam',
    description: 'Suspicious or fraudulent activity'
  },
  {
    id: 'copyright',
    label: 'Copyright violation',
    description: 'Unauthorized use of content'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Another reason not listed'
  }
];

// Status messages
export const STATUS_MESSAGES = {
  loading: {
    item: 'Loading item details...',
    interest: 'Adding to your interests...',
    favorite: 'Updating favorites...',
    report: 'Submitting report...'
  },
  success: {
    interest: 'Added to your interests!',
    favorite: 'Added to favorites!',
    unfavorite: 'Removed from favorites',
    report: 'Report submitted successfully',
    share: 'Link copied to clipboard!'
  },
  error: {
    notFound: 'Item not found',
    loadFailed: 'Failed to load item details',
    interest: 'Failed to add interest',
    favorite: 'Failed to update favorites',
    report: 'Failed to submit report',
    unauthorized: 'Please sign in to perform this action',
    ownItem: 'You cannot perform this action on your own item'
  }
};

// Image carousel settings
export const CAROUSEL_CONFIG = {
  autoPlay: false,
  showThumbnails: true,
  showDots: true,
  infinite: true,
  swipeToSlide: true,
  touchThreshold: 10,
  speed: ITEM_DETAIL_CONFIG.CAROUSEL_TRANSITION_MS
};

// Breadcrumb navigation
export const BREADCRUMB_CONFIG = {
  home: { label: 'Marketplace', href: '/marketplace' },
  category: { label: '', href: '/marketplace' }, // Dynamic
  item: { label: '', href: '' } // Dynamic
};

// Security and validation
export const VALIDATION_CONFIG = {
  maxReportLength: ITEM_DETAIL_CONFIG.MAX_REPORT_LENGTH,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  rateLimitInterest: 1000, // 1 second between interest actions
  rateLimitReport: 5000 // 5 seconds between reports
};

// Analytics events
export const ANALYTICS_EVENTS = {
  ITEM_VIEWED: 'item_detail_viewed',
  INTEREST_ADDED: 'item_interest_added',
  FAVORITE_TOGGLED: 'item_favorite_toggled',
  MESSAGE_INITIATED: 'item_message_initiated',
  ITEM_SHARED: 'item_shared',
  ITEM_REPORTED: 'item_reported',
  IMAGE_VIEWED: 'item_image_viewed'
};

// Accessibility
export const A11Y_CONFIG = {
  imageCarousel: {
    ariaLabel: 'Item photos carousel',
    nextButton: 'Next photo',
    prevButton: 'Previous photo',
    thumbnailButton: 'View photo'
  },
  actions: {
    favorite: 'Add to favorites',
    unfavorite: 'Remove from favorites',
    interest: 'Show interest in this item',
    message: 'Contact this member',
    share: 'Share this item',
    report: 'Report this item'
  }
};
