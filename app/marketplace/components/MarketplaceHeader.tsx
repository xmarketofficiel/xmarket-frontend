import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, User, Search, X, Filter } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import type { MarketplaceHeaderProps } from '../types';
import { useState, useRef, useEffect } from 'react';

/**
 * Marketplace Header Component
 * Top navigation with search and actions
 */
export function MarketplaceHeader({ 
  user, 
  searchQuery,
  onSearchChange,
  onSearch,
  showFilters = false,
  onToggleFilters
}: MarketplaceHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    onSearchChange('');
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000, 
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
      className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/50 sticky top-0 z-40"
    >
      <div className="px-4 py-3">
        <AnimatePresence mode="wait">
          {!isSearchExpanded ? (
            // Normal Header
            <motion.div 
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between"
            >
              {/* Logo and Title */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#009F9C] to-[#00B8B5] rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Marketplace</h1>
                  <p className="text-xs text-gray-500">Find what you need</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Search Icon */}
                <motion.button
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Expanded Search
            <motion.form
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSearchSubmit}
              className="flex items-center space-x-3"
            >
              {/* Search Input */}
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search items, categories, or sellers..."
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009F9C] focus:border-transparent"
                  />
                </div>
                
                {/* Filter Button */}
                {onToggleFilters && (
                  <motion.button
                    type="button"
                    onClick={onToggleFilters}
                    className={`p-2 rounded-lg transition-colors ${
                      showFilters 
                        ? 'bg-[#009F9C] text-white' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Filter className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                type="button"
                onClick={handleSearchClose}
                className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
