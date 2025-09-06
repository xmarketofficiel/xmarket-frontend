'use client';
import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | undefined>;
  reset: () => void;
}

/**
 * Hook for handling async operations with loading and error states
 * Prevents race conditions and handles cleanup
 */
export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const { immediate = false, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);
  
  // Use ref to track if component is still mounted
  const mountedRef = useRef(true);
  const currentPromiseRef = useRef<Promise<T> | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T | undefined> => {
    try {
      setLoading(true);
      setError(null);

      const promise = asyncFunction(...args);
      currentPromiseRef.current = promise;

      const result = await promise;

      // Only update state if component is still mounted and this is the current promise
      if (mountedRef.current && currentPromiseRef.current === promise) {
        setData(result);
        onSuccess?.(result);
        return result;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setError(error);
        onError?.(error);
      }
    } finally {
      // Only update loading if component is still mounted
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setData(null);
      setError(null);
      setLoading(false);
      currentPromiseRef.current = null;
    }
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for debounced async operations
 */
export function useDebouncedAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  delay: number = 300,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> & { debouncedExecute: (...args: any[]) => void } {
  const asyncResult = useAsync(asyncFunction, { ...options, immediate: false });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedExecute = useCallback((...args: any[]) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      asyncResult.execute(...args);
    }, delay);
  }, [asyncResult.execute, delay]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    ...asyncResult,
    debouncedExecute
  };
}

/**
 * Hook for handling multiple async operations
 */
export function useAsyncQueue() {
  const [queue, setQueue] = useState<Promise<any>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToQueue = useCallback((asyncFunction: () => Promise<any>) => {
    const promise = asyncFunction();
    
    setQueue(prev => [...prev, promise]);

    promise.finally(() => {
      setQueue(prev => prev.filter(p => p !== promise));
    });

    return promise;
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing || queue.length === 0) return;

    setIsProcessing(true);
    
    try {
      await Promise.all(queue);
    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [queue, isProcessing]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    queueLength: queue.length,
    isProcessing,
    addToQueue,
    processQueue,
    clearQueue
  };
}
