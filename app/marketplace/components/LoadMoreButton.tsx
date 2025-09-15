import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { SkeletonBox } from '../../../components/skeletons/SkeletonComponents';
import type { LoadMoreButtonProps } from '../types';

/**
 * Load More Button Component
 * Infinite scroll trigger with progress indicator
 */
export function LoadMoreButton({
  hasMore,
  loading,
  onClick,
  itemsShown,
  totalItems
}: LoadMoreButtonProps) {
  if (!hasMore && !loading) return null;

  const progress = totalItems > 0 ? (itemsShown / totalItems) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center py-8 space-y-4"
    >
      {/* Progress indicator */}
      {totalItems > 0 && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Showing {itemsShown.toLocaleString()}</span>
            <span>of {totalItems.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-[#009F9C] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Load more button */}
      {hasMore && (
        <motion.button
          onClick={onClick}
          disabled={loading}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
            ${loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#009F9C] text-white hover:bg-[#008A87] shadow-lg hover:shadow-xl'
            }
          `}
          whileHover={loading ? {} : { scale: 1.05 }}
          whileTap={loading ? {} : { scale: 0.95 }}
        >
          {loading ? (
            <SkeletonBox className="w-32 h-6" />
          ) : (
            <>
              <ChevronUp className="w-5 h-5 rotate-180" />
              <span>Load More Items</span>
            </>
          )}
        </motion.button>
      )}

      {/* End of results message */}
      {!hasMore && itemsShown > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500"
        >
          <div className="flex items-center space-x-3">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-sm">You've seen all items</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>
          <p className="text-xs mt-2">
            Found something you like? Check back later for new items!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
