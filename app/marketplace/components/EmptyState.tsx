import { motion } from 'framer-motion';
import { EMPTY_STATES } from '../constants';
import type { EmptyStateProps } from '../types';

/**
 * Empty State Component
 * Shows appropriate empty state based on context
 */
export function EmptyState({
  type,
  searchQuery,
  selectedCategory,
  onAction
}: EmptyStateProps) {
  const config = EMPTY_STATES[type];
  
  const getTitle = () => {
    switch (type) {
      case 'noItems':
        if (searchQuery) {
          return `No results for "${searchQuery}"`;
        }
        if (selectedCategory && selectedCategory !== 'all') {
          return `No items in ${selectedCategory}`;
        }
        return config.title;
      default:
        return config.title;
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'noItems':
        if (searchQuery) {
          return 'Try different keywords or browse by category';
        }
        if (selectedCategory && selectedCategory !== 'all') {
          return `No items available in this category yet`;
        }
        return config.description;
      default:
        return config.description;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-6xl mb-4"
      >
        {config.icon}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-gray-900 mb-2"
      >
        {getTitle()}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-6 max-w-md"
      >
        {getDescription()}
      </motion.p>

      {/* Action Button */}
      {'action' in config && config.action && onAction && (
        <motion.button
          onClick={onAction}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-6 py-3 bg-[#009F9C] text-white rounded-lg font-medium hover:bg-[#008A87] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {config.action}
        </motion.button>
      )}

      {/* Additional suggestions for no items */}
      {type === 'noItems' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-2">Quick suggestions:</h4>
          <div className="flex flex-wrap gap-2">
            {['textbooks', 'laptop', 'furniture', 'phone'].map((suggestion) => (
              <span
                key={suggestion}
                className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 border border-gray-200"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
