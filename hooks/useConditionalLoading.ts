/**
 * Conditional Loading Hook - Smart skeleton loading based on page context
 * Prevents unnecessary skeleton loading and removes artificial delays
 */

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingConfig {
  showSkeleton: boolean;
  pageType: 'landing' | 'marketplace' | 'profile' | 'auth' | 'other';
  hasData: boolean;
}

export function useConditionalLoading(
  isLoading: boolean,
  hasData: boolean = false,
  minLoadTime: number = 0 // Remove artificial delays by default
): LoadingConfig {
  const pathname = usePathname();
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Determine page type
  const pageType = getPageType(pathname);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading && shouldShowSkeleton(pageType, hasData)) {
      // Show skeleton immediately if minLoadTime is 0, otherwise wait
      if (minLoadTime > 0) {
        timeoutId = setTimeout(() => setShowSkeleton(true), minLoadTime);
      } else {
        setShowSkeleton(true);
      }
    } else {
      setShowSkeleton(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, hasData, minLoadTime, pageType]);

  // Hide skeleton immediately when data arrives
  useEffect(() => {
    if (hasData && !isLoading) {
      setShowSkeleton(false);
    }
  }, [hasData, isLoading]);

  return {
    showSkeleton,
    pageType,
    hasData
  };
}

function getPageType(pathname: string): LoadingConfig['pageType'] {
  if (pathname === '/' || pathname.startsWith('/landing')) {
    return 'landing';
  }
  if (pathname.startsWith('/marketplace') || pathname === '/') {
    return 'marketplace';
  }
  if (pathname.startsWith('/profile')) {
    return 'profile';
  }
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return 'auth';
  }
  return 'other';
}

function shouldShowSkeleton(pageType: LoadingConfig['pageType'], hasData: boolean): boolean {
  // Never show skeleton on landing page (it's static)
  if (pageType === 'landing') return false;
  
  // Never show skeleton if we already have data
  if (hasData) return false;
  
  // Show skeleton for data-driven pages
  return ['marketplace', 'profile', 'other'].includes(pageType);
}

/**
 * Smart skeleton count based on viewport and existing data
 */
export function getOptimalSkeletonCount(
  hasExistingData: boolean,
  viewportWidth: number = 1024
): number {
  // Don't show skeletons if we have data
  if (hasExistingData) return 0;
  
  // Mobile: 4 skeletons, Desktop: 8 skeletons
  return viewportWidth < 768 ? 4 : 8;
}

/**
 * Remove artificial loading delays and show content immediately when ready
 */
export function useInstantLoading<T>(
  asyncOperation: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const executeOperation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await asyncOperation();
        
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setLoading(false);
        }
      }
    };

    executeOperation();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
}