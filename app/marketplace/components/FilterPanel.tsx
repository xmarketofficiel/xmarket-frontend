import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check } from 'lucide-react';
import { FILTER_OPTIONS } from '../constants';
import type { FilterPanelProps } from '../types';

/**
 * Filter Panel Component
 * Slide-out panel with sorting and filtering options
 */
export function FilterPanel({
  isOpen,
  onClose,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  conditionFilter,
  onConditionChange,
  onClearFilters
}: FilterPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 shadow-lg relative z-30"
          >
            <div className="px-4 py-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters & Sorting</h3>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={onClearFilters}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear All</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sort By */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
                  <div className="space-y-2">
                    {FILTER_OPTIONS.sortBy.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => onSortChange(option.value as any)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
                          ${sortBy === option.value
                            ? 'border-[#009F9C] bg-[#009F9C]/5 text-[#009F9C]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                        {sortBy === option.value && (
                          <Check className="w-4 h-4 text-[#009F9C]" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {FILTER_OPTIONS.priceRanges.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => onPriceRangeChange(option.value as any)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
                          ${priceRange === option.value
                            ? 'border-[#009F9C] bg-[#009F9C]/5 text-[#009F9C]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-sm font-medium">{option.label}</span>
                        {priceRange === option.value && (
                          <Check className="w-4 h-4 text-[#009F9C]" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Condition</h4>
                  <div className="space-y-2">
                    {FILTER_OPTIONS.conditions.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => onConditionChange(option.value as any)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200
                          ${conditionFilter === option.value
                            ? 'border-[#009F9C] bg-[#009F9C]/5 text-[#009F9C]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-sm font-medium">{option.label}</span>
                        {conditionFilter === option.value && (
                          <Check className="w-4 h-4 text-[#009F9C]" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button (Mobile) */}
              <div className="mt-6 lg:hidden">
                <motion.button
                  onClick={onClose}
                  className="w-full bg-[#009F9C] text-white py-3 rounded-lg font-medium hover:bg-[#008A87] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
