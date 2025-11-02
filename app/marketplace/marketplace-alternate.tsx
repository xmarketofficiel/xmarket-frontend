/**
 * Optimized Marketplace Page - Code Split Version
 * 
 * This version splits the original 653-line marketplace page into
 * lazy-loaded sections for better performance and bundle splitting:
 * 
 * - SearchSection (~80 lines) - Search bar, filters, view controls
 * - ResultsSection (~120 lines) - Results grid, empty states, load more
 * - AdvancedFilterPanel (~200 lines) - Advanced filtering modal
 * 
 * Main benefits:
 * - Faster initial page load 
 * - Better Core Web Vitals (LCP, FID)
 * - Reduced bundle size for users who don't use advanced filters
 * - Progressive enhancement for complex features
 */

'use client';

import { useState, useEffect, useCallback, useMemo, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import { api } from '../../lib/apiEndpoints';
import { Item } from '../../types';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

// Import non-critical components dynamically
const MarketplaceSearchSection = dynamic(
  () => import('./components/MarketplaceSearchSection').then(mod => ({ default: mod.MarketplaceSearchSection })),
  {
    loading: () => (
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-12 w-full" />
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-10 w-full" />
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded h-8 w-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
);

const MarketplaceResultsSection = dynamic(
  () => import('./components/MarketplaceResultsSection').then(mod => ({ default: mod.MarketplaceResultsSection })),
  {
    loading: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-[4/5]" />
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
);

const AdvancedFilterPanel = dynamic(
  () => import('./components/AdvancedFilterPanel').then(mod => ({ default: mod.AdvancedFilterPanel })),
  {
    loading: () => null,
    ssr: false
  }
);

// Import types
import type { 
  MarketplaceState, 
  SearchParams as MarketplaceSearchParams, 
  ViewMode, 
  SortOption, 
  PriceRange, 
  ConditionFilter 
} from './types';

import { MARKETPLACE_CONFIG, FILTER_OPTIONS } from './constants';

export default function OptimizedMarketplacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // State management
  const [state, setState] = useState<MarketplaceState>({
    items: [],
    loading: true,
    hasMore: true,
    totalItems: 0,
    page: 1,
    currentPage: 1,
    searchQuery: '',
    selectedCategory: 'all',
    viewMode: 'grid' as ViewMode,
    sortBy: 'newest' as SortOption,
    priceRange: 'all' as PriceRange,
    conditionFilter: 'all' as ConditionFilter,
    error: null,
    showFilters: false,
    showSortOptions: false,
    pendingSalesCount: 0,
    itemsPerPage: MARKETPLACE_CONFIG.ITEMS_PER_PAGE
  });

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
  const [categories, setCategories] = useState<string[]>([]);
  
  // Prevent concurrent loadItems calls
  const loadItemsInProgress = useRef(false);

  // Clear add-item draft when accessing marketplace
  useEffect(() => {
    localStorage.removeItem('addItemDraft');
  }, []);

  // Initialize from URL parameters
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const sort = (searchParams.get('sort') as SortOption) || 'newest';
    
    setState(prev => ({
      ...prev,
      searchQuery: search,
      selectedCategory: category,
      sortBy: sort
    }));
  }, [searchParams]);

  // Load initial data
  useEffect(() => {
    const initializeMarketplace = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));

        // Load categories and items in parallel
        const [categoriesResponse, itemsResponse] = await Promise.all([
          api.items.getCategories(),
          loadItems(1, true)
        ]);

        if (categoriesResponse?.data) {
          setCategories(categoriesResponse.data.map((cat: any) => cat.name || cat));
        }

      } catch (error) {
        console.error('Failed to initialize marketplace:', error);
      }
    };

    initializeMarketplace();
  }, []);

  // Load items function
  const loadItems = useCallback(async (page: number = 1, reset: boolean = false) => {
    // Prevent concurrent calls
    if (loadItemsInProgress.current) {
      return;
    }
    
    try {
      loadItemsInProgress.current = true;
      
      if (!reset) {
        setState(prev => ({ ...prev, loading: true }));
      }

      // Resolve numeric min/max from priceRange which may be a predefined string or numeric tuple
      let minPrice: number | undefined;
      let maxPrice: number | undefined;

      if (Array.isArray(state.priceRange)) {
        minPrice = state.priceRange[0] > 0 ? state.priceRange[0] : undefined;
        maxPrice = state.priceRange[1] < 1000 ? state.priceRange[1] : undefined;
      } else {
        const pr = FILTER_OPTIONS.priceRanges.find(p => p.value === state.priceRange);
        if (pr) {
          minPrice = pr.min > 0 && Number.isFinite(pr.min) ? pr.min : undefined;
          maxPrice = pr.max < Infinity ? pr.max : undefined;
        }
      }

      const params: MarketplaceSearchParams = {
        page,
        limit: MARKETPLACE_CONFIG.ITEMS_PER_PAGE,
        search: state.searchQuery || undefined,
        category: state.selectedCategory !== 'all' ? state.selectedCategory : undefined,
        sortBy: state.sortBy,
        minPrice,
        maxPrice
      };

      const response = await api.items.getItems(params);
      const newItems = response.data?.items || response.data || [];
      const total = response.data?.total || newItems.length;

      setState(prev => ({
        ...prev,
        items: reset ? newItems : [...prev.items, ...newItems],
        loading: false,
        hasMore: newItems.length === MARKETPLACE_CONFIG.ITEMS_PER_PAGE,
        totalItems: total,
        page: reset ? 1 : page
      }));

    } catch (error) {
      console.error('Failed to load items:', error);
      setState(prev => ({ ...prev, loading: false }));
    } finally {
      loadItemsInProgress.current = false;
    }
  }, [state.searchQuery, state.selectedCategory, state.sortBy, state.priceRange]);

  // Event handlers
  const handleSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, page: 1 }));
    const newParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    router.push(`/marketplace?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleCategoryChange = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category, page: 1 }));
    const newParams = new URLSearchParams(searchParams.toString());
    if (category !== 'all') {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    router.push(`/marketplace?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleSortChange = useCallback((sort: string) => {
    setState(prev => ({ ...prev, sortBy: sort as SortOption, page: 1 }));
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sort', sort);
    router.push(`/marketplace?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleLoadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      loadItems(state.page + 1);
    }
  }, [state.loading, state.hasMore, state.page]);

  const handleClearSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchQuery: '', page: 1 }));
    router.push('/marketplace', { scroll: false });
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'newest' as SortOption,
      priceRange: 'all' as PriceRange,
      page: 1
    }));
    router.push('/marketplace', { scroll: false });
  }, [router]);

  // Pull to refresh
  usePullToRefresh({
    onRefresh: async () => {
      await loadItems(1, true);
    },
    threshold: MARKETPLACE_CONFIG.PULL_TO_REFRESH_THRESHOLD
  });

  // Trigger search when dependencies change
  useEffect(() => {
    if (state.searchQuery !== undefined && state.selectedCategory !== undefined) {
      loadItems(1, true);
    }
  }, [state.searchQuery, state.selectedCategory, state.sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Section */}
      <Suspense fallback={<div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700" />}>
        <MarketplaceSearchSection
          searchQuery={state.searchQuery}
          onSearchChange={handleSearch}
          onSearchSubmit={() => loadItems(1, true)}
          selectedCategory={state.selectedCategory}
          categories={categories}
          onCategoryChange={handleCategoryChange}
          viewMode={state.viewMode}
          onViewModeChange={(mode: ViewMode) => setState(prev => ({ ...prev, viewMode: mode }))}
          sortBy={state.sortBy}
          onSortChange={handleSortChange}
          onShowAdvancedFilters={() => setShowAdvancedFilters(true)}
          itemCount={state.totalItems}
        />
      </Suspense>

      {/* Results Section */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700" />}>
        <MarketplaceResultsSection
          items={state.items}
          loading={state.loading}
          searchQuery={state.searchQuery}
          selectedCategory={state.selectedCategory}
          totalItems={state.totalItems}
          hasMore={state.hasMore}
          onLoadMore={handleLoadMore}

          onClearFilters={handleClearFilters}
          viewMode={state.viewMode}
        />
      </Suspense>

      {/* Advanced Filter Panel (Lazy Loaded) */}
      {showAdvancedFilters && (
        <Suspense fallback={null}>
          <AdvancedFilterPanel
            isOpen={showAdvancedFilters}
            onClose={() => setShowAdvancedFilters(false)}
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            onApplyFilters={() => {
              loadItems(1, true);
              setShowAdvancedFilters(false);
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
              setShowAdvancedFilters(false);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}