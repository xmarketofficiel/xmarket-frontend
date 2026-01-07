'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import { api, servicesApi } from '../../lib/apiEndpoints';
import { Item } from '../../types';
import type { Service, ServiceCategory as ServiceCategoryType } from '../../lib/api/services';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useConditionalLoading, getOptimalSkeletonCount } from '../../hooks/useConditionalLoading';
import { useMarketplaceCache, restoreScrollPosition, saveMarketplaceToCache } from '../../hooks/useMarketplaceCache';

// Components
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { SearchBar } from './components/SearchBar';
import { AdvancedFilterPanel } from './components/AdvancedFilterPanel';
import { CategoryFilter } from './components/CategoryFilter';
import { ModeToggle, MarketplaceMode } from './components/ModeToggle';
import { FloatingModeToggle } from './components/FloatingModeToggle';
import { ViewControls } from './components/ViewControls';
import { FilterPanel } from './components/FilterPanel';
import { SearchResultsHeader } from './components/SearchResultsHeader';
import { EmptyState } from './components/EmptyState';
import { LoadMoreButton } from './components/LoadMoreButton';
import { ServiceCard } from './components/ServiceCard';
import { ServiceCategoryCard } from './components/ServiceCategoryCard';
import ServiceDetailModal from './components/ServiceDetailModal';
import Feed from '../../components/Feed';

// Services
import { 
  sortServices, 
  filterActiveServices, 
  getCategoryHotnessScore, 
  getHottestItemInCategory,
  getHoursUntilDeparture,
  getUrgencyBadge,
  formatTimeLeft
} from '../../lib/serviceUtils';

// Skeleton components
import { 
  SkeletonSearchBar, 
  SkeletonCategoryFilter, 
  SkeletonResultsCounter,
  SkeletonGrid 
} from '../../components/skeletons/SkeletonComponents';
import { MarketplaceGridSkeleton } from '../../components/skeletons/MarketplacePageSkeleton';

