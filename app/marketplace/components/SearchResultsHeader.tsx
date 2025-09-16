import { motion } from 'framer-motion';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import { SkeletonLine } from '../../../components/skeletons/SkeletonComponents';
import type { SearchResultsHeaderProps } from '../types';

/**
 * Search Results Header Component
 * Shows search query, result count, and clear action
 */
export function SearchResultsHeader({
  searchQuery,
  totalResults,
  onClearSearch,
  loading = false
}: SearchResultsHeaderProps) {
  if (!searchQuery && !loading) return null;

  return (
    <div className="px-4 py-2 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between">
        {loading ? (
          <SkeletonLine className="w-32 h-4" />
        ) : (
          <div className="text-sm text-gray-700">
            <span className="font-medium">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
          </div>
        )}

        {searchQuery && !loading && (
          <button
            onClick={onClearSearch}
            className="text-[#009F9C] hover:text-[#008A87] text-sm font-medium"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
