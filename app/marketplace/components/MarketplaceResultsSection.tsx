/**
 * Marketplace Results Section - Lazy Loaded Component
 * Contains search results, items grid, and load more functionality
 */

'use client';

import React, { memo } from 'react';
import { Item } from '../../../types';
import { SearchResultsHeader } from './SearchResultsHeader';
import { EmptyState } from './EmptyState';
import { LoadMoreButton } from './LoadMoreButton';
import Feed from '../../../components/Feed';
import { SkeletonGrid } from '../../../components/skeletons/SkeletonComponents';

interface ResultsSectionProps {
  items: Item[];
  loading: boolean;
  searchQuery: string;
  selectedCategory: string;
  totalItems: number;
  hasMore: boolean;
  onLoadMore: () => void;

  onClearFilters: () => void;
  viewMode: 'grid' | 'list';
}

const MarketplaceResultsSectionComponent: React.FC<ResultsSectionProps> = ({
  items,
  loading,
  searchQuery,
  selectedCategory,
  totalItems,
  hasMore,
  onLoadMore,
  onClearFilters,
  viewMode
}: ResultsSectionProps) => {
  // Loading state for initial load
  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-6 w-48" />
        </div>
        <SkeletonGrid count={12} />
      </div>
    );
  }

  // Empty state
  if (!loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EmptyState
          type={searchQuery ? 'noSearch' : 'noItems'}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onAction={onClearFilters}
        />
      </div>
    );
  }

  // Results with items
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SearchResultsHeader
        totalResults={totalItems}
        searchQuery={searchQuery}
        onClearSearch={onClearFilters}
      />

      <div className="space-y-6">
        <Feed
          items={items}
          loading={loading}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
        />
        
        <LoadMoreButton
          hasMore={hasMore}
          loading={loading}
          onClick={onLoadMore}
          itemsShown={items.length}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}

export const MarketplaceResultsSection = MarketplaceResultsSectionComponent;