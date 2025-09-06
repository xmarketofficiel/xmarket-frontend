'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseSearchOptions {
  delay?: number;
  minLength?: number;
  onSearch?: (query: string) => void;
  onClear?: () => void;
}

export const useDebounceSearch = ({
  delay = 300,
  minLength = 2,
  onSearch,
  onClear
}: UseSearchOptions = {}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= minLength) {
      setIsSearching(true);
      onSearch?.(debouncedQuery);
      // Simulate search completion
      setTimeout(() => setIsSearching(false), 100);
    } else if (debouncedQuery.length === 0) {
      onClear?.();
      setIsSearching(false);
    }
  }, [debouncedQuery, minLength, onSearch, onClear]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setShowSuggestions(newQuery.length > 0);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearching(false);
    onClear?.();
  }, [onClear]);

  const handleSelectSuggestion = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Trigger immediate search
    setDebouncedQuery(suggestion);
  }, []);

  const addSuggestion = useCallback((suggestion: string) => {
    setSuggestions(prev => {
      if (!prev.includes(suggestion)) {
        return [suggestion, ...prev.slice(0, 4)]; // Keep only 5 suggestions
      }
      return prev;
    });
  }, []);

  return {
    query,
    debouncedQuery,
    isSearching,
    suggestions,
    showSuggestions,
    handleQueryChange,
    handleClear,
    handleSelectSuggestion,
    addSuggestion,
    setShowSuggestions,
  };
};
