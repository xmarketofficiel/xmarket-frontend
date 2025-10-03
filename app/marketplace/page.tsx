'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import { api } from '../../lib/apiEndpoints';
import { Item } from '../../types';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useConditionalLoading, getOptimalSkeletonCount } from '../../hooks/useConditionalLoading';

// Components
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { SearchBar } from './components/SearchBar';
import { AdvancedFilterPanel } from './components/AdvancedFilterPanel';
import { CategoryFilter } from './components/CategoryFilter';
import { ViewControls } from './components/ViewControls';
import { FilterPanel } from './components/FilterPanel';
import { SearchResultsHeader } from './components/SearchResultsHeader';
import { EmptyState } from './components/EmptyState';
import { LoadMoreButton } from './components/LoadMoreButton';
import Feed from '../../components/Feed';

// Skeleton components
import { 
  SkeletonSearchBar, 
  SkeletonCategoryFilter, 
  SkeletonResultsCounter,
  SkeletonGrid 
} from '../../components/skeletons/SkeletonComponents';
import { MarketplaceGridSkeleton } from '../../components/skeletons/MarketplacePageSkeleton';

// Constants and Types
import { MARKETPLACE_CONFIG, CATEGORY_CONFIG } from './constants';
import type { 
  MarketplaceState, 
  SearchParams, 
  ViewMode, 
  SortOption, 
  PriceRange, 
  ConditionFilter 
} from './types';

/**
 * Marketplace Page - Optimized with clean component architecture
 * Features search, filtering, sorting, and infinite scroll
 */
