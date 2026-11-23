/**
 * Scroll Restoration Utility for Marketplace
 * 
 * Best Practice Implementation:
 * 1. Cache loaded items in sessionStorage before navigation
 * 2. Cache scroll position
 * 3. Restore both on back navigation
 * 
 * This prevents the "flash to top" issue when navigating back from item details.
 */

const CACHE_KEY = 'marketplace_scroll_cache';
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes - longer expiry for better UX

export interface MarketplaceCacheData {
  items: any[];
  scrollPosition: number;
  currentPage: number;
  totalItems: number;
  hasMore: boolean;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  priceRange: string;
  conditionFilter: string;
  timestamp: number;
  mode: 'products' | 'services';
}

/**
 * Save marketplace state to sessionStorage before navigating away
 */
export function saveMarketplaceCache(data: Omit<MarketplaceCacheData, 'timestamp' | 'scrollPosition'>): void {
  if (typeof window === 'undefined') return;
  
  const cacheData: MarketplaceCacheData = {
    ...data,
    scrollPosition: window.scrollY,
    timestamp: Date.now()
  };
  
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 [CACHE] Saved marketplace cache:', {
      itemCount: data.items.length,
      scrollPosition: cacheData.scrollPosition,
      currentPage: data.currentPage
    });
  } catch (e) {
    // sessionStorage might be full or disabled
    console.warn('Failed to save marketplace cache:', e);
  }
}

/**
 * Get cached marketplace state if valid
 */
export function getMarketplaceCache(): MarketplaceCacheData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    console.log('📖 [CACHE] Reading cache, exists:', !!cached);
    if (!cached) return null;
    
    const data: MarketplaceCacheData = JSON.parse(cached);
    
    // Check if cache is expired
    if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
      console.log('⏰ [CACHE] Cache expired, clearing');
      clearMarketplaceCache();
      return null;
    }
    
    console.log('✅ [CACHE] Cache valid, items:', data.items.length, 'scroll:', data.scrollPosition);
    return data;
  } catch (e) {
    console.warn('Failed to get marketplace cache:', e);
    return null;
  }
}

/**
 * Clear the marketplace cache
 */
export function clearMarketplaceCache(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn('Failed to clear marketplace cache:', e);
  }
}

/**
 * Restore scroll position after items are rendered
 * Uses requestAnimationFrame for smooth restoration
 */
export function restoreScrollPosition(position: number, delay: number = 100): void {
  if (typeof window === 'undefined') return;
  
  // Wait for DOM to update, then restore scroll
  setTimeout(() => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: position,
        behavior: 'instant' // Use instant to avoid animation flash
      });
    });
  }, delay);
}

/**
 * Check if navigation is a back/forward navigation
 */
export function isBackNavigation(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check navigation type
  const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (navEntries.length > 0) {
    return navEntries[0].type === 'back_forward';
  }
  
  return false;
}
