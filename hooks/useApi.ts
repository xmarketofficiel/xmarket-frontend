'use client';
import { useState, useCallback, useEffect } from 'react';
import { useAsync } from './useAsync';
import { ApiError } from '../lib/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

/**
 * Generic hook for API calls with loading, error, and data state management
 * Consolidates repeated patterns across components
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<{ data: T }>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { onSuccess, onError, immediate = false } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunction(...args);
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      
      // Log API errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', {
          function: apiFunction.name,
          args,
          error: error.message,
          stack: error.stack
        });
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Execute immediately if requested - use a separate effect with controlled dependencies
  useEffect(() => {
    if (immediate) {
      // Create a ref to track if we've already executed to prevent double execution
      let mounted = true;
      const runInitialExecution = async () => {
        if (mounted) {
          await execute();
        }
      };
      runInitialExecution();
      
      return () => {
        mounted = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]); // Only depend on immediate, not execute to prevent infinite loop

  return { data, loading, error, execute, reset };
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T = any>(
  apiFunction: (params: { page: number; limit: number; [key: string]: any }) => Promise<{ data: { items: T[]; total: number; hasMore: boolean } }>,
  initialParams: { page?: number; limit?: number; [key: string]: any } = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialParams.page || 1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, execute, reset: resetAsync } = useAsync(apiFunction, {
    immediate: false
  });

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      const response = await execute({
        ...initialParams,
        page: page + 1,
        limit: initialParams.limit || 10
      });

      if (response && response.data) {
        setItems(prev => [...prev, ...response.data.items]);
        setPage(prev => prev + 1);
        setHasMore(response.data.hasMore);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Failed to load more items:', error);
    }
  }, [execute, hasMore, loading, page, initialParams]);

  const refresh = useCallback(async () => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setTotal(0);
    
    try {
      const response = await execute({
        ...initialParams,
        page: 1,
        limit: initialParams.limit || 10
      });

      if (response && response.data) {
        setItems(response.data.items);
        setHasMore(response.data.hasMore);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Failed to refresh items:', error);
    }
  }, [execute, initialParams]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setTotal(0);
    setHasMore(true);
    resetAsync();
  }, [resetAsync]);

  // Load initial data
  useEffect(() => {
    refresh();
  }, []);

  return {
    items,
    loading,
    error,
    hasMore,
    total,
    page,
    loadMore,
    refresh,
    reset
  };
}
