import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { SEARCH_SUGGESTIONS } from '../constants';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import type { SearchBarProps } from '../types';

/**
 * Enhanced Search Bar Component
 * Features autocomplete, suggestions, and search history
 */
export function SearchBar({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "Search for textbooks, electronics, furniture...",
  suggestions = [],
  loading = false 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const allSuggestions = [
    ...SEARCH_SUGGESTIONS.trending.map(item => ({ type: 'trending', text: item })),
    ...SEARCH_SUGGESTIONS.popular.map(item => ({ type: 'popular', text: item }))
  ];

  const filteredSuggestions = value.length > 0
    ? allSuggestions.filter(item => 
        item.text.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6)
    : allSuggestions.slice(0, 8);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className={`
        design-card relative flex items-center bg-white border-2 rounded-xl transition-all
        ${isFocused 
          ? 'border-[#009F9C] shadow-lg shadow-[#009F9C]/20' 
          : 'border-[--color-border] hover:border-gray-300'
        }
      `}
      style={{
        transitionDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
      }}
      >
        <Search className={`
          w-5 h-5 ml-3 transition-colors
          ${isFocused ? 'text-[#009F9C]' : 'text-gray-400'}
        `}
        style={{
          transitionDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
          transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
        }}
        />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-3 py-3 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none"
          aria-label="Search marketplace"
        />

        {/* Loading indicator */}
        {loading && (
          <div className="mr-3">
            <div className="w-4 h-4 border-2 border-[#009F9C] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Clear button */}
        {value && !loading && (
          <motion.button
            onClick={onClear}
            className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              duration: ANIMATION_SYSTEM.duration.fast / 1000,
              ease: 'easeOut'
            }}
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400" />
          </motion.button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              duration: ANIMATION_SYSTEM.duration.normal / 1000,
              ease: 'easeOut'
            }}
            className="design-card absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-[--color-border] rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {/* Suggestions Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {value ? 'Suggestions' : 'Popular Searches'}
                </span>
                {value && (
                  <span className="text-xs text-gray-500">
                    {filteredSuggestions.length} results
                  </span>
                )}
              </div>
            </div>

            {/* Suggestions List */}
            <div className="py-2">
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={`${suggestion.type}-${suggestion.text}`}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full px-4 py-3 text-left hover:bg-[#006666]/5 transition-all active:scale-[0.99] flex items-center space-x-3"
                  whileHover={{ 
                    backgroundColor: 'rgb(0, 102, 102, 0.05)',
                    scale: 1.01
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: ANIMATION_SYSTEM.duration.fast / 1000,
                    ease: 'easeOut'
                  }}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all
                    ${suggestion.type === 'trending' 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'bg-blue-100 text-blue-600'
                    }
                  `}
                  style={{
                    transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
                    transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                  }}
                  >
                    {suggestion.type === 'trending' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <span className="text-sm text-gray-900">
                      {suggestion.text}
                    </span>
                    {suggestion.type === 'trending' && (
                      <span className="ml-2 text-xs text-orange-600 font-medium">
                        Trending
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* No results message */}
            {value && filteredSuggestions.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
