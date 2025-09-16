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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {getTitle()}
      </h3>

      {/* Action Button for search */}
      {type === 'noItems' && searchQuery && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#009F9C] text-white rounded-lg text-sm font-medium hover:bg-[#008A87] transition-colors"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
