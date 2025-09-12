'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package,
  Heart,
  AlertCircle,
  RefreshCw,
  Filter,
  Search,
  Grid,
  List,
  ChevronDown
} from 'lucide-react';
import ProfileItemCard from './ProfileItemCard';
import { PROFILE_CONSTANTS } from './constants';
import type { ProfileContentProps, ProfileTab } from './types';

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeTab,
  items,
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  onItemClick,
  onItemAction
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterOpen, setFilterOpen] = useState(false);

  const EmptyState = ({ config }: { config: typeof PROFILE_CONSTANTS.EMPTY_STATES[keyof typeof PROFILE_CONSTANTS.EMPTY_STATES] }) => {
    const IconComponent = config.icon === 'Package' ? Package : Heart;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconComponent className="w-10 h-10 text-gray-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {config.title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {config.description}
          </p>
          
          {config.actionText && config.actionHref && (
            <motion.a
              href={config.actionHref}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
            >
              {config.actionText}
            </motion.a>
          )}
        </div>
      </motion.div>
    );
  };

  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {error || 'Failed to load content. Please try again.'}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
      </div>
    </motion.div>
  );

  const LoadingState = () => (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
      {Array.from({ length: PROFILE_CONSTANTS.LOADING_STATES.SKELETON_ITEMS }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-4 animate-pulse"
        >
          <div className="h-48 bg-gray-200 rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  const ControlsBar = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 mb-6"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-[#009F9C] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-[#009F9C] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="most-viewed">Most Viewed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (error) {
    return <ErrorState />;
  }

  if (loading && (!items || items.length === 0)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.CONTENT }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <LoadingState />
      </motion.div>
    );
  }

  if (!items || items.length === 0) {
    const emptyStateConfig = PROFILE_CONSTANTS.EMPTY_STATES[activeTab.toUpperCase().replace('-', '_') as keyof typeof PROFILE_CONSTANTS.EMPTY_STATES];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.CONTENT }}
        className="bg-white rounded-2xl shadow-lg"
      >
        <EmptyState config={emptyStateConfig || PROFILE_CONSTANTS.EMPTY_STATES.MY_ITEMS} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.CONTENT }}
      className="space-y-6"
    >
      {/* Controls */}
      <ControlsBar />

      {/* Items Grid/List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              grid gap-6
              ${viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
              }
            `}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProfileItemCard
                  item={item}
                  onClick={onItemClick}
                  onAction={onItemAction}
                  compact={viewMode === 'list'}
                  showActions={activeTab === 'my-items'}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileContent;
