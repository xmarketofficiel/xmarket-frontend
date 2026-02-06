// Add Item Form Constants

export const ADD_ITEM_CONFIG = {
  // Form steps
  TOTAL_STEPS: 2,
  STEP_PHOTOS: 1,
  STEP_DETAILS: 2,
  
  // Image upload settings
  MAX_IMAGES: 6,
  MAX_FILE_SIZE_MB: 7,
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heif'],
  
  // Validation limits
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 20,
  DESCRIPTION_MAX_LENGTH: 1000,
  MIN_PRICE: 0.01,
  MAX_PRICE: 100000,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 1000,
  
  // Form defaults
  DEFAULT_QUANTITY: '1',
  DEFAULT_CONDITION: 'Good' as const,
  
  // Debounce settings
  VALIDATION_DEBOUNCE_MS: 300,
  AUTOSAVE_DEBOUNCE_MS: 1000,
  
  // Animation settings
  STEP_TRANSITION_DURATION: 0.3,
  SUCCESS_ANIMATION_DURATION: 0.5
};

// Category configuration with icons - matches backend seed data
export const CATEGORY_CONFIG = {
  'Electronics': {
    icon: '�',
    description: 'Phones, laptops, gadgets, accessories',
    subcategories: ['Phones', 'Laptops', 'Tablets', 'Audio', 'Gaming', 'Accessories']
  },
  'Books': {
    icon: '📚', 
    description: 'Textbooks, novels, academic materials',
    subcategories: ['Textbooks', 'Fiction', 'Academic', 'Reference', 'Magazines']
  },
  'Clothing': {
    icon: '👕',
    description: 'Shirts, pants, shoes, accessories',
    subcategories: ['Shirts', 'Pants', 'Shoes', 'Accessories', 'Formal', 'Casual']
  },
  'Furniture': {
    icon: '🪑',
    description: 'Desks, chairs, storage, decorations',
    subcategories: ['Desks', 'Chairs', 'Storage', 'Beds', 'Decorations']
  },
  'Sports': {
    icon: '⚽',
    description: 'Sports equipment, fitness gear',
    subcategories: ['Fitness', 'Ball Sports', 'Water Sports', 'Outdoor', 'Gym Equipment']
  },
  'Transportation': {
    icon: '🚗',
    description: 'Cars, bikes, scooters, parts',
    subcategories: ['Cars', 'Motorcycles', 'Bicycles', 'Scooters', 'Parts']
  },
  'Health & Beauty': {
    icon: '💄',
    description: 'Cosmetics, skincare, health products',
    subcategories: ['Skincare', 'Makeup', 'Health Supplements', 'Personal Care']
  },
  'Art & Crafts': {
    icon: '🎨',
    description: 'Art supplies, handmade items, crafts',
    subcategories: ['Painting', 'Drawing', 'Crafting', 'Handmade', 'Supplies']
  },
  'Music & Instruments': {
    icon: '🎵',
    description: 'Instruments, audio equipment, music',
    subcategories: ['Guitars', 'Keyboards', 'Audio Equipment', 'Sheet Music']
  },
  'Home & Garden': {
    icon: '�',
    description: 'Home appliances, garden tools',
    subcategories: ['Appliances', 'Tools', 'Garden', 'Kitchen', 'Cleaning']
  },
  'Toys & Games': {
    icon: '🎮',
    description: 'Video games, board games, toys',
    subcategories: ['Video Games', 'Board Games', 'Toys', 'Puzzles', 'Collectibles']
  },
  'Pet Supplies': {
    icon: '🐕',
    description: 'Pet food, accessories, toys',
    subcategories: ['Pet Food', 'Toys', 'Accessories', 'Health', 'Grooming']
  },
  'Office Supplies': {
    icon: '📎',
    description: 'Stationery, office equipment, supplies',
    subcategories: ['Stationery', 'Equipment', 'Software', 'Furniture', 'Supplies']
  },
  'Food & Beverages': {
    icon: '🍕',
    description: 'Snacks, drinks, food items',
    subcategories: ['Snacks', 'Beverages', 'Ingredients', 'Specialty Foods']
  },
  'Services': {
    icon: '🔧',
    description: 'Tutoring, repairs, services',
    subcategories: ['Tutoring', 'Repairs', 'Consulting', 'Personal Services']
  },
  'Other': {
    icon: '�',
    description: 'Items that don\'t fit other categories',
    subcategories: ['Miscellaneous', 'Collectibles', 'Art', 'Crafts', 'Unique Items']
  }
};

// Condition options
export const CONDITION_OPTIONS = [
  {
    value: 'New',
    label: 'New',
    icon: '✨',
    description: 'Brand new, never used',
    color: '#10B981'
  },
  {
    value: 'Like New',
    label: 'Like New', 
    icon: '⭐',
    description: 'Excellent condition, barely used',
    color: '#059669'
  },
  {
    value: 'Good',
    label: 'Good',
    icon: '👍',
    description: 'Good condition with minor wear',
    color: '#3B82F6'
  },
  {
    value: 'Fair',
    label: 'Fair',
    icon: '👌', 
    description: 'Shows wear but fully functional',
    color: '#F59E0B'
  }
];