export default function MarketplacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Clear add-item draft when accessing marketplace
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const draftExists = localStorage.getItem('add_item_draft');
      if (draftExists) {
        console.log('🧹 Cleaning up add-item draft from localStorage on marketplace page...');
        localStorage.removeItem('add_item_draft');
        console.log('✅ Add-item draft cleared from localStorage');
      }
    }
  }, [user]);

  // Consolidated state management
  const [state, setState] = useState<MarketplaceState>({
    items: [],
    totalItems: 0,
    currentPage: 1,
    page: 1,
    hasMore: true,
    loading: true,
    error: null,
    searchQuery: searchParams.get('search') || '',
    selectedCategory: searchParams.get('category') || MARKETPLACE_CONFIG.DEFAULT_CATEGORY,
    sortBy: 'newest',
    priceRange: 'all',
    conditionFilter: 'all',
    viewMode: MARKETPLACE_CONFIG.DEFAULT_VIEW_MODE,
    showFilters: false,
    showSortOptions: false,
    pendingSalesCount: 0,
    itemsPerPage: MARKETPLACE_CONFIG.ITEMS_PER_PAGE
  });

  // Enhanced filter state
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    condition: [] as string[],
    category: '',
    location: '',
    datePosted: '',
    rating: 0,
    tags: [] as string[]
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Categories list
  const [categories, setCategories] = useState<string[]>([]);

  /**
   * Update state helper function
   */
  const updateState = useCallback((updates: Partial<MarketplaceState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Load pending confirmations count for notifications
   * This should match what's shown in the pending confirmations page
   */
  const loadPendingSalesCount = useCallback(async () => {
    if (!user) {
      updateState({ pendingSalesCount: 0 });
      return;
    }

    try {
      // Get both pending confirmations (for seller) and user's purchases (for buyer)
      const [confirmationsResponse, purchasesResponse] = await Promise.all([
        api.items.getPendingConfirmations(),
        api.items.getMyPurchases()
      ]);
      
      const confirmationsData = (confirmationsResponse.data as any)?.data || confirmationsResponse.data || [];
      const purchasesData = (purchasesResponse.data as any)?.data || purchasesResponse.data || [];
      
      // Combine both - pending confirmations for seller role and pending purchases for buyer role
      const allPurchases = [...confirmationsData, ...purchasesData];
      
      // Filter for pending items only and remove duplicates
      const uniquePurchases = allPurchases
        .filter((purchase: any) => 
          purchase.status === 'pending' || 
          purchase.status === 'buyer_confirmed'
        )
        .filter((purchase: any, index: number, self: any[]) => 
          index === self.findIndex(p => p.id === purchase.id)
        );
      
      updateState({ 
        pendingSalesCount: uniquePurchases.length
      });
    } catch (error) {
      console.error('Error loading pending confirmations count:', error);
      updateState({ pendingSalesCount: 0 });
    }
  }, [user, updateState]);

  /**
   * Load categories
   */
  const loadCategories = useCallback(async () => {
    try {
      console.log('🔍 Loading categories from backend endpoint: /categories');
      const response = await api.items.getCategories();
      console.log('📋 Raw categories response:', response);
      console.log('📋 Response data type:', typeof response.data);
      console.log('📋 Response data length:', Array.isArray(response.data) ? response.data.length : 'Not an array');
      
      // Handle nested response structure: response.data.data contains the actual categories array
      const responseData = response.data as any;
      const categoryList = (responseData && responseData.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []);
      console.log('📦 Category list:', categoryList);
      
      if (Array.isArray(categoryList) && categoryList.length > 0) {
        // Extract just the names for the filter, but keep full objects for reference
        const categoryNames = categoryList.map((cat: any) => {
          // Handle both formats: object with name property or direct string
          if (typeof cat === 'object' && cat.name) {
            return cat.name;
          }
          return cat;
        });
        console.log(`✅ Processed ${categoryNames.length} category names:`, categoryNames);
        setCategories(categoryNames);
      } else {
        console.warn('⚠️ No categories returned from backend. This usually means:');
        console.warn('   1. Backend server is not running');
        console.warn('   2. Database has no categories');
        console.warn('   3. API endpoint issue');
        console.warn('   Using comprehensive fallback categories...');
        
        // Use a comprehensive set of fallback categories based on our backend seed data
        const fallbackCategories = [
          'Electronics',
          'Books', 
          'Clothing',
          'Furniture',
          'Sports',
          'Transportation',
          'Health & Beauty',
          'Art & Crafts',
          'Music & Instruments',
          'Home & Garden',
          'Toys & Games',
          'Pet Supplies',
          'Office Supplies',
          'Food & Beverages',
          'Services',
          'Other'
        ];
        
        console.log(`📦 Using ${fallbackCategories.length} fallback categories:`, fallbackCategories);
        setCategories(fallbackCategories);
      }
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
      
      // Check if it's a network error (backend not running)
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('Network'))) {
        console.error('🚨 Backend server might not be running. Please start the backend server.');
      }
      
      // Minimal fallback to prevent hanging
      setCategories(['Electronics', 'Books', 'Furniture', 'Clothing']);
    }
  }, []); // Remove all dependencies to prevent loops

  // Debug functions for development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).seedCategories = async () => {
      try {
        console.log('🌱 Seeding categories...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/categories/seed`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log('✅ Categories seeded:', data);
        // Reload categories after seeding
        loadCategories();
        return data;
      } catch (error) {
        console.error('❌ Failed to seed categories:', error);
      }
    };
    
    (window as any).refreshCategories = () => {
      console.log('🔄 Refreshing categories...');
      loadCategories();
    };
    
    (window as any).checkCurrentCategories = () => {
      console.log('📋 Current categories state:', categories);
      return categories;
    };
    
    (window as any).testCategoryEndpoints = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      console.log('🧪 Testing category endpoints...');
      
      // Test /categories endpoint
      try {
        console.log('Testing /categories...');
        const categoriesResponse = await fetch(`${baseUrl}/categories`);
        const categoriesData = await categoriesResponse.json();
        console.log('✅ /categories response:', categoriesData);
      } catch (error) {
        console.error('❌ /categories failed:', error);
      }
      
      // Test /items/categories endpoint
      try {
        console.log('Testing /items/categories...');
        const itemsCategoriesResponse = await fetch(`${baseUrl}/items/categories`);
        const itemsCategoriesData = await itemsCategoriesResponse.json();
        console.log('✅ /items/categories response:', itemsCategoriesData);
      } catch (error) {
        console.error('❌ /items/categories failed:', error);
      }
      
      // Test using our API function
      try {
        console.log('Testing api.items.getCategories()...');
        const apiResponse = await api.items.getCategories();
        console.log('✅ api.items.getCategories() response:', apiResponse);
      } catch (error) {
        console.error('❌ api.items.getCategories() failed:', error);
      }
    };
  }

  /**
   * Build search parameters for API call
   */
  const buildSearchParams = useCallback((): SearchParams => {
    const params: SearchParams = {
      page: state.currentPage,
      limit: state.itemsPerPage
    };

    if (state.searchQuery.trim()) {
      params.search = state.searchQuery;
    }

    if (state.selectedCategory && state.selectedCategory !== 'all') {
      params.category = state.selectedCategory;
    }

    if (state.sortBy !== 'newest') {
      params.sortBy = state.sortBy;
    }

    if (state.priceRange !== 'all') {
      const priceConfig = {
        'under-25': { min: 0, max: 25 },
        '25-50': { min: 25, max: 50 },
        '50-100': { min: 50, max: 100 },
        '100-250': { min: 100, max: 250 },
        'over-250': { min: 250, max: Infinity }
      };
      const range = priceConfig[state.priceRange as keyof typeof priceConfig];
      if (range) {
        params.minPrice = range.min;
        if (range.max !== Infinity) {
          params.maxPrice = range.max;
        }
      }
    }

    if (state.conditionFilter !== 'all') {
      params.condition = state.conditionFilter;
    }

    return params;
  }, [
    state.currentPage,
    state.itemsPerPage,
    state.searchQuery,
    state.selectedCategory,
    state.sortBy,
    state.priceRange,
    state.conditionFilter
  ]); // Specific dependencies instead of entire state

  /**
   * Load items with current filters
   */
  const loadItems = useCallback(async (page: number = 1, replaceItems: boolean = true) => {
    updateState({ loading: true, error: null });

    try {
      const params = buildSearchParams();
      params.page = page;

      const response = await api.items.getItems(params);
      
      // Handle the new wrapped response format: {success: true, data: {items: [...], total: 5, hasMore: false}}
      const responseData = (response.data as any)?.data || response.data || {};
      const pageItems = responseData.items || [];
      const total = responseData.total || 0;

      updateState({
        totalItems: total,
        hasMore: responseData.hasMore || false,
        currentPage: page
      });

      if (replaceItems) {
        updateState({ items: pageItems });
      } else {
        // Infinite scroll: append new items with deduplication
        setState(prev => {
          const existingIds = new Set(prev.items.map(item => item.id));
          const newItems = pageItems.filter((item: Item) => !existingIds.has(item.id));
          return {
            ...prev,
            items: [...prev.items, ...newItems]
          };
        });
      }
    } catch (error: any) {
      console.error('Failed to load items:', error);
      updateState({ 
        error: error.message || 'Failed to load items',
        items: replaceItems ? [] : state.items
      });
    } finally {
      updateState({ loading: false });
    }
  }, [buildSearchParams, updateState, state.items]);

  /**
   * Handle search query change
   */
  const handleSearchChange = useCallback((query: string) => {
    updateState({ searchQuery: query, currentPage: 1 });
  }, [updateState]);

  /**
   * Handle category change
   */
  const handleCategoryChange = useCallback((category: string) => {
    updateState({ selectedCategory: category, currentPage: 1 });
  }, [updateState]);

  /**
   * Handle filter changes
   */
  const handleSortChange = useCallback((sort: SortOption) => {
    updateState({ sortBy: sort, currentPage: 1 });
  }, [updateState]);

  const handlePriceRangeChange = useCallback((range: PriceRange) => {
    updateState({ priceRange: range, currentPage: 1 });
  }, [updateState]);

  const handleConditionChange = useCallback((condition: ConditionFilter) => {
    updateState({ conditionFilter: condition, currentPage: 1 });
  }, [updateState]);

  /**
   * Handle view mode change
   */
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    updateState({ viewMode: mode });
    // Save preference to localStorage
    localStorage.setItem('marketplace-view-mode', mode);
  }, [updateState]);

  /**
   * Handle load more
   */
  const handleLoadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      loadItems(state.currentPage + 1, false);
    }
  }, [state.loading, state.hasMore, state.currentPage, loadItems]);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    updateState({
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'newest',
      priceRange: 'all',
      conditionFilter: 'all',
      currentPage: 1
    });
  }, [updateState]);

  /**
   * Handle notification click
   */
  /**
   * Refresh data
   */
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      loadItems(1, true),
      loadPendingSalesCount(),
      loadCategories()
    ]);
  }, [loadItems, loadPendingSalesCount, loadCategories]);

  // Initialize data on mount
  useEffect(() => {
    loadCategories();
    loadPendingSalesCount();
    
    // Load saved view mode preference
    const savedViewMode = localStorage.getItem('marketplace-view-mode') as ViewMode;
    if (savedViewMode && ['grid', 'list'].includes(savedViewMode)) {
      updateState({ viewMode: savedViewMode });
    }
  }, [loadCategories, loadPendingSalesCount, updateState]);

  // Load initial items once categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      loadItems(1, true);
    }
  }, [categories, loadItems]);

  // Load items when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadItems(1, true);
    }, state.searchQuery ? MARKETPLACE_CONFIG.SEARCH_DEBOUNCE_MS : 0);

    return () => clearTimeout(timeoutId);
  }, [
    state.searchQuery, 
    state.selectedCategory, 
    state.sortBy, 
    state.priceRange, 
    state.conditionFilter,
    loadItems
  ]);

  // Pull to refresh
  usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: MARKETPLACE_CONFIG.PULL_TO_REFRESH_THRESHOLD
  });

  // Smart loading management
  const { showSkeleton } = useConditionalLoading(
    state.loading, 
    state.items.length > 0
  );

  // Memoized computed values
  const isEmpty = useMemo(() => 
    !state.loading && state.items.length === 0, [state.loading, state.items.length]
  );

  const isSearching = useMemo(() => 
    state.searchQuery.length >= MARKETPLACE_CONFIG.MIN_SEARCH_LENGTH, [state.searchQuery]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <MarketplaceHeader
          user={user}
          searchQuery={state.searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={(query) => {
            handleSearchChange(query);
            loadItems(1, true);
          }}
          showFilters={showAdvancedFilters}
          onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
        {/* Category Filter - with brief sticky behavior */}
        {categories.length === 0 ? (
          <SkeletonCategoryFilter />
        ) : (
          <CategoryFilter
            categories={categories}
            selectedCategory={state.selectedCategory}
            onChange={handleCategoryChange}
            loading={!categories.length && showSkeleton}
          />
        )}

        {/* Results Counter */}
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {showSkeleton ? (
                <SkeletonResultsCounter />
              ) : (
                <span>
                  <span className="font-semibold text-gray-900">{state.totalItems.toLocaleString()}</span>{' '}
                  <span>
                    {state.totalItems === 1 ? 'item' : 'items'}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {/* Filter Panel */}
        <FilterPanel
          isOpen={state.showFilters}
          onClose={() => updateState({ showFilters: false })}
          sortBy={state.sortBy}
          onSortChange={handleSortChange}
          priceRange={state.priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          conditionFilter={state.conditionFilter}
          onConditionChange={handleConditionChange}
          onClearFilters={handleClearFilters}
        />

        {/* Search Results Header */}
        <SearchResultsHeader
          searchQuery={state.searchQuery}
          totalResults={state.totalItems}
          onClearSearch={() => handleSearchChange('')}
          loading={state.loading}
        />

        {/* Content Area */}
        <div className="px-4 pt-4 pb-6">
          {/* Error State */}
          {state.error && (
            <EmptyState
              type="error"
              onAction={() => loadItems(1, true)}
            />
          )}

          {/* Loading State */}
          {showSkeleton && (
            <MarketplaceGridSkeleton count={getOptimalSkeletonCount(state.items.length > 0)} />
          )}

          {/* Empty State */}
          {isEmpty && !state.error && (
            <EmptyState
              type={isSearching ? "noItems" : "noSearch"}
              searchQuery={state.searchQuery}
              selectedCategory={state.selectedCategory}
              onAction={handleClearFilters}
            />
          )}

          {/* Items Grid */}
          {state.items.length > 0 && (
            <>
              <Feed
                items={state.items}
                loading={state.loading}
                onLoadMore={handleLoadMore}
                hasMore={state.hasMore}
              />
              
              <LoadMoreButton
                hasMore={state.hasMore}
                loading={state.loading}
                onClick={handleLoadMore}
                itemsShown={state.items.length}
                totalItems={state.totalItems}
              />
            </>
          )}
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        onApplyFilters={() => {
          // Apply advanced filters logic here
          
          loadItems(1, true);
        }}
        onClearFilters={() => {
          setAdvancedFilters({
            priceRange: [0, 1000],
            condition: [],
            category: '',
            location: '',
            datePosted: '',
            rating: 0,
            tags: []
          });
          loadItems(1, true);
        }}
      />
      </div>
  );
}
