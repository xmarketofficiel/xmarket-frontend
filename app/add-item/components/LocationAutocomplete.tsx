'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';

interface LocationSuggestion {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    street?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface LocationAutocompleteProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label: string;
  required?: boolean;
}

export default function LocationAutocomplete({
  id,
  name,
  value,
  onChange,
  placeholder = 'e.g., Casablanca',
  error,
  label,
  required = false,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        console.log('🖱️ [LocationAutocomplete] Click outside detected, closing dropdown');
        setShowDropdown(false);
      }
    };

    // Use 'mousedown' with a slight delay to avoid conflicts with input focus
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    console.log('🔍 [LocationAutocomplete] fetchSuggestions called with query:', query);
    
    if (query.trim().length < 2) {
      console.log('⚠️ [LocationAutocomplete] Query too short, skipping API call');
      setSuggestions([]);
      return;
    }

    console.log('⏳ [LocationAutocomplete] Starting API call...');
    setIsLoading(true);
    try {
      const apiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8&lat=31.7917&lon=-7.0926&lang=en`;
      console.log('📡 [LocationAutocomplete] Fetching:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      console.log('✅ [LocationAutocomplete] API response:', data.features.length, 'results');
      
      const moroccanResults = data.features.filter((feature: LocationSuggestion) => 
        feature.properties.country?.toLowerCase().includes('maroc') || 
        feature.properties.country?.toLowerCase().includes('morocco')
      );

      const finalResults = moroccanResults.length > 0 ? moroccanResults : data.features.slice(0, 8);
      console.log('📍 [LocationAutocomplete] Setting suggestions:', finalResults.length, 'items');
      setSuggestions(finalResults);
    } catch (error) {
      console.error('❌ [LocationAutocomplete] Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
      console.log('✔️ [LocationAutocomplete] API call finished');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('⌨️ [LocationAutocomplete] Input changed:', newValue);
    setInputValue(newValue);
    onChange(newValue);
    
    // Always keep dropdown open while typing
    if (!showDropdown) {
      setShowDropdown(true);
      console.log('👁️ [LocationAutocomplete] Dropdown opened');
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      console.log('⏰ [LocationAutocomplete] Debounce timer fired');
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    const locationName = formatLocationName(suggestion);
    setInputValue(locationName);
    onChange(locationName);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const formatLocationName = (suggestion: LocationSuggestion): string => {
    const { name, city, state, country } = suggestion.properties;
    const parts = [];
    
    if (name) parts.push(name);
    if (city && city !== name) parts.push(city);
    if (state && state !== city) parts.push(state);
    
    return parts.join(', ') || city || name || 'Unknown location';
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            console.log('🎯 [LocationAutocomplete] Input focused');
            setShowDropdown(true);
            if (inputValue.trim().length >= 2 && suggestions.length === 0) {
              fetchSuggestions(inputValue);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />
        
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {(() => {
        console.log('🎨 [LocationAutocomplete] Render check - showDropdown:', showDropdown, 'suggestions:', suggestions.length, 'isLoading:', isLoading);
        return null;
      })()}
      
      {showDropdown && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2">Searching...</span>
            </div>
          ) : (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => {
                const locationName = formatLocationName(suggestion);
                const { city, state, country } = suggestion.properties;
                const subtitle = [city, state, country].filter((v, i, arr) => 
                  v && !locationName.includes(v)
                ).join(', ');

                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-start gap-3 group"
                    >
                      <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {locationName}
                        </div>
                        {subtitle && (
                          <div className="text-sm text-gray-500 truncate">
                            {subtitle}
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {showDropdown && !isLoading && suggestions.length === 0 && inputValue.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4">
          <p className="text-sm text-gray-500 text-center">
            No locations found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}
