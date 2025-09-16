'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import { api } from '../../lib/apiEndpoints';
import { Item } from '../../types';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

// Components
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { EnhancedSearchBar } from './components/EnhancedSearchBar';
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

  // Consolidated state management
  const [state, setState] = useState<MarketplaceState>({
    items: [],
    totalItems: 0,
    currentPage: 1,
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
   * Load pending sales count for notifications
   */
  const loadPendingSalesCount = useCallback(async () => {
    if (!user) {
      updateState({ pendingSalesCount: 0 });
      return;
    }

    try {
      const response = await api.items.getPendingSales();
      const pendingSales = response.data || [];
      updateState({ 
        pendingSalesCount: Array.isArray(pendingSales) ? pendingSales.length : 0 
      });
    } catch (error) {
      updateState({ pendingSalesCount: 0 });
    }
  }, [user]); // Only depend on user, not updateState

  /**
   * Load categories
   */
  const loadCategories = useCallback(async () => {
    try {
      console.log('🔄 Loading categories from API...');
      const response = await api.categories.getCategories();
      console.log('📦 Categories API response:', response);
      
      // Backend returns full category objects with id, name, icon, description
      const categoryList = response.data || [];
      console.log('📋 Category list:', categoryList);
      
      if (Array.isArray(categoryList) && categoryList.length > 0) {
        // Extract just the names for the filter, but keep full objects for reference
        const categoryNames = categoryList.map((cat: any) => {
          // Handle both formats: object with name property or direct string
          if (typeof cat === 'object' && cat.name) {
            return cat.name;
          }
          return cat;
        });
        console.log('✅ Setting categories:', categoryNames);
        setCategories(categoryNames);
      } else {
        console.log('⚠️ No categories from API, using fallback');
        // Fallback to predefined categories
        const fallbackCategories = Object.keys(CATEGORY_CONFIG).filter(cat => cat !== 'all');
        setCategories(fallbackCategories);
        console.log('📋 Fallback categories:', fallbackCategories);
      }
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
      // Fallback to predefined categories from CATEGORY_CONFIG
      const fallbackCategories = Object.keys(CATEGORY_CONFIG).filter(cat => cat !== 'all');
      setCategories(fallbackCategories);
      console.log('🔄 Using fallback categories after error:', fallbackCategories);
    }
  }, []); // Remove all dependencies to prevent loops

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
    console.log('🔄 Loading items - Page:', page, 'Replace:', replaceItems);
    updateState({ loading: true, error: null });

    try {
      const params = buildSearchParams();
      params.page = page;
      console.log('📝 Search params:', params);

      const response = await api.items.getItems(params);
      console.log('📦 Items API response:', response);
      
      const pageItems = response.data?.items || response.data || [];
      const total = response.data?.total || 0;
      console.log('📋 Items loaded:', pageItems.length, 'Total:', total);

      updateState({
        totalItems: total,
        hasMore: response.data?.hasMore || false,
        currentPage: page
      });

      if (replaceItems) {
        updateState({ items: pageItems });
      } else {
        // Infinite scroll: append new items with deduplication
        setState(prev => {
          const existingIds = new Set(prev.items.map(item => item.id));
          const newItems = pageItems.filter((item: Item) => !existingIds.has(item.id));
          console.log('🔄 Appending items:', newItems.length);
          return {
            ...prev,
            items: [...prev.items, ...newItems]
          };
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to load items:', error);
      updateState({ 
        error: error.message || 'Failed to load items',
        items: replaceItems ? [] : state.items
      });
    } finally {
      updateState({ loading: false });
    }
  }, [buildSearchParams]); // Only depend on buildSearchParams, not updateState or state.items

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
  const handleNotificationClick = useCallback(() => {
    router.push('/profile/pending-sales');
  }, [router]);

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
  }, []); // Empty dependency array - only run on mount

  // Load initial items once categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      loadItems(1, true);
    }
  }, [categories]); // Load items when categories are available

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
    state.conditionFilter
  ]); // Removed loadItems from dependencies

  // Pull to refresh
  usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: MARKETPLACE_CONFIG.PULL_TO_REFRESH_THRESHOLD
  });

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
          pendingSalesCount={state.pendingSalesCount}
          onNotificationClick={handleNotificationClick}
        />

        {/* Enhanced Search Bar */}
        <div className="bg-gray-50 px-4 py-4">
          {categories.length === 0 ? (
            <SkeletonSearchBar />
          ) : (
            <EnhancedSearchBar
              searchQuery={state.searchQuery}
              onSearchChange={handleSearchChange}
              onSearch={(query) => {
                handleSearchChange(query);
                loadItems(1, true);
              }}
              showFilters={showAdvancedFilters}
              onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
              placeholder="Search items, categories, or sellers..."
            />
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Category Filter - with brief sticky behavior */}
        {categories.length === 0 ? (
          <SkeletonCategoryFilter />
        ) : (
          <CategoryFilter
            categories={categories}
            selectedCategory={state.selectedCategory}
            onChange={handleCategoryChange}
            loading={!categories.length}
          />
        )}

        {/* Results Counter */}
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {state.loading && state.items.length === 0 ? (
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
          {state.loading && state.items.length === 0 && (
            <div className="px-4 pt-4">
              <SkeletonGrid count={8} />
            </div>
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
          console.log('Applied filters:', advancedFilters);
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
