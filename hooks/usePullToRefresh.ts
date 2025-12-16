'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
}

/**
 * Get the current scroll position from window (natural body scroll)
 */
function getScrollTop(): number {
  if (typeof window === 'undefined') return 0;
  return window.scrollY;
}

export function usePullToRefresh({ 
  onRefresh, 
  threshold = 80, 
  resistance = 2.5 
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const isTrackingRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only start tracking if we're at the very top of scroll
    const scrollTop = getScrollTop();
    if (scrollTop <= 0) {
      touchStartRef.current = e.touches[0].clientY;
      isTrackingRef.current = true;
    } else {
      touchStartRef.current = null;
      isTrackingRef.current = false;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Check scroll position on every move - user might have scrolled
    const scrollTop = getScrollTop();
    
    // If we're not at the top, stop tracking and allow normal scroll
    if (scrollTop > 0) {
      touchStartRef.current = null;
      isTrackingRef.current = false;
      setPullDistance(0);
      setIsPulling(false);
      return;
    }
    
    // If we weren't tracking from start, don't interfere
    if (!isTrackingRef.current || touchStartRef.current === null) {
      return;
    }

    const touchY = e.touches[0].clientY;
    const distance = Math.max(0, (touchY - touchStartRef.current) / resistance);
    
    // Only prevent default if we're actually pulling down (not scrolling up)
    if (distance > 10) {
      e.preventDefault();
      setPullDistance(distance);
      setIsPulling(distance > threshold);
    } else {
      // Small movement - don't interfere with normal scrolling
      setPullDistance(0);
      setIsPulling(false);
    }
  }, [threshold, resistance]);

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    // Reset tracking state
    touchStartRef.current = null;
    isTrackingRef.current = false;
    setPullDistance(0);
    setIsPulling(false);
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const element = document.body;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isPulling,
    isRefreshing,
    pullDistance: Math.min(pullDistance, threshold * 1.5),
    shouldTrigger: isPulling && pullDistance > threshold
  };
}
