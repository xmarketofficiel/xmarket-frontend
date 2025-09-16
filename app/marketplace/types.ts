// Marketplace Page Type Definitions

import { Item } from '../../types';

export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular' | 'alphabetical';
export type PriceRange = 'all' | 'under-25' | '25-50' | '50-100' | '100-250' | 'over-250';
export type ConditionFilter = 'all' | 'New' | 'Like New' | 'Good' | 'Fair';

// Main marketplace state
export interface MarketplaceState {
  // Items and pagination
  items: Item[];
  totalItems: number;
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  
  // Search and filters
  searchQuery: string;
  selectedCategory: string;
  sortBy: SortOption;
  priceRange: PriceRange;
  conditionFilter: ConditionFilter;
  
  // UI state
  viewMode: ViewMode;
  showFilters: boolean;
  showSortOptions: boolean;
  
  // Notifications
  pendingSalesCount: number;
  
  // Performance
  itemsPerPage: number;
}

// Search parameters for API calls
export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  condition?: ConditionFilter;
}

// Category configuration
export interface CategoryConfig {
  name: string;
  icon: string;
  color: string;
  description: string;
}

// Filter option types
export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
}

export interface PriceRangeOption extends FilterOption {
  min: number;
  max: number;
}

export interface SortOptionInterface extends FilterOption {
  value: SortOption;
}

// View mode configuration
export interface ViewModeConfig {
  name: string;
  icon: string;
  description: string;
  itemsPerRow: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// Empty state configuration
export interface EmptyStateConfig {
  title: string;
  description: string;
  icon: string;
  action?: string;
}

// Component Props Interfaces
export interface MarketplaceHeaderProps {
  user: any;
  pendingSalesCount: number;
  onNotificationClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  suggestions?: string[];
  loading?: boolean;
}

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
  loading?: boolean;
}

export interface ViewControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  itemCount: number;
  loading?: boolean;
}

export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  conditionFilter: ConditionFilter;
  onConditionChange: (condition: ConditionFilter) => void;
  onClearFilters: () => void;
}

export interface ItemGridProps {
  items: Item[];
  viewMode: ViewMode;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onItemClick: (item: Item) => void;
}

export interface ItemCardProps {
  item: Item;
  viewMode: ViewMode;
  onClick: () => void;
  loading?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
  loading?: boolean;
}

export interface SearchResultsHeaderProps {
  searchQuery: string;
  totalResults: number;
  onClearSearch: () => void;
  loading?: boolean;
}

export interface EmptyStateProps {
  type: 'noItems' | 'noSearch' | 'loading' | 'error';
  searchQuery?: string;
  selectedCategory?: string;
  onAction?: () => void;
}

export interface LoadMoreButtonProps {
  hasMore: boolean;
  loading: boolean;
  onClick: () => void;
  itemsShown: number;
  totalItems: number;
}

// Hook interfaces
export interface UseMarketplaceParams {
  initialCategory?: string;
  initialSearch?: string;
  itemsPerPage?: number;
}

export interface UseMarketplaceReturn {
  state: MarketplaceState;
  actions: {
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string) => void;
    setSortBy: (sort: SortOption) => void;
    setPriceRange: (range: PriceRange) => void;
    setConditionFilter: (condition: ConditionFilter) => void;
    setViewMode: (mode: ViewMode) => void;
    toggleFilters: () => void;
    loadMore: () => void;
    refresh: () => void;
    clearFilters: () => void;
  };
}

export interface UseInfiniteScrollParams {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export interface UsePullToRefreshParams {
  onRefresh: () => Promise<void>;
  threshold?: number;
  enabled?: boolean;
}

// API Response types
export interface MarketplaceApiResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export interface CategoryApiResponse {
  categories: Array<{
    id: string;
    name: string;
    count: number;
    icon?: string;
  }>;
}

// Analytics event types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

// Performance monitoring
export interface PerformanceMetrics {
  loadTime: number;
  itemsRendered: number;
  searchLatency: number;
  scrollPerformance: number;
  memoryUsage?: number;
}

// Error types
export interface MarketplaceError {
  type: 'network' | 'server' | 'validation' | 'unknown';
  message: string;
  code?: string | number;
  retryable: boolean;
}

// Local storage types
export interface MarketplacePreferences {
  viewMode: ViewMode;
  itemsPerPage: number;
  defaultSort: SortOption;
  recentSearches: string[];
  favoriteCategories: string[];
}
