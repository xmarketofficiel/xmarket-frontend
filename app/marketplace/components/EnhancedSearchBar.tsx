'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, Filter } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'category' | 'product';
  icon?: string;
  count?: number;
}

interface EnhancedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  className?: string;
}

const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', text: 'iPhone 14', type: 'trending', icon: '📱', count: 12 },
  { id: '2', text: 'MacBook Pro', type: 'trending', icon: '💻', count: 8 },
  { id: '3', text: 'Textbooks', type: 'category', icon: '📚', count: 45 },
  { id: '4', text: 'Gaming Chair', type: 'recent', icon: '🪑' },
  { id: '5', text: 'iPad', type: 'recent', icon: '📟' },
  { id: '6', text: 'Sneakers', type: 'category', icon: '👟', count: 23 },
  { id: '7', text: 'Desk Lamp', type: 'product', icon: '💡' },
  { id: '8', text: 'Headphones', type: 'trending', icon: '🎧', count: 15 },
];

/**
 * Enhanced Search Bar with autocomplete and suggestions
 * Clean design without animations for better performance
 */
export function EnhancedSearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  placeholder = "Search for items...",
  showFilters = false,
  onToggleFilters,
  className = ""
}: EnhancedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuggestions(
        MOCK_SUGGESTIONS.filter(s => s.type === 'trending' || s.type === 'recent').slice(0, 6)
      );
    } else {
      const filtered = MOCK_SUGGESTIONS.filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);
      setFilteredSuggestions(filtered);
    }
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.text);
    onSearch(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSearch = () => {
    onSearch(searchQuery);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'recent':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className={`relative bg-white rounded-xl border-2 transition-all duration-200 ${
        isFocused ? 'border-[#009F9C] shadow-lg' : 'border-gray-200 shadow-md'
      }`}>
        <div className="flex items-center">
          {/* Search Icon */}
          <div className="pl-4 pr-2">
            <Search className="w-5 h-5 text-gray-400" />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="flex-1 px-2 py-3 md:py-4 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none text-base"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Filter Toggle Button */}
          {onToggleFilters && (
            <button
              onClick={onToggleFilters}
              className={`mr-3 p-2 md:p-3 rounded-xl transition-all duration-200 ${
                showFilters
                  ? 'bg-[#009F9C] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={showFilters ? 'Hide filters' : 'Show filters'}
            >
              <Filter className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {/* Suggestions Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">
              {searchQuery ? 'Search suggestions' : 'Trending & Recent'}
            </p>
          </div>

          {/* Suggestions List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedIndex === index ? 'bg-[#009F9C]/5 border-r-2 border-[#009F9C]' : ''
                }`}
              >
                <div className="flex items-center flex-1">
                  {/* Icon */}
                  <div className="mr-3 flex items-center justify-center w-8 h-8">
                    {suggestion.icon ? (
                      <span className="text-lg">{suggestion.icon}</span>
                    ) : (
                      getSuggestionIcon(suggestion)
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      {suggestion.text}
                    </p>
                    {suggestion.type === 'trending' && (
                      <p className="text-xs text-orange-600 font-medium">
                        Trending
                      </p>
                    )}
                    {suggestion.type === 'recent' && (
                      <p className="text-xs text-gray-500">
                        Recent search
                      </p>
                    )}
                  </div>

                  {/* Count */}
                  {suggestion.count && (
                    <div className="ml-2 px-2 py-1 bg-gray-100 rounded-full">
                      <span className="text-xs font-medium text-gray-600">
                        {suggestion.count}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="ml-2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Quick:</span>
              {['Electronics', 'Books', 'Fashion'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleSuggestionClick({ 
                    id: category, 
                    text: category, 
                    type: 'category' 
                  })}
                  className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200 hover:border-[#009F9C] hover:text-[#009F9C] transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedSearchBar;