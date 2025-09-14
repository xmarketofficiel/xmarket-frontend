'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sliders, 
  DollarSign, 
  Calendar, 
  Star, 
  MapPin, 
  Tag,
  ChevronDown,
  Check
} from 'lucide-react';

interface FilterState {
  priceRange: [number, number];
  condition: string[];
  category: string;
  location: string;
  datePosted: string;
  rating: number;
  tags: string[];
}

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const CONDITION_OPTIONS = [
  { value: 'new', label: 'Brand New', icon: '✨' },
  { value: 'like-new', label: 'Like New', icon: '🌟' },
  { value: 'excellent', label: 'Excellent', icon: '👍' },
  { value: 'good', label: 'Good', icon: '👌' },
  { value: 'fair', label: 'Fair', icon: '🤏' }
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics', icon: '📱' },
  { value: 'books', label: 'Books & Textbooks', icon: '📚' },
  { value: 'fashion', label: 'Fashion & Clothing', icon: '👕' },
  { value: 'home', label: 'Home & Garden', icon: '🏠' },
  { value: 'sports', label: 'Sports & Recreation', icon: '⚽' },
  { value: 'vehicles', label: 'Vehicles & Parts', icon: '🚗' },
  { value: 'other', label: 'Other', icon: '📦' }
];

const DATE_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: '3months', label: 'Last 3 months' }
];

const POPULAR_TAGS = [
  'Urgent Sale', 'Price Negotiable', 'Like New', 'Barely Used',
  'Original Box', 'Warranty', 'Bundle Deal', 'Moving Sale'
];

/**
 * Advanced Filter Panel - Comprehensive filtering options
 * Features price range, condition, location, and more
 */
export function AdvancedFilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: AdvancedFilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'condition', 'category'])
  );

  const updateLocalFilters = (updates: Partial<FilterState>) => {
    setLocalFilters(prev => ({ ...prev, ...updates }));
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleConditionToggle = (condition: string) => {
    const newConditions = localFilters.condition.includes(condition)
      ? localFilters.condition.filter(c => c !== condition)
      : [...localFilters.condition, condition];
    updateLocalFilters({ condition: newConditions });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = localFilters.tags.includes(tag)
      ? localFilters.tags.filter(t => t !== tag)
      : [...localFilters.tags, tag];
    updateLocalFilters({ tags: newTags });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      priceRange: [0, 1000],
      condition: [],
      category: '',
      location: '',
      datePosted: '',
      rating: 0,
      tags: []
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.condition.length > 0) count++;
    if (localFilters.category) count++;
    if (localFilters.location) count++;
    if (localFilters.datePosted) count++;
    if (localFilters.rating > 0) count++;
    if (localFilters.tags.length > 0) count++;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 1000) count++;
    return count;
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[99] overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sliders className="w-6 h-6 mr-3" />
                    <div>
                      <h2 className="text-xl font-bold">Filters</h2>
                      <p className="text-white/80 text-sm">
                        {getActiveFiltersCount()} active filters
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Price Range */}
                <FilterSection
                  title="Price Range"
                  icon={<DollarSign className="w-5 h-5" />}
                  isExpanded={expandedSections.has('price')}
                  onToggle={() => toggleSection('price')}
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Price
                        </label>
                        <input
                          type="number"
                          value={localFilters.priceRange[0]}
                          onChange={(e) => updateLocalFilters({
                            priceRange: [Number(e.target.value), localFilters.priceRange[1]]
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Price
                        </label>
                        <input
                          type="number"
                          value={localFilters.priceRange[1]}
                          onChange={(e) => updateLocalFilters({
                            priceRange: [localFilters.priceRange[0], Number(e.target.value)]
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009F9C] focus:border-transparent"
                          placeholder="1000"
                        />
                      </div>
                    </div>

                    {/* Quick Price Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Under $50', range: [0, 50] },
                        { label: '$50 - $200', range: [50, 200] },
                        { label: '$200 - $500', range: [200, 500] },
                        { label: '$500+', range: [500, 1000] }
                      ].map((option) => (
                        <button
                          key={option.label}
                          onClick={() => updateLocalFilters({ priceRange: option.range as [number, number] })}
                          className="px-3 py-2 text-sm bg-gray-100 hover:bg-[#009F9C] hover:text-white rounded-lg transition-colors"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </FilterSection>

                {/* Condition */}
                <FilterSection
                  title="Condition"
                  icon={<Star className="w-5 h-5" />}
                  isExpanded={expandedSections.has('condition')}
                  onToggle={() => toggleSection('condition')}
                >
                  <div className="space-y-2">
                    {CONDITION_OPTIONS.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleConditionToggle(option.value)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          localFilters.condition.includes(option.value)
                            ? 'border-[#009F9C] bg-[#009F9C]/5 text-[#009F9C]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">{option.icon}</span>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {localFilters.condition.includes(option.value) && (
                          <Check className="w-5 h-5" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </FilterSection>

                {/* Category */}
                <FilterSection
                  title="Category"
                  icon={<Tag className="w-5 h-5" />}
                  isExpanded={expandedSections.has('category')}
                  onToggle={() => toggleSection('category')}
                >
                  <div className="space-y-2">
                    {CATEGORY_OPTIONS.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateLocalFilters({ category: option.value })}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          localFilters.category === option.value
                            ? 'border-[#009F9C] bg-[#009F9C]/5 text-[#009F9C]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          {option.icon && (
                            <span className="mr-3 text-lg">{option.icon}</span>
                          )}
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {localFilters.category === option.value && (
                          <Check className="w-5 h-5" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </FilterSection>

                {/* Date Posted */}
                <FilterSection
                  title="Date Posted"
                  icon={<Calendar className="w-5 h-5" />}
                  isExpanded={expandedSections.has('date')}
                  onToggle={() => toggleSection('date')}
                >
                  <div className="space-y-2">
                    {DATE_OPTIONS.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateLocalFilters({ datePosted: option.value })}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          localFilters.datePosted === option.value
                            ? 'border-[#009F9C] bg-[#009F9C]/5 text-[#009F9C]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium">{option.label}</span>
                        {localFilters.datePosted === option.value && (
                          <Check className="w-5 h-5" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </FilterSection>

                {/* Popular Tags */}
                <FilterSection
                  title="Popular Tags"
                  icon={<Tag className="w-5 h-5" />}
                  isExpanded={expandedSections.has('tags')}
                  onToggle={() => toggleSection('tags')}
                >
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_TAGS.map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                          localFilters.tags.includes(tag)
                            ? 'border-[#009F9C] bg-[#009F9C] text-white'
                            : 'border-gray-200 text-gray-700 hover:border-[#009F9C] hover:text-[#009F9C]'
                        }`}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </FilterSection>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Clear All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApply}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Filter Section Component - Collapsible section for filters
 */
interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, icon, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-3 font-semibold text-gray-900">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdvancedFilterPanel;