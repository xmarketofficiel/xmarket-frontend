export const SETTINGS_CONSTANTS = {
  // Animation delays
  ANIMATION_DELAYS: {
    HEADER: 0,
    NAVIGATION: 0.1,
    CONTENT: 0.2,
    CARDS: 0.3,
  },

  // Settings sections
  SETTINGS_SECTIONS: [
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Manage your personal information and profile details',
      icon: 'User',
      href: '/settings/profile',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      items: [
        'Personal Information',
        'Profile Picture',
        'Contact Details',
        'Privacy Settings'
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Control how and when you receive notifications',
      icon: 'Bell',
      href: '/settings/notifications',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      items: [
        'Email Notifications',
        'Push Notifications',
        'SMS Alerts',
        'Frequency Settings'
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Manage your privacy settings and account security',
      icon: 'Shield',
      href: '/settings/privacy',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      items: [
        'Account Visibility',
        'Data Privacy',
        'Blocked Users',
        'Security Settings'
      ]
    },
    {
      id: 'preferences',
      title: 'App Preferences',
      description: 'Customize your app experience and display settings',
      icon: 'Settings',
      href: '/settings/preferences',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      items: [
        'Language',
        'Currency',
        'Display Mode',
        'Default Location'
      ]
    },
    {
      id: 'account',
      title: 'Account Management',
      description: 'Advanced account settings and data management',
      icon: 'UserCog',
      href: '/settings/account',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      items: [
        'Password Change',
        'Data Export',
        'Account Deletion',
        'Login History'
      ]
    },
    {
      id: 'support',
      title: 'Help & Support',
      description: 'Get help, report issues, and contact support',
      icon: 'HelpCircle',
      href: '/settings/support',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      items: [
        'Help Center',
        'Contact Support',
        'Report a Problem',
        'Feedback'
      ]
    }
  ],

  // Quick actions
  QUICK_ACTIONS: [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      description: 'Update your profile information',
      icon: 'Edit3',
      href: '/settings/profile',
      color: 'from-[#009F9C] to-[#007A77]'
    },
    {
      id: 'change-password',
      title: 'Change Password',
      description: 'Update your account password',
      icon: 'Lock',
      href: '/settings/profile#password',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification settings',
      icon: 'Bell',
      href: '/settings/notifications',
      color: 'from-green-500 to-green-600'
    }
  ],

  // Account status indicators
  ACCOUNT_STATUS: {
    VERIFIED: {
      label: 'Verified Account',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: 'CheckCircle'
    },
    UNVERIFIED: {
      label: 'Account Not Verified',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: 'AlertCircle'
    },
    SUSPENDED: {
      label: 'Account Suspended',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: 'XCircle'
    }
  },

  // Settings categories
  CATEGORIES: {
    PERSONAL: 'Personal',
    SECURITY: 'Security',
    PREFERENCES: 'Preferences',
    SUPPORT: 'Support'
  },

  // Notification types
  NOTIFICATION_TYPES: {
    EMAIL: 'Email',
    PUSH: 'Push',
    SMS: 'SMS',
    IN_APP: 'In-App'
  },

  // Privacy options
  PRIVACY_LEVELS: {
    PUBLIC: 'Public',
    FRIENDS: 'Friends Only',
    PRIVATE: 'Private'
  },

  // Theme options
  THEMES: {
    LIGHT: 'Light',
    DARK: 'Dark',
    AUTO: 'Auto'
  },

  // Language options
  LANGUAGES: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ],

  // Currency options
  CURRENCIES: [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
  ],

  // Security settings
  SECURITY_FEATURES: [
    {
      id: 'two-factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: false
    },
    {
      id: 'login-alerts',
      title: 'Login Alerts',
      description: 'Get notified when someone logs into your account',
      enabled: true
    },
    {
      id: 'session-timeout',
      title: 'Auto Logout',
      description: 'Automatically log out after period of inactivity',
      enabled: false
    }
  ],

  // Data management options
  DATA_OPTIONS: [
    {
      id: 'export-data',
      title: 'Export Account Data',
      description: 'Download a copy of your account information',
      icon: 'Download',
      action: 'export'
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      description: 'Permanently delete your account and all data',
      icon: 'Trash2',
      action: 'delete',
      danger: true
    }
  ],

  // Support options
  SUPPORT_OPTIONS: [
    {
      id: 'help-center',
      title: 'Help Center',
      description: 'Browse frequently asked questions and guides',
      icon: 'BookOpen',
      href: '/help'
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      description: 'Get in touch with our support team',
      icon: 'MessageSquare',
      href: '/support/contact'
    },
    {
      id: 'report-bug',
      title: 'Report a Bug',
      description: 'Help us improve by reporting issues',
      icon: 'Bug',
      href: '/support/bug-report'
    },
    {
      id: 'feature-request',
      title: 'Request a Feature',
      description: 'Suggest new features for the platform',
      icon: 'Lightbulb',
      href: '/support/feature-request'
    }
  ],

  // Form validation rules
  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBER: true,
      REQUIRE_SPECIAL: false
    },
    PHONE: {
      PATTERN: /^[\+]?[1-9][\d]{0,15}$/
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },

  // Loading states
  LOADING_STATES: {
    CARDS: 6,
    LIST_ITEMS: 8
  },

  // Error messages
  ERROR_MESSAGES: {
    LOAD_FAILED: 'Failed to load settings',
    SAVE_FAILED: 'Failed to save changes',
    NETWORK_ERROR: 'Network connection error',
    PERMISSION_DENIED: 'Permission denied',
    INVALID_INPUT: 'Please check your input and try again'
  },

  // Success messages
  SUCCESS_MESSAGES: {
    SETTINGS_SAVED: 'Settings saved successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
    ACCOUNT_UPDATED: 'Account updated successfully'
  },

  // Theme colors
  THEME_COLORS: {
    PRIMARY: '#009F9C',
    PRIMARY_DARK: '#007A77',
    SECONDARY: '#6B7280',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  }
} as const;

export type SettingsSection = typeof SETTINGS_CONSTANTS.SETTINGS_SECTIONS[number]['id'];
export type QuickAction = typeof SETTINGS_CONSTANTS.QUICK_ACTIONS[number]['id'];
export type NotificationType = keyof typeof SETTINGS_CONSTANTS.NOTIFICATION_TYPES;
export type PrivacyLevel = keyof typeof SETTINGS_CONSTANTS.PRIVACY_LEVELS;
export type Theme = keyof typeof SETTINGS_CONSTANTS.THEMES;
export type Language = typeof SETTINGS_CONSTANTS.LANGUAGES[number];
export type Currency = typeof SETTINGS_CONSTANTS.CURRENCIES[number];
