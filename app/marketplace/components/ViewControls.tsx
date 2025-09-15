import { Grid, List, SlidersHorizontal, Filter } from 'lucide-react';
import { SkeletonLine } from '../../../components/skeletons/SkeletonComponents';
import type { ViewControlsProps } from '../types';

/**
 * View Controls Component
 * Toggle between grid/list view and show/hide filters
 */
export function ViewControls({ 
  viewMode, 
  onViewModeChange, 
  showFilters, 
  onToggleFilters, 
  itemCount, 
  loading = false 
}: ViewControlsProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-200">
      {/* Results count */}
      <div className="flex items-center space-x-3">
        <div className="text-sm text-gray-600">
          {loading ? (
            <SkeletonLine className="w-24 h-4" />
          ) : (
            <span>
              <span className="font-semibold text-gray-900">{itemCount.toLocaleString()}</span>{' '}
              <span className="hidden sm:inline">
                {itemCount === 1 ? 'item' : 'items'}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* View Mode Toggle - Hide on mobile since we use different layouts */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${viewMode === 'grid' 
                ? 'bg-white text-[#009F9C] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onViewModeChange('list')}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${viewMode === 'list' 
                ? 'bg-white text-[#009F9C] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={onToggleFilters}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 font-medium
            ${showFilters 
              ? 'bg-[#009F9C] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          aria-label={showFilters ? 'Hide filters' : 'Show filters'}
        >
          {showFilters ? (
            <Filter className="w-4 h-4" />
          ) : (
            <SlidersHorizontal className="w-4 h-4" />
          )}
          <span className="text-sm hidden sm:block">
            {showFilters ? 'Hide Filters' : 'Filters'}
          </span>
        </button>
      </div>
    </div>
  );
}
