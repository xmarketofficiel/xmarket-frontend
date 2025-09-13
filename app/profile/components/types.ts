import { User } from '../../../types';
import { PROFILE_CONSTANTS, ProfileTab, ActivityType, NotificationType } from './constants';

// Re-export the types from constants
export type { ProfileTab, ActivityType, NotificationType };

// User profile with extended stats
export interface ExtendedUser extends User {
  activeListingsCount?: number;
  soldItemsCount?: number;
  purchaseHistoryCount?: number;
  savedItemsCount?: number;
  pendingSalesCount?: number;
  viewedItemsCount?: number;
  notificationsCount?: number;
  totalEarnings?: number;
  totalSpent?: number;
  averageRating?: number;
  responseTime?: number;
  joinedDate?: string;
  lastActive?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  preferredCategories?: string[];
  activityScore?: number;
  // Additional UI properties
  coverImage?: string;
  location?: string;
  bio?: string;
  privacy?: {
    showSoldItems: boolean;
    showPurchases: boolean;
    showProfile: boolean;
    showActivity: boolean;
  };
}

// Profile item for listings, purchases, etc.
export interface ProfileItem {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  status: 'active' | 'sold' | 'pending' | 'draft' | 'expired';
  createdAt: string;
  updatedAt: string;
  viewsCount?: number;
  savesCount?: number;
  interestedBuyers?: number;
  seller?: {
    id: string;
    fullName: string;
    profilePicture?: string;
  };
  buyer?: {
    id: string;
    fullName: string;
    profilePicture?: string;
  };
  location?: string;
  negotiable?: boolean;
  featured?: boolean;
}

// Profile activity
export interface ProfileActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  itemId?: string;
  itemTitle?: string;
  itemImage?: string;
  amount?: number;
  metadata?: Record<string, any>;
}

// Profile notification
export interface ProfileNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  itemId?: string;
  fromUser?: {
    id: string;
    fullName: string;
    profilePicture?: string;
  };
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Profile stats
export interface ProfileStats {
  activeListingsCount: number;
  soldItemsCount: number;
  purchaseHistoryCount: number;
  savedItemsCount: number;
  pendingSalesCount: number;
  viewedItemsCount: number;
  notificationsCount: number;
  totalEarnings: number;
  totalSpent: number;
  averageRating: number;
  responseTime: number; // in hours
  successfulTransactions: number;
  profileViews: number;
  totalViews: number;
  conversionRate: number; // percentage
}

// Profile data structure
export interface ProfileData {
  user: ExtendedUser;
  stats: ProfileStats;
  recentActivity: ProfileActivity[];
  notifications: ProfileNotification[];
  items: {
    [K in ProfileTab]?: ProfileItem[];
  };
  pagination: {
    [K in ProfileTab]?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasMore: boolean;
    };
  };
}

// API responses
export interface ProfileResponse {
  success: boolean;
  data: ProfileData;
  message?: string;
}

export interface ProfileItemsResponse {
  success: boolean;
  data: {
    items: ProfileItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasMore: boolean;
    };
  };
  message?: string;
}

export interface ProfileActivityResponse {
  success: boolean;
  data: {
    activities: ProfileActivity[];
    hasMore: boolean;
  };
  message?: string;
}

export interface ProfileNotificationsResponse {
  success: boolean;
  data: {
    notifications: ProfileNotification[];
    unreadCount: number;
    hasMore: boolean;
  };
  message?: string;
}

// Component props
export interface ProfileHeaderProps {
  user: ExtendedUser;
  isOwner: boolean;
  onEditProfile?: () => void;
  onMessageUser?: () => void;
  loading?: boolean;
}

export interface ProfileStatsProps {
  stats: ProfileStats;
  loading?: boolean;
  compact?: boolean;
}

export interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  stats: ProfileStats;
  loading?: boolean;
}

export interface ProfileContentProps {
  activeTab: ProfileTab;
  items: ProfileItem[];
  loading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onItemClick?: (item: ProfileItem) => void;
  onItemAction?: (action: string, item: ProfileItem) => void;
}

export interface ProfileItemCardProps {
  item: ProfileItem;
  onClick?: (item: ProfileItem) => void;
  onAction?: (action: string, item: ProfileItem) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface ProfileQuickActionsProps {
  onAction: (actionId: string) => void;
  loading?: boolean;
}

export interface ProfileActivityProps {
  activities: ProfileActivity[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface ProfileNotificationsProps {
  notifications: ProfileNotification[];
  loading?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: ProfileNotification) => void;
}

// Form types
export interface ProfileEditForm {
  fullName: string;
  whatsappNumber: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  coverImage?: string;
  privacy: {
    showSoldItems: boolean;
    showPurchases: boolean;
    showProfile: boolean;
    showActivity: boolean;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    newsletterSubscription: boolean;
  };
}

// Filter and sort options
export interface ProfileFilters {
  status?: string[];
  category?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    from: string;
    to: string;
  };
  searchQuery?: string;
}

export interface ProfileSortOptions {
  field: 'createdAt' | 'updatedAt' | 'price' | 'title' | 'viewsCount';
  direction: 'asc' | 'desc';
}

// Hook return types
export interface UseProfileReturn {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
  activeTab: ProfileTab;
  refreshProfile: () => Promise<void>;
  setActiveTab: (tab: ProfileTab) => void;
  loadMoreItems: (tab: ProfileTab) => Promise<void>;
  updateProfile: (data: Partial<ProfileEditForm>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  saveItem: (itemId: string) => Promise<void>;
  unsaveItem: (itemId: string) => Promise<void>;
}

export interface UseProfileNotificationsReturn {
  notifications: ProfileNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

// Analytics events
export interface ProfileAnalyticsEvent {
  event: string;
  userId: string;
  tab?: ProfileTab;
  itemId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

// Error types
export interface ProfileError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// Loading states
export interface ProfileLoadingState {
  profile: boolean;
  items: boolean;
  stats: boolean;
  activities: boolean;
  notifications: boolean;
  actions: {
    [key: string]: boolean;
  };
}

// Theme configuration
export interface ProfileTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
