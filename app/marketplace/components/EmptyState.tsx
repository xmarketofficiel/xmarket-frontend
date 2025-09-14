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
      {/* Icon */}
      <div className="text-6xl mb-4">
        {config.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {getTitle()}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md">
        {getDescription()}
      </p>

      {/* Action Button */}
      {'action' in config && config.action && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-[#009F9C] text-white rounded-lg font-medium hover:bg-[#008A87] transition-colors"
        >
          {config.action}
        </button>
      )}

      {/* Additional suggestions for no items */}
      {type === 'noItems' && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
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
        </div>
      )}
    </div>
  );
}
