// Item Detail Page Types

import { ReactNode } from 'react';

// Core item types
export interface ItemDetailData {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ItemCondition;
  category: string;
  subcategory?: string;
  images: ItemImage[];
  seller: SellerInfo;
  location: string;
  postedDate: string;
  views: number;
  interests: number;
  isActive: boolean;
  tags?: string[];
  features?: ItemFeature[];
  specifications?: Record<string, string>;
  availability: AvailabilityStatus;
}

export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair';

export type AvailabilityStatus = 'available' | 'pending' | 'sold' | 'inactive';

export interface ItemImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  width?: number;
  height?: number;
  cloudinaryPublicId?: string;
}

export interface ItemFeature {
  id: string;
  name: string;
  value: string | boolean;
  type: 'text' | 'boolean' | 'number';
  category?: string;
}

export interface SellerInfo {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  memberSince: string;
  responseTime?: string;
  isVerified: boolean;
  isOnline?: boolean;
  lastSeen?: string;
}

// User interaction types
export interface UserInteraction {
  isFavorited: boolean;
  hasShownInterest: boolean;
  canMessage: boolean;
  canEdit: boolean;
  canReport: boolean;
}

export interface InterestData {
  id: string;
  userId: string;
  itemId: string;
  message?: string;
  createdAt: string;
  status: 'active' | 'withdrawn' | 'accepted' | 'declined';
}

// Component prop types
export interface ItemDetailPageProps {
  itemId: string;
  initialItem?: ItemDetailData;
}

export interface ItemGalleryProps {
  images: ItemImage[];
  title: string;
  onImageClick?: (index: number) => void;
  className?: string;
}

export interface ItemInfoProps {
  item: ItemDetailData;
  className?: string;
}

export interface ItemActionsProps {
  item: ItemDetailData;
  userInteraction: UserInteraction;
  onInterestClick: () => Promise<void>;
  onFavoriteClick: () => Promise<void>;
  onMessageClick: () => void;
  onShareClick: () => void;
  onReportClick: () => void;
  isLoading?: {
    interest?: boolean;
    favorite?: boolean;
  };
  className?: string;
}

export interface SellerCardProps {
  seller: SellerInfo;
  onMessageClick: () => void;
  onViewProfile: () => void;
  className?: string;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemDetailData;
}

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemDetailData;
  onSubmit: (reason: string, details: string) => Promise<void>;
}

export interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ItemImage[];
  initialIndex: number;
}

// Form types
export interface ReportFormData {
  reason: string;
  details: string;
  userEmail?: string;
}

export interface InterestFormData {
  message?: string;
  contactMethod?: 'message' | 'phone' | 'email';
}

// API response types
export interface ItemDetailResponse {
  success: boolean;
  data: ItemDetailData;
  userInteraction: UserInteraction;
  relatedItems?: ItemSummary[];
}

export interface ItemSummary {
  id: string;
  title: string;
  price: number;
  condition: ItemCondition;
  primaryImage?: string;
  location: string;
  postedDate: string;
}

export interface InterestResponse {
  success: boolean;
  message: string;
  interestId?: string;
}

export interface FavoriteResponse {
  success: boolean;
  isFavorited: boolean;
  favoriteCount?: number;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  reportId?: string;
}

// State management types
export interface ItemDetailState {
  item: ItemDetailData | null;
  userInteraction: UserInteraction;
  loading: {
    item: boolean;
    interest: boolean;
    favorite: boolean;
    report: boolean;
  };
  modals: {
    share: boolean;
    report: boolean;
    imageViewer: boolean;
    imageViewerIndex: number;
    purchase: boolean;
  };
  error: string | null;
}

export interface ItemDetailActions {
  loadItem: (itemId: string) => Promise<void>;
  toggleFavorite: () => Promise<void>;
  addInterest: (data?: InterestFormData) => Promise<void>;
  submitReport: (data: ReportFormData) => Promise<void>;
  shareItem: (platform: string) => Promise<void>;
  openModal: (modal: keyof ItemDetailState['modals'], data?: any) => void;
  closeModal: (modal: keyof ItemDetailState['modals']) => void;
  clearError: () => void;
}

// Hook types
export interface UseItemDetailReturn {
  state: ItemDetailState;
  actions: ItemDetailActions;
}

export interface UseImageGalleryReturn {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  nextImage: () => void;
  prevImage: () => void;
  isModalOpen: boolean;
  openModal: (index: number) => void;
  closeModal: () => void;
}

// Utility types
export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface SharePlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  getUrl: (item: ItemDetailData) => string;
}

export interface ReportReason {
  id: string;
  label: string;
  description: string;
}

// Animation types
export interface AnimationVariant {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
    };
  };
}

// Event types
export interface ItemDetailEvent {
  type: string;
  itemId: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// Loading states
export interface LoadingStates {
  item: boolean;
  interest: boolean;
  favorite: boolean;
  report: boolean;
  images: boolean;
}

// Error types
export interface ItemDetailError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
}

// Accessibility types
export interface A11yProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

// Performance types
export interface PerformanceMetrics {
  loadTime: number;
  imageLoadTime: number;
  interactionTime: number;
  renderTime: number;
}

// Configuration types
export interface ItemDetailConfig {
  maxImages: number;
  imageQuality: number;
  animationDuration: number;
  debounceMs: number;
  retryAttempts: number;
  cacheTimeout: number;
}
