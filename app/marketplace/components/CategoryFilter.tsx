import { CATEGORY_CONFIG } from '../constants';
import type { CategoryFilterProps } from '../types';

/**
 * Category Filter Component
 * Horizontal scrollable category selector with icons
 */
export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onChange, 
  loading = false 
}: CategoryFilterProps) {
  // Ensure "all" is always first, then add other categories
  const orderedCategories = ['all', ...categories.filter(cat => cat !== 'all')];

  if (loading) {
    return (
      <div className="px-4 py-4">
        <div className="flex space-x-3 overflow-x-auto scrollbar-thin">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-3 py-1.5 bg-gray-200 rounded-lg animate-pulse"
              style={{ width: `${50 + Math.random() * 30}px`, height: '32px' }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="flex space-x-3 overflow-x-auto scrollbar-thin pb-1">
        {orderedCategories.map((category) => {
          const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.other;
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => onChange(category)}
              className={`
                flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-lg 
                transition-all duration-200 border-2 font-medium text-sm
                ${isSelected
                  ? 'bg-[#009F9C] text-white border-[#009F9C] shadow-lg'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#009F9C] hover:text-[#009F9C]'
                }
              `}
            >
              <span className="text-base leading-none">{config.icon}</span>
              <span className="text-sm whitespace-nowrap">
                {config.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category description */}
      {selectedCategory && CATEGORY_CONFIG[selectedCategory as keyof typeof CATEGORY_CONFIG] && (
        <div className="mt-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">
            {CATEGORY_CONFIG[selectedCategory as keyof typeof CATEGORY_CONFIG].description}
          </p>
        </div>
      )}
    </div>
  );
}
