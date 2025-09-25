/**
 * Marketplace Search Section - Lazy Loaded Component
 * Contains search bar, category filters, and view controls
 */

'use client';

import { memo } from 'react';
import { MarketplaceHeader } from './MarketplaceHeader';
import { EnhancedSearchBar } from './EnhancedSearchBar';
import { CategoryFilter } from './CategoryFilter';
import { ViewControls } from './ViewControls';
import { SkeletonSearchBar, SkeletonCategoryFilter } from '../../../components/skeletons/SkeletonComponents';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onShowAdvancedFilters: () => void;
  itemCount: number;
  loading?: boolean;
}

function MarketplaceSearchSectionComponent({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  categories,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onShowAdvancedFilters,
  itemCount,
  loading = false
}: SearchSectionProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarketplaceHeader
            user={null}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSearch={(q: string) => { onSearchChange(q); onSearchSubmit(); }}
            showFilters={false}
          />
          <div className="pb-6 space-y-4">
            <SkeletonSearchBar />
            <SkeletonCategoryFilter />
            <div className="flex justify-between items-center">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-32" />
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarketplaceHeader
          user={null}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearch={(q: string) => { onSearchChange(q); onSearchSubmit(); }}
          showFilters={false}
        />
        <div className="pb-6 space-y-4">
          <EnhancedSearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSearch={() => onSearchSubmit()}
            placeholder="Search for items..."
            showFilters
            onToggleFilters={onShowAdvancedFilters}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={onCategoryChange}
          />

          <ViewControls
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            showFilters={false}
            onToggleFilters={onShowAdvancedFilters}
            itemCount={itemCount}
          />
        </div>
      </div>
    </div>
  );
}

export const MarketplaceSearchSection = MarketplaceSearchSectionComponent;