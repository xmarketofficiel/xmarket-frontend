'use client';

import React, { useState } from 'react';
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
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <IconComponent className="w-10 h-10 text-gray-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {config.title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {config.description}
          </p>
          
          {config.actionText && config.actionHref && (
            <a
              href={config.actionHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-xl hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
            >
              {config.actionText}
            </a>
          )}
        </div>
      </div>
    );
  };

  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {error || 'Failed to load content. Please try again.'}
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#009F9C] text-white rounded-xl hover:bg-[#007A77] transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid-cols-1 gap-3'}`}>
      {Array.from({ length: PROFILE_CONSTANTS.LOADING_STATES.SKELETON_ITEMS }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
        >
          <div className="h-48 bg-gray-100 rounded-lg mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  const ControlsBar = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009F9C] focus:border-[#009F9C] transition-colors text-sm"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#009F9C] text-white' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#009F9C] text-white' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-[#009F9C] focus:border-[#009F9C] transition-colors min-w-[140px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="most-viewed">Most Viewed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
    </div>
  );

  if (error) {
    return <ErrorState />;
  }

  if (loading && (!items || items.length === 0)) {
    return <LoadingState />;
  }

  if (!items || items.length === 0) {
    const emptyStateConfig = PROFILE_CONSTANTS.EMPTY_STATES[activeTab.toUpperCase().replace('-', '_') as keyof typeof PROFILE_CONSTANTS.EMPTY_STATES];
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <EmptyState config={emptyStateConfig || PROFILE_CONSTANTS.EMPTY_STATES.MY_ITEMS} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <ControlsBar />

      {/* Items Grid/List */}
      <div className={`
        grid gap-4
        ${viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
        }
      `}>
        {items.map((item) => (
          <ProfileItemCard
            key={item.id}
            item={item}
            onClick={onItemClick}
            onAction={onItemAction}
            compact={viewMode === 'list'}
            showActions={activeTab === 'my-items'}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#009F9C] text-white rounded-xl hover:bg-[#007A77] transition-colors font-medium disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-20 bg-white/20 rounded animate-pulse" />
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;