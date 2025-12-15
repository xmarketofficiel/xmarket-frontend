import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, User, Search, X, Filter, Zap } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import type { MarketplaceHeaderProps } from '../types';
import { useState, useRef, useEffect } from 'react';
import type { MarketplaceMode } from './ModeToggle';

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
  onToggleFilters,
  mode,
  onModeChange
}: MarketplaceHeaderProps & { mode?: MarketplaceMode; onModeChange?: (mode: MarketplaceMode) => void }) {
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
    <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/50 md:sticky md:top-0 md:z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: ANIMATION_SYSTEM.duration.normal / 1000, 
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }}
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
              <div className="flex items-center space-x-1">
                <svg width="32" height="32" viewBox="0 0 293 293" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="293" height="293" rx="15" fill="#009F9C"/>
                  <path d="M201.938 152.832L201.938 152.833L201.939 152.835C201.94 152.837 201.941 152.839 201.942 152.843L202.011 152.994C202.059 153.101 202.131 153.261 202.226 153.471C202.415 153.89 202.695 154.51 203.057 155.312C203.78 156.915 204.831 159.245 206.144 162.154C208.768 167.972 212.436 176.105 216.61 185.359C220.609 194.225 225.073 204.121 229.529 214H196.619C194.072 208.354 191.589 202.85 189.264 197.694C185.089 188.44 181.421 180.308 178.797 174.49C178.722 174.325 178.649 174.161 178.576 174H114.953L96.9102 214H64L91.5918 152.832L95.5752 144H197.954L201.938 152.832ZM133.578 111H160.354C161.784 106.586 163.585 101.029 165.583 94.8604C167.099 90.1817 168.729 85.1511 170.397 80H201.933C199.242 88.3047 196.538 96.6524 194.123 104.106C191.679 111.651 189.532 118.279 187.995 123.022C187.227 125.394 186.611 127.294 186.188 128.602C185.976 129.255 185.813 129.761 185.702 130.103C185.647 130.273 185.604 130.404 185.576 130.491C185.562 130.535 185.551 130.568 185.544 130.59C185.541 130.6 185.538 130.609 185.536 130.614C185.535 130.617 185.535 130.62 185.534 130.621L185.533 130.622C185.529 130.621 185.28 130.541 171.263 126L185.533 130.623L182.171 141H111.762L108.399 130.623L92 80H123.535L133.578 111Z" fill="white"/>
                </svg>
                <h1 className="text-2xl font-bold text-green-700 bg-gradient-to-r from-[#009F9C] to-[#007B78] bg-clip-text text-transparent">Market</h1>
              </div>

              {/* Mode Toggle - Desktop Only */}
              {mode !== undefined && onModeChange && (
                <div className="hidden md:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={() => onModeChange('products')}
                    className={`
                      flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold min-w-[200px]
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                      ${mode === 'products'
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <ShoppingBag className={`w-5 h-5 ${mode === 'products' ? 'animate-pulse' : ''}`} />
                    <span className="text-base">Products</span>
                  </button>
                  
                  <button
                    onClick={() => onModeChange('services')}
                    className={`
                      flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold min-w-[200px]
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                      ${mode === 'services'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Zap className={`w-5 h-5 ${mode === 'services' ? 'animate-pulse' : ''}`} />
                    <span className="text-base">Services</span>
                  </button>
                </div>
              )}

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
                
                {/* Filter Button - COMMENTED OUT - Functionality not implemented yet */}
                {/* {onToggleFilters && (
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
                )} */}
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
    </div>
  );
}