// Form validation messages
export const VALIDATION_MESSAGES = {
  title: {
    required: 'Title is required',
    minLength: `Title must be at least ${ADD_ITEM_CONFIG.TITLE_MIN_LENGTH} characters`,
    maxLength: `Title must be no more than ${ADD_ITEM_CONFIG.TITLE_MAX_LENGTH} characters`
  },
  description: {
    required: 'Description is required',
    minLength: `Description must be at least ${ADD_ITEM_CONFIG.DESCRIPTION_MIN_LENGTH} characters`,
    maxLength: `Description must be no more than ${ADD_ITEM_CONFIG.DESCRIPTION_MAX_LENGTH} characters`
  },
  price: {
    required: 'Price is required',
    min: `Price must be at least ${ADD_ITEM_CONFIG.MIN_PRICE} DH`,
    max: `Price must be no more than ${ADD_ITEM_CONFIG.MAX_PRICE} DH`,
    invalid: 'Please enter a valid price'
  },
  quantity: {
    required: 'Quantity is required',
    min: `Quantity must be at least ${ADD_ITEM_CONFIG.MIN_QUANTITY}`,
    max: `Quantity must be no more than ${ADD_ITEM_CONFIG.MAX_QUANTITY}`,
    invalid: 'Please enter a valid quantity'
  },
  category: {
    required: 'Please select a category'
  },
  condition: {
    required: 'Please select the item condition'
  },
  photos: {
    required: 'At least one photo is required',
    maxCount: `You can upload up to ${ADD_ITEM_CONFIG.MAX_IMAGES} photos`,
    maxSize: `Each photo must be smaller than ${ADD_ITEM_CONFIG.MAX_FILE_SIZE_MB}MB`,
    invalidFormat: `Supported formats: ${ADD_ITEM_CONFIG.SUPPORTED_FORMATS.join(', ')}`
  },
  showIdentity: {}
};

// Success messages
export const SUCCESS_MESSAGES = {
  ITEM_CREATED: 'Item posted successfully!',
  IMAGES_UPLOADED: 'Photos uploaded successfully',
  DRAFT_SAVED: 'Draft saved automatically',
  VALIDATION_PASSED: 'All fields are valid'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_FAILED: 'Please fix the errors below',
  IMAGE_UPLOAD_FAILED: 'Failed to upload images',
  CREATION_FAILED: 'Failed to create item',
  UNAUTHORIZED: 'Please sign in to post items',
  CATEGORIES_LOAD_FAILED: 'Failed to load categories'
};

// Step configuration
export const STEP_CONFIG = {
  [ADD_ITEM_CONFIG.STEP_PHOTOS]: {
    title: 'Add Photos',
    description: 'Upload photos of your item',
    icon: '📷',
    nextLabel: 'Next',
    canSkip: false,
    validationRequired: true
  },
  [ADD_ITEM_CONFIG.STEP_DETAILS]: {
    title: 'Item Details',
    description: 'Provide information about your item',
    icon: '📝',
    nextLabel: 'Post Item',
    canSkip: false,
    validationRequired: true
  }
};

// Form field configurations
export const FIELD_CONFIG = {
  title: {
    type: 'text',
    placeholder: 'e.g., MacBook Air M2 - Excellent condition',
    helpText: 'Choose a clear, descriptive title',
    required: true,
    maxLength: ADD_ITEM_CONFIG.TITLE_MAX_LENGTH
  },
  description: {
    type: 'textarea',
    placeholder: 'Describe your item in detail...',
    helpText: 'Provide detailed information about your item',
    required: true,
    rows: 4,
    maxLength: ADD_ITEM_CONFIG.DESCRIPTION_MAX_LENGTH
  },
  price: {
    type: 'number',
    placeholder: 'e.g., 8500',
    helpText: 'Enter the price in Moroccan Dirhams (DH)',
    required: true,
    min: ADD_ITEM_CONFIG.MIN_PRICE,
    max: ADD_ITEM_CONFIG.MAX_PRICE,
    step: 0.01
  },
  quantity: {
    type: 'number',
    placeholder: 'e.g., 1',
    helpText: 'How many units do you have?',
    required: true,
    min: ADD_ITEM_CONFIG.MIN_QUANTITY,
    max: ADD_ITEM_CONFIG.MAX_QUANTITY,
    step: 1
  }
};

// Privacy settings
export const PRIVACY_CONFIG = {
  showIdentity: {
    title: 'Show my identity',
    description: 'Let buyers see your name and verification status',
    defaultValue: true,
    icon: '👤'
  }
};

// Analytics events
export const ANALYTICS_EVENTS = {
  FORM_STARTED: 'add_item_form_started',
  STEP_COMPLETED: 'add_item_step_completed',
  PHOTOS_UPLOADED: 'add_item_photos_uploaded',
  ITEM_CREATED: 'add_item_created',
  FORM_ABANDONED: 'add_item_form_abandoned',
  VALIDATION_ERROR: 'add_item_validation_error'
};

// Local storage keys
export const STORAGE_KEYS = {
  DRAFT_FORM: 'add_item_draft',
  USER_PREFERENCES: 'add_item_preferences',
  RECENT_CATEGORIES: 'recent_categories'
};
