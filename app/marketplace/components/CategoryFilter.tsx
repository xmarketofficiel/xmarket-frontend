import { motion } from 'framer-motion';
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
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide py-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-4 py-2 bg-gray-200 rounded-full animate-pulse"
            style={{ width: `${60 + Math.random() * 40}px`, height: '36px' }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-3"
    >
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-1">
        {orderedCategories.map((category, index) => {
          const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.other;
          const isSelected = selectedCategory === category;

          return (
            <motion.button
              key={category}
              onClick={() => onChange(category)}
              className={`
                flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full 
                transition-all duration-300 border-2
                ${isSelected
                  ? 'bg-[#009F9C] text-white border-[#009F9C] shadow-lg shadow-[#009F9C]/25'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="text-lg leading-none">{config.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">
                {config.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Category description */}
      {selectedCategory && CATEGORY_CONFIG[selectedCategory as keyof typeof CATEGORY_CONFIG] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100"
        >
          <p className="text-sm text-gray-600">
            {CATEGORY_CONFIG[selectedCategory as keyof typeof CATEGORY_CONFIG].description}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
