'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Simple, robust marketplace cache hook for scroll restoration
 * 
 * Best Practice Implementation:
 * - Uses sessionStorage for persistence across navigation
 * - Simple boolean flag to track restoration state
 * - Automatically handles React Strict Mode double-rendering
 */

const CACHE_KEY = 'xmarket_marketplace_cache';

export interface MarketplaceCacheData {
  items: any[];
  scrollY: number;
  currentPage: number;
  totalItems: number;
  hasMore: boolean;
  filters: {
    searchQuery: string;
    selectedCategory: string;
    sortBy: string;
    priceRange: string;
    conditionFilter: string;
  };
  mode: 'products' | 'services';
  savedAt: number;
}

// Module-level flag to track if we've already restored (survives re-renders)
let hasRestoredThisSession = false;

/**
 * Save marketplace state to cache
 * @param data - Marketplace data to cache
 * @param explicitScrollY - Optional explicit scroll position (use when window.scrollY might be stale)
 */
export function saveMarketplaceToCache(
  data: Omit<MarketplaceCacheData, 'savedAt' | 'scrollY'>,
  explicitScrollY?: number
): void {
  if (typeof window === 'undefined') return;
  
  // Use explicit scrollY if provided, otherwise fall back to window.scrollY
  const scrollY = explicitScrollY ?? window.scrollY;
  
  const cacheData: MarketplaceCacheData = {
    ...data,
    scrollY,
    savedAt: Date.now()
  };
  
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('✅ [CACHE] Saved:', { items: data.items.length, scrollY: cacheData.scrollY });
  } catch (e) {
    console.warn('[CACHE] Failed to save:', e);
  }
}

/**
 * Get cached marketplace state (if valid)
 */
export function getMarketplaceFromCache(): MarketplaceCacheData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      console.log('📭 [CACHE] No cache found');
      return null;
    }
    
    const data: MarketplaceCacheData = JSON.parse(raw);
    
    // Check expiry (30 minutes)
    const age = Date.now() - data.savedAt;
    if (age > 30 * 60 * 1000) {
      console.log('⏰ [CACHE] Expired, age:', Math.round(age / 1000), 'seconds');
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    console.log('📦 [CACHE] Found valid cache:', { items: data.items.length, scrollY: data.scrollY });
    return data;
  } catch (e) {
    console.warn('[CACHE] Failed to read:', e);
    return null;
  }
}

/**
 * Clear the cache
 */
export function clearMarketplaceCache(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(CACHE_KEY);
  console.log('🗑️ [CACHE] Cleared');
}

/**
 * Hook to manage marketplace cache restoration
 */
export function useMarketplaceCache() {
  const isInitialized = useRef(false);
  const restoredData = useRef<MarketplaceCacheData | null>(null);
  
  // Check cache on first render only
  const checkCache = useCallback(() => {
    // Only check once per mount
    if (isInitialized.current) {
      return restoredData.current;
    }
    isInitialized.current = true;
    
    // Don't restore if we've already restored this session
    if (hasRestoredThisSession) {
      console.log('🔄 [CACHE] Already restored this session, skipping');
      return null;
    }
    
    const cached = getMarketplaceFromCache();
    if (cached) {
      hasRestoredThisSession = true;
      restoredData.current = cached;
      // Clear cache after reading to prevent stale restores
      clearMarketplaceCache();
    }
    
    return cached;
  }, []);
  
  // Reset the session flag when navigating away
  useEffect(() => {
    return () => {
      // When component unmounts (navigating away), reset for next visit
      hasRestoredThisSession = false;
    };
  }, []);
  
  return {
    checkCache,
    saveCache: saveMarketplaceToCache,
    clearCache: clearMarketplaceCache,
    getCachedData: () => restoredData.current
  };
}

/**
 * Restore scroll position after a delay
 * Note: The app uses a scrollable <main> container, not window scroll
 * @param scrollY - Target scroll position
 * @param onComplete - Callback when scroll restoration is complete
 */
export function restoreScrollPosition(scrollY: number, onComplete?: () => void): void {
  if (typeof window === 'undefined' || scrollY <= 0) {
    onComplete?.();
    return;
  }
  
  console.log('📜 [SCROLL] Restoring to:', scrollY);
  
  // Try to restore scroll immediately and with retries
  const attemptRestore = () => {
    const scrollContainer = document.querySelector('main.overflow-y-auto');
    
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollY;
      console.log('📜 [SCROLL] Set main.scrollTop to:', scrollY);
      return true;
    } else {
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      return true;
    }
  };
  
  // Attempt immediately
  attemptRestore();
  
  // Retry a few times to ensure DOM is ready, then call onComplete
  const retryDelays = [16, 50, 100];
  let retryIndex = 0;
  
  const retry = () => {
    attemptRestore();
    retryIndex++;
    if (retryIndex < retryDelays.length) {
      setTimeout(retry, retryDelays[retryIndex]);
    } else {
      // All retries done, signal completion
      onComplete?.();
    }
  };
  
  setTimeout(retry, retryDelays[0]);
}
