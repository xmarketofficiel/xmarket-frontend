import { motion } from 'framer-motion';
import { Grid, List, SlidersHorizontal, Filter } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between py-4 px-4 bg-white border-b border-gray-100"
    >
      {/* Results count */}
      <div className="flex items-center space-x-3">
        <div className="text-sm text-gray-600">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#009F9C] rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <span>
              <span className="font-semibold text-gray-900">{itemCount.toLocaleString()}</span>{' '}
              {itemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <motion.button
            onClick={() => onViewModeChange('grid')}
            className={`
              p-2 rounded-md transition-all duration-200
              ${viewMode === 'grid' 
                ? 'bg-white text-[#009F9C] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={() => onViewModeChange('list')}
            className={`
              p-2 rounded-md transition-all duration-200
              ${viewMode === 'list' 
                ? 'bg-white text-[#009F9C] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Filter Toggle */}
        <motion.button
          onClick={onToggleFilters}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
            ${showFilters 
              ? 'bg-[#009F9C] text-white shadow-lg shadow-[#009F9C]/25' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={showFilters ? 'Hide filters' : 'Show filters'}
        >
          {showFilters ? (
            <Filter className="w-4 h-4" />
          ) : (
            <SlidersHorizontal className="w-4 h-4" />
          )}
          <span className="text-sm font-medium hidden sm:block">
            {showFilters ? 'Hide Filters' : 'Filters'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
