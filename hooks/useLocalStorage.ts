'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for localStorage with automatic JSON serialization
 * Consolidates localStorage patterns across the app
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Clear the stored value
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Get from local storage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue, clearValue];
}

/**
 * Hook for session storage with automatic JSON serialization
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error clearing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.sessionStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue, clearValue];
}

/**
 * Hook for managing multiple localStorage keys with a namespace
 */
export function useNamespacedStorage(namespace: string) {
  const getKey = useCallback((key: string) => `${namespace}-${key}`, [namespace]);
  
  const setItem = useCallback((key: string, value: any) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(getKey(key), JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting namespaced storage "${namespace}.${key}":`, error);
    }
  }, [namespace, getKey]);

  const getItem = useCallback((key: string, defaultValue?: any) => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(getKey(key));
        return item ? JSON.parse(item) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error getting namespaced storage "${namespace}.${key}":`, error);
      return defaultValue;
    }
  }, [namespace, getKey]);

  const removeItem = useCallback((key: string) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(getKey(key));
      }
    } catch (error) {
      console.error(`Error removing namespaced storage "${namespace}.${key}":`, error);
    }
  }, [namespace, getKey]);

  const clear = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage).filter(key => key.startsWith(`${namespace}-`));
        keys.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.error(`Error clearing namespaced storage "${namespace}":`, error);
    }
  }, [namespace]);

  return { setItem, getItem, removeItem, clear };
}