// Constants and Types
import { MARKETPLACE_CONFIG, CATEGORY_CONFIG, SERVICE_CATEGORIES } from './constants';
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

  // Mode state for Products/Services toggle - read from URL params
  const [mode, setMode] = useState<MarketplaceMode>(
    (searchParams.get('mode') as MarketplaceMode) || 'products'
  );
  
  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoryType[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [categoriesInitialLoad, setCategoriesInitialLoad] = useState(true); // Start as true to prevent flash
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isRestoringScroll, setIsRestoringScroll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Client-side mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Responsive page size based on device
  useEffect(() => {
    const updatePageSize = () => {
      const isMobile = window.innerWidth < MARKETPLACE_CONFIG.MOBILE_BREAKPOINT;
      const newPageSize = isMobile 
        ? MARKETPLACE_CONFIG.ITEMS_PER_PAGE_MOBILE 
        : MARKETPLACE_CONFIG.ITEMS_PER_PAGE_DESKTOP;
      
      // Only update if different to avoid unnecessary re-renders
      setState(prev => {
        if (prev.itemsPerPage !== newPageSize) {
          return { ...prev, itemsPerPage: newPageSize };
        }
        return prev;
      });
    };

    // Set initial value
    updatePageSize();

    // Listen for resize events (debounced via the effect cleanup)
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

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

  // Service detail modal state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string | undefined>(undefined);

  // Categories list
  const [categories, setCategories] = useState<string[]>([]);

  // Ref to prevent multiple simultaneous loadItems calls
  const loadItemsInProgress = useRef(false);
  
  // Ref to track which page is currently being fetched (for prefetch deduplication)
  const fetchingPageRef = useRef<number | null>(null);
  
  // Ref to track the last successfully loaded page (prevents race conditions)
  const lastLoadedPageRef = useRef(0);
  
  // State to track if a fetch is in progress (for skeleton display when user catches up)
  const [isFetching, setIsFetching] = useState(false);

  // Ref for tracking original ModeToggle position (for floating toggle)
  const modeToggleRef = useRef<HTMLDivElement>(null);
  
  // State to force hide floating toggle during mode changes (prevents lag/glitch)
  const [isChangingMode, setIsChangingMode] = useState(false);
  
  // Marketplace cache hook for scroll restoration
  const { checkCache } = useMarketplaceCache();
  
  // Track if we restored from cache (simple ref that survives re-renders)
  const cacheRestorationDone = useRef(false);
  const restoredItemsCount = useRef(0);

  /**
   * Update state helper function
   */
  const updateState = useCallback((updates: Partial<MarketplaceState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Load services from backend
   */
  const loadServices = useCallback(async (categoryId?: string) => {
    try {
      setServicesLoading(true);
      setServicesError(null);
      
      const params: any = {
        page: 1,
        limit: 100, // Load all services for now
      };
      
      if (categoryId && categoryId !== 'all') {
        params.category = categoryId;
      }
      
      const response = await servicesApi.getServices(params);
      const servicesData = response.data.data || [];
      
      setServices(servicesData as Service[]);
    } catch (error) {
      console.error('Error loading services:', error);
      setServicesError('Failed to load services');
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  }, []);

  /**
   * Load service categories from backend
   */
  const loadServiceCategories = useCallback(async () => {
    try {
      const response = await servicesApi.getServiceCategories();
      setServiceCategories(response.data);
    } catch (error) {
      console.error('Error loading service categories:', error);
    } finally {
      // Mark initial load as complete to prevent flash
      setCategoriesInitialLoad(false);
    }
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
      
      console.log('🔍 Parsing categories from response...', response);
      // Handle nested response structure: response.data.data contains the actual categories array
      const responseData = response.data as any;
      // const categoryList = (responseData && responseData.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []);
      console.log('📦 Category list:', responseData);
      
      // if (Array.isArray(categoryList) && categoryList.length > 0) {
        // Extract just the names for the filter, but keep full objects for reference
        const categoryNames = responseData.map((cat: any) => {
          // Handle both formats: object with name property or direct string
          if (typeof cat === 'object' && cat.name) {
            return cat.name;
          }
          return cat;
        });
        console.log(`✅ Processed ${categoryNames.length} category names:`, categoryNames);
        setCategories(categoryNames);
      // } else {
      //   console.warn('⚠️ No categories returned from backend. This usually means:');
      //   console.warn('   1. Backend server is not running');
      //   console.warn('   2. Database has no categories');
      //   console.warn('   3. API endpoint issue');
      //   console.warn('   Using comprehensive fallback categories...');
        
        // Use a comprehensive set of fallback categories based on our backend seed data
      //   const fallbackCategories = [
      //     'Electronics',
      //     'Books', 
      //     'Clothing',
      //     'Furniture',
      //     'Sports',
      //     'Transportation',
      //     'Health & Beauty',
      //     'Art & Crafts',
      //     'Music & Instruments',
      //     'Home & Garden',
      //     'Toys & Games',
      //     'Pet Supplies',
      //     'Office Supplies',
      //     'Food & Beverages',
      //     'Services',
      //     'Other'
      //   ];
      //   
      //   console.log(`📦 Using ${fallbackCategories.length} fallback categories:`, fallbackCategories);
      //   setCategories(fallbackCategories);
      // }
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
      
      // Check if it's a network error (backend not running)
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('Network'))) {
        console.error('🚨 Backend server might not be running. Please start the backend server.');
      }
      
      // Minimal fallback to prevent hanging
      // setCategories(['Electronics', 'Books', 'Furniture', 'Clothing']);
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
   * Supports prefetching - allows loading next page while still showing current items
   * @param page - Page number to load
   * @param replaceItems - If true, replace all items. If false, append to existing
   * @param silent - If true, don't show loading skeleton (for background prefetch)
   */
  const loadItems = useCallback(async (page: number = 1, replaceItems: boolean = true, silent: boolean = false) => {
    console.log('🔄 [loadItems] Called with:', { page, replaceItems, silent, restoredItems: restoredItemsCount.current, itemsCount: state.items.length });
    
    // Skip if we restored from cache (back navigation) - don't require state.items.length 
    // since React state updates are async and may not have propagated yet
    if (restoredItemsCount.current > 0 && replaceItems && page === 1) {
      console.log('⏭️ [loadItems] SKIPPING - restored from cache with', restoredItemsCount.current, 'items');
      restoredItemsCount.current = 0; // Reset after skip to allow future loads
      return;
    }
    
    // For append operations (infinite scroll), check if we're already fetching or have loaded this page
    if (!replaceItems) {
      // Skip if we already loaded this page or are currently fetching it
      if (page <= lastLoadedPageRef.current || fetchingPageRef.current === page) {
        console.log('⏭️ [loadItems] SKIPPING page', page, '- already loaded or fetching');
        return;
      }
      fetchingPageRef.current = page;
      setIsFetching(true); // Track that a fetch is in progress
      // Only show skeleton if not a silent prefetch
      if (!silent) {
        setLoadingMore(true);
      }
    } else {
      // Reset last loaded page for fresh loads
      lastLoadedPageRef.current = 0;
      // For replace operations, prevent multiple simultaneous calls
      if (loadItemsInProgress.current) {
        return;
      }
      loadItemsInProgress.current = true;
    }
    
    // Only show loading state for initial load or replace, not for prefetch/append
    if (replaceItems) {
      updateState({ loading: true, error: null });
    }

    try {
      const params = buildSearchParams();
      params.page = page;

      const response = await api.items.getItems(params);
      
      // Handle the new wrapped response format: {success: true, data: {items: [...], total: 5, hasMore: false}}
      const responseData = (response.data as any)?.data || response.data || {};
      const pageItems = responseData.items || [];
      const total = responseData.total || 0;

      if (replaceItems) {
        updateState({
          items: pageItems,
          totalItems: total,
          hasMore: responseData.hasMore || false,
          currentPage: page
        });
        
        // Prefetch page 2 immediately after initial load for seamless scrolling
        if (page === 1 && responseData.hasMore) {
          lastLoadedPageRef.current = 1;
          setTimeout(() => {
            loadItems(2, false, true); // silent=true for background prefetch
          }, 100);
        }
      } else {
        // Infinite scroll: append new items with deduplication
        // Update lastLoadedPageRef to prevent duplicate fetches
        lastLoadedPageRef.current = page;
        
        setState(prev => {
          const existingIds = new Set(prev.items.map(item => item.id));
          const newItems = pageItems.filter((item: Item) => !existingIds.has(item.id));
          
          // Always trust the API's hasMore - don't override based on duplicates
          // Duplicates can happen due to race conditions, not end of data
          return {
            ...prev,
            items: newItems.length > 0 ? [...prev.items, ...newItems] : prev.items,
            totalItems: total,
            hasMore: responseData.hasMore ?? false,
            currentPage: page
          };
        });
      }
    } catch (error: any) {
      console.error('Failed to load items:', error);
      if (replaceItems) {
        updateState({ 
          error: error.message || 'Failed to load items',
          items: []
        });
      }
      // For append errors, silently fail (user can try again)
    } finally {
      if (replaceItems) {
        updateState({ loading: false });
        loadItemsInProgress.current = false;
      } else {
        setIsFetching(false); // Fetch complete
        if (!silent) {
          setLoadingMore(false); // Hide skeleton after loading more (only if we showed it)
        }
      }
      fetchingPageRef.current = null;
    }
  }, [buildSearchParams, updateState]);

  /**
   * Handle search query change
   */
  const handleSearchChange = useCallback((query: string) => {
    updateState({ searchQuery: query, currentPage: 1 });
    // Update URL to reflect search query
    const params = new URLSearchParams();
    params.set('mode', mode);
    if (state.selectedCategory !== 'all') {
      params.set('category', state.selectedCategory);
    }
    if (query.trim()) {
      params.set('search', query);
    }
    router.push(`/marketplace?${params.toString()}`);
  }, [updateState, mode, state.selectedCategory, router]);

  /**
   * Handle mode change (Products/Services)
   */
  const handleModeChange = useCallback((newMode: MarketplaceMode) => {
    // Immediately scroll to top to prevent header glitch
    const scrollContainer = document.querySelector('main.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
    
    // Trigger floating toggle hide animation
    setIsChangingMode(true);
    
    // If switching to services mode, show loading state to prevent flash
    if (newMode === 'services') {
      setCategoriesInitialLoad(true);
      // Reload service categories to ensure fresh data
      setTimeout(() => {
        loadServiceCategories();
        loadServices();
      }, 0);
    }
    
    // Change mode and update state instantly
    setMode(newMode);
    updateState({ selectedCategory: 'all', currentPage: 1 });
    
    // Update URL to reflect mode change
    router.push(`/marketplace?mode=${newMode}`);
    
    // Reset changing mode state after hide animation completes
    setTimeout(() => setIsChangingMode(false), 250);
  }, [updateState, router, loadServiceCategories, loadServices]);

  /**
   * Handle category change
   */
  const handleCategoryChange = useCallback((category: string) => {
    updateState({ selectedCategory: category, currentPage: 1 });
    // Update URL to reflect category change
    const params = new URLSearchParams();
    params.set('mode', mode);
    if (category !== 'all') {
      params.set('category', category);
    }
    router.push(`/marketplace?${params.toString()}`);
  }, [updateState, mode, router]);

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
   * Handle load more (called by infinite scroll)
   * Uses ref-based tracking to prevent race conditions during aggressive scrolling
   * Always silent since IntersectionObserver triggers early (prefetch pattern)
   */
  const handleLoadMore = useCallback(() => {
    if (state.hasMore) {
      // Use lastLoadedPageRef + 1 to avoid race conditions with stale state
      const nextPage = Math.max(lastLoadedPageRef.current, state.currentPage) + 1;
      loadItems(nextPage, false, true); // silent=true for seamless prefetch
    }
  }, [state.hasMore, state.currentPage, loadItems]);

  /**
   * Save marketplace state before navigating to item detail
   * This enables scroll restoration when user navigates back
   * @param scrollY - The scroll position captured at click time
   */
  const handleItemClick = useCallback((scrollY: number) => {
    saveMarketplaceToCache({
      items: state.items,
      currentPage: state.currentPage,
      totalItems: state.totalItems,
      hasMore: state.hasMore,
      filters: {
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
        sortBy: state.sortBy,
        priceRange: state.priceRange,
        conditionFilter: state.conditionFilter,
      },
      mode: mode
    }, scrollY); // Pass explicit scrollY captured at click time
  }, [state, mode]);

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
    // Reset URL to just mode parameter
    router.push(`/marketplace?mode=${mode}`);
  }, [updateState, mode, router]);

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
  }, [loadPendingSalesCount, loadCategories]);

  // Initialize data on mount - check for cached state first (scroll restoration)
  // Initialize data on mount - check for cached state first
  useEffect(() => {
    // Check cache FIRST before loading anything
    if (!cacheRestorationDone.current) {
      cacheRestorationDone.current = true;
      const cachedData = checkCache();
      
      if (cachedData && cachedData.items.length > 0) {
        console.log('📦 [INIT] Restoring from cache:', cachedData.items.length, 'items, scroll:', cachedData.scrollY);
        
        // Mark that we restored items (used to skip loadItems)
        restoredItemsCount.current = cachedData.items.length;
        
        // Update lastLoadedPageRef to prevent duplicate fetches after restoration
        lastLoadedPageRef.current = cachedData.currentPage;
        
        // Hide content during scroll restoration to prevent flash
        if (cachedData.scrollY > 0) {
          setIsRestoringScroll(true);
        }
        
        // Restore mode
        setMode(cachedData.mode);
        
        // Restore state with cached data
        setState(prev => ({
          ...prev,
          items: cachedData.items,
          currentPage: cachedData.currentPage,
          totalItems: cachedData.totalItems,
          hasMore: cachedData.hasMore,
          searchQuery: cachedData.filters.searchQuery,
          selectedCategory: cachedData.filters.selectedCategory,
          sortBy: cachedData.filters.sortBy as SortOption,
          priceRange: cachedData.filters.priceRange as PriceRange,
          conditionFilter: cachedData.filters.conditionFilter as ConditionFilter,
          loading: false
        }));
        
        // Restore scroll position and reveal content when complete
        if (cachedData.scrollY > 0) {
          restoreScrollPosition(cachedData.scrollY, () => {
            setIsRestoringScroll(false);
          });
        }
      }
    }
    
    // Load other data
    loadCategories();
    loadPendingSalesCount();
    loadServiceCategories();
    loadServices();
    
    // Load saved view mode preference
    const savedViewMode = localStorage.getItem('marketplace-view-mode') as ViewMode;
    if (savedViewMode && ['grid', 'list'].includes(savedViewMode)) {
      updateState({ viewMode: savedViewMode });
    }
  }, [loadCategories, loadPendingSalesCount, loadServiceCategories, loadServices, updateState, checkCache]);

  // Load initial items once categories are loaded
  useEffect(() => {
    console.log('🔍 [CATEGORIES EFFECT] categories.length:', categories.length, 'restoredItems:', restoredItemsCount.current);
    
    // Skip if we just restored from cache - don't reload items
    if (restoredItemsCount.current > 0) {
      console.log('⏭️ [CATEGORIES EFFECT] Skipping - restored from cache with', restoredItemsCount.current, 'items');
      return;
    }
    
    if (categories.length > 0) {
      loadItems(1, true);
    }
  }, [categories]);

  // Load items when filters change (user changes filters after initial load)
  // Track if user has interacted with filters (not just initial/cache restoration)
  const userChangedFilters = useRef(false);
  const prevFilters = useRef({
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,
    sortBy: state.sortBy,
    priceRange: state.priceRange,
    conditionFilter: state.conditionFilter
  });
  
  useEffect(() => {
    const currentFilters = {
      searchQuery: state.searchQuery,
      selectedCategory: state.selectedCategory,
      sortBy: state.sortBy,
      priceRange: state.priceRange,
      conditionFilter: state.conditionFilter
    };
    
    // Check if filters actually changed from user interaction (not initial/cache)
    const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(prevFilters.current);
    prevFilters.current = currentFilters;
    
    console.log('🔍 [FILTER EFFECT] filtersChanged:', filtersChanged, 'restoredItems:', restoredItemsCount.current);
    
    // Skip if restored from cache - don't reload items
    if (restoredItemsCount.current > 0) {
      console.log('🔍 [FILTER EFFECT] Skipping - restored from cache');
      return;
    }
    
    // Skip if filters didn't actually change
    if (!filtersChanged) {
      console.log('🔍 [FILTER EFFECT] Skipping - no filter change');
      return;
    }
    
    // Mark that user has changed filters
    userChangedFilters.current = true;
    
    const timeoutId = setTimeout(() => {
      console.log('🔍 [FILTER EFFECT] Calling loadItems after timeout');
      loadItems(1, true);
    }, state.searchQuery ? MARKETPLACE_CONFIG.SEARCH_DEBOUNCE_MS : 0);

    return () => clearTimeout(timeoutId);
  }, [
    state.searchQuery, 
    state.selectedCategory, 
    state.sortBy, 
    state.priceRange, 
    state.conditionFilter
  ]);

  // Pull to refresh
  const { isRefreshing, pullDistance, isPulling } = usePullToRefresh({
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
  
  // Services computed data
  const filteredServices = useMemo(() => {
    if (state.selectedCategory === 'all') {
      return services;
    }
    const categoryServices = services.filter(s => s.serviceCategoryId === state.selectedCategory);
    return categoryServices;
  }, [services, state.selectedCategory]);
  
  // Pre-compute service counts for each category (performance optimization)
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach(service => {
      const categoryId = service.serviceCategoryId;
      counts[categoryId] = (counts[categoryId] || 0) + 1;
    });
    return counts;
  }, [services]);

  // Helper to get urgency badge from departure time
  const getUrgencyBadgeFromDepartureTime = (departureTime: string | undefined) => {
    if (!departureTime) return undefined;
    
    const departure = new Date(departureTime);
    const now = new Date();
    const hoursLeft = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) return undefined; // Expired
    if (hoursLeft < 1) {
      const minutesLeft = Math.floor(hoursLeft * 60);
      return { color: 'red', label: `${minutesLeft}min`, icon: '🔴' };
    }
    if (hoursLeft < 3) return { color: 'red', label: `${Math.floor(hoursLeft)}h`, icon: '🔴' };
    if (hoursLeft < 6) return { color: 'orange', label: `${Math.floor(hoursLeft)}h`, icon: '🟠' };
    if (hoursLeft < 12) return { color: 'yellow', label: 'Today', icon: '🟡' };
    if (hoursLeft < 24) return { color: 'green', label: 'Today', icon: '🟢' };
    return { color: 'blue', label: 'Upcoming', icon: '📅' };
  };

  // Convert service categories to display format
  const displayServiceCategories = useMemo(() => {
    const allCategory = { 
      id: 'all', 
      name: 'All Services', 
      icon: '🔥', 
      type: 'both' as const,
      backgroundImage: undefined as string | undefined,
      serviceCount: services.length,
      urgencyBadge: undefined as { color: string; label: string; icon: string } | undefined
    };
    const mappedCategories = serviceCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '🔧',
      type: cat.type,
      backgroundImage: cat.backgroundImage,
      serviceCount: serviceCounts[cat.id] || 0,
      urgencyBadge: getUrgencyBadgeFromDepartureTime((cat as any).hottestDepartureTime)
    }));
    return [allCategory, ...mappedCategories];
  }, [serviceCategories, serviceCounts, services.length]);

  return (
    <>
      {/* Skeleton overlay during scroll restoration - hides content flash */}
      {isRestoringScroll && (
        <div className="fixed inset-0 z-50 bg-gray-50">
          <SkeletonCategoryFilter />
          <SkeletonResultsCounter />
          <div className="px-4 pt-4">
            <MarketplaceGridSkeleton count={12} />
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gray-50">
      {/* Header - scrolls on mobile, sticky on desktop */}
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
        mode={mode}
        onModeChange={handleModeChange}
      />

      {/* Mode Toggle - Scrolls with content on mobile, hidden on desktop */}
      <div ref={modeToggleRef}>
        <ModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      {/* Floating Mode Toggle - Slides from top when original is scrolled out of view (mobile only) */}
      <FloatingModeToggle 
        mode={mode} 
        onChange={handleModeChange} 
        triggerRef={modeToggleRef}
        forceHide={isChangingMode}
      />

      {/* Content */}
      <div className="pb-20">
        {/* Category Filter - Only show for products mode */}
        {mode === 'products' && (
          categories.length === 0 ? (
            <SkeletonCategoryFilter />
          ) : (
            <CategoryFilter
              categories={categories}
              selectedCategory={state.selectedCategory}
              onChange={handleCategoryChange}
              loading={!categories.length && showSkeleton}
            />
          )
        )}

        {/* Results Counter - Only show for products mode */}

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

        {/* Pull-to-refresh indicator - Facebook style (mobile only) */}
        {(pullDistance > 0 || isRefreshing) && (
          <div 
            className="flex justify-center md:hidden overflow-hidden transition-all duration-300 ease-out"
            style={{ 
              height: isRefreshing ? 56 : Math.min(pullDistance, 56),
              opacity: isRefreshing ? 1 : Math.min(pullDistance / 40, 1)
            }}
          >
            <div className="flex items-center justify-center py-3">
              {/* Facebook-style radial spinner */}
              <div 
                className={`relative w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`}
                style={{ 
                  transform: isRefreshing ? undefined : `rotate(${pullDistance * 3}deg)`,
                  transition: isRefreshing ? undefined : 'transform 0.1s ease-out'
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 45}deg) translateY(-8px) translateX(-50%)`,
                      opacity: isRefreshing ? 0.3 + (i * 0.1) : (isPulling ? 0.8 : 0.4),
                      animation: isRefreshing ? `fadeInOut 0.8s ease-in-out ${i * 0.1}s infinite` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results Header */}
        <SearchResultsHeader
          searchQuery={state.searchQuery}
          totalResults={state.totalItems}
          onClearSearch={() => handleSearchChange('')}
          loading={state.loading && !isRefreshing}
        />

        {/* Content Area - min-height prevents layout shift during loading */}
        <div className="px-4 pt-4 pb-6 min-h-[calc(100vh-200px)]">
          {mode === 'products' ? (
            <>
              {/* Products Mode */}
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
                    onItemClick={handleItemClick}
                    isFetching={isFetching}
                  />
                </>
              )}
            </>
          ) : (
            <>
              {/* Services Mode */}
              {(servicesLoading || categoriesInitialLoad) ? (
                /* Services Loading Skeleton - matches actual grid dimensions to prevent layout shift */
                <div>
                  <div className="mb-6">
                    <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : servicesError ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load services</h3>
                  <p className="text-gray-500 mb-4">{servicesError}</p>
                  <button
                    onClick={() => loadServices()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : state.selectedCategory === 'all' ? (
                /* Show Service Category Cards */
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayServiceCategories.filter(c => c.id !== 'all').map((category) => (
                      <ServiceCategoryCard
                        key={category.id}
                        category={category}
                        serviceCount={category.serviceCount}
                        onClick={() => handleCategoryChange(category.id)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Show Services Grid */
                <div>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className="mb-4 flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    <span className="text-xl">←</span>
                    Back to all categories
                  </button>
                  
                  {filteredServices.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No services found
                      </h3>
                      <p className="text-gray-500">
                        Try selecting a different category
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                      {filteredServices.map((service) => {
                        const category = displayServiceCategories.find(c => c.id === service.serviceCategoryId);
                        return (
                          <ServiceCard 
                            key={service.id} 
                            service={service} 
                            categoryBackgroundImage={category?.backgroundImage}
                            onClick={() => {
                              setSelectedService(service);
                              setSelectedServiceCategory(category?.backgroundImage);
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
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

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        categoryBackgroundImage={selectedServiceCategory}
      />
      </div>
    </>
  );
}
