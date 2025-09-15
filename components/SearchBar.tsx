'use client';

import { Search, X, Clock, TrendingUp } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import { ANIMATION_SYSTEM } from '../lib/design-system';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search items...", 
  onSearch,
  suggestions: externalSuggestions = []
}: SearchBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Simple debounced search
  useEffect(() => {
    if (value.length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        onSearch?.(value);
        setIsSearching(false);
        // Add to recent searches
        setRecentSearches(prev => {
          if (!prev.includes(value)) {
            return [value, ...prev.slice(0, 4)];
          }
          return prev;
        });
      }, 300);
      return () => clearTimeout(timer);
    } else if (value.length === 0) {
      onSearch?.('');
      setIsSearching(false);
    }
  }, [value, onSearch]);

  // Popular search suggestions
  const popularSuggestions = ['MacBook', 'iPhone', 'PlayStation', 'Camera', 'Furniture'];
  
  // Combine suggestions: recent searches + external suggestions + popular
  const allSuggestions = [
    ...recentSearches,
    ...externalSuggestions,
    ...popularSuggestions
  ].filter((item, index, arr) => arr.indexOf(item) === index).slice(0, 8);

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <div className="relative design-card">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search 
            className={`h-4 w-4 transition-all ${
              isSearching ? 'text-[#006666] animate-pulse' : 'text-gray-400'
            }`}
            style={{
              transitionDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeInOut
            }}
          />
        </div>
        <input
          ref={searchRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-10 py-3 border border-[--color-border] rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#006666]/20 focus:border-[#006666] shadow-sm hover:shadow-md transition-all"
          style={{
            transitionDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
            transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
          }}
          placeholder={placeholder}
          aria-label="Search for items"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-controls="search-suggestions"
          role="combobox"
          autoComplete="off"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              setShowSuggestions(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all hover:scale-110"
            style={{
              transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
            }}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}

        {/* Search Suggestions Dropdown */}
        {showSuggestions && allSuggestions.length > 0 && (
          <div 
            id="search-suggestions"
            className="design-card absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border border-[--color-border] rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto z-50 animate-in fade-in-0 slide-in-from-top-2"
            style={{
              animationDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
              animationTimingFunction: ANIMATION_SYSTEM.easing.easeOut
            }}
            role="listbox"
          >
            <div className="p-2">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500 px-2 py-1 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Recent searches
                  </div>
                  {recentSearches.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={`recent-${index}`}
                      onClick={() => {
                        onChange(suggestion);
                        setShowSuggestions(false);
                        onSearch?.(suggestion);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#006666]/5 rounded text-sm flex items-center transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
                        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                      }}
                    >
                      <Clock size={14} className="mr-2 text-gray-400" />
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Suggestions */}
              {value.length === 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-500 px-2 py-1 flex items-center">
                    <TrendingUp size={12} className="mr-1" />
                    Popular searches
                  </div>
                  {popularSuggestions.map((suggestion, index) => (
                    <button
                      key={`popular-${index}`}
                      onClick={() => {
                        onChange(suggestion);
                        setShowSuggestions(false);
                        onSearch?.(suggestion);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#006666]/5 rounded text-sm flex items-center transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
                        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                      }}
                    >
                      <TrendingUp size={14} className="mr-2 text-gray-400" />
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* External suggestions (filtered results) */}
              {value.length > 0 && externalSuggestions.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-500 px-2 py-1">
                    Suggestions
                  </div>
                  {externalSuggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={`external-${index}`}
                      onClick={() => {
                        onChange(suggestion);
                        setShowSuggestions(false);
                        onSearch?.(suggestion);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#006666]/5 rounded text-sm flex items-center transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
                        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                      }}
                    >
                      <Search size={14} className="mr-2 text-gray-400" />
                      <span className="text-gray-700">
                        {suggestion.split(new RegExp(`(${value})`, 'gi')).map((part, i) => 
                          part.toLowerCase() === value.toLowerCase() ? (
                            <mark key={i} className="bg-yellow-200 rounded px-1">{part}</mark>
                          ) : (
                            part
                          )
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}