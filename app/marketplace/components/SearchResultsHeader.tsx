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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: 'easeOut'
      }}
      className="design-card px-4 py-3 bg-blue-50/80 backdrop-blur-sm border-b border-blue-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {loading ? (
            <SkeletonLine className="w-48 h-4" />
          ) : (
            <div className="text-sm text-blue-800">
              <span className="font-semibold">{totalResults.toLocaleString()}</span>{' '}
              {totalResults === 1 ? 'result' : 'results'} for{' '}
              <span className="font-medium">"{searchQuery}"</span>
            </div>
          )}
        </div>

        {searchQuery && !loading && (
          <motion.button
            onClick={onClearSearch}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              duration: ANIMATION_SYSTEM.duration.fast / 1000,
              ease: 'easeOut'
            }}
          >
            Clear
          </motion.button>
        )}
      </div>

      {/* Search suggestions for no results */}
      {!loading && totalResults === 0 && searchQuery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ 
            delay: 0.2,
            duration: ANIMATION_SYSTEM.duration.normal / 1000,
            ease: 'easeOut'
          }}
          className="mt-2 pt-2 border-t border-blue-200"
        >
          <p className="text-xs text-blue-600">
            Try searching for: textbooks, electronics, furniture, or browse by category
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
