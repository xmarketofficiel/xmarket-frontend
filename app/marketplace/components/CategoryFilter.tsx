import { useEffect, useState, useRef } from 'react';
import { CATEGORY_CONFIG } from '../constants';
import type { CategoryFilterProps } from '../types';

/**
 * Category Filter Component
 * Horizontal scrollable category selector with icons and brief sticky behavior
 */
export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onChange, 
  loading = false 
}: CategoryFilterProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [shouldStick, setShouldStick] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [originalTop, setOriginalTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!categoryRef.current) return;

      const rect = categoryRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      // Calculate when the categories should start sticking
      if (originalTop === 0 && rect.top > 0) {
        setOriginalTop(rect.top + scrollY);
      }

      // Brief sticky logic: stick when scrolling past, but allow it to scroll away after a threshold
      const scrollThreshold = 100; // pixels to stick before allowing scroll away
      const hasPassedOriginal = scrollY > originalTop;
      const isInStickyRange = hasPassedOriginal && scrollY < originalTop + scrollThreshold;
      
      setShouldStick(isInStickyRange);
      setIsSticky(hasPassedOriginal);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [originalTop]);

  // Ensure "all" is always first, then add other categories
  const orderedCategories = ['all', ...categories.filter(cat => cat !== 'all')];

  if (loading) {
    return (
      <div 
        ref={categoryRef}
        className={`bg-white border-b border-gray-100 p-4 animate-pulse transition-all duration-300 ${
          shouldStick ? 'sticky top-16 z-30' : ''
        }`}
      >
        <div className="flex space-x-3 overflow-hidden">
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
    <div 
      ref={categoryRef}
      className={`px-4 py-3 bg-white border-b border-gray-100 transition-all duration-300 ${
        shouldStick ? 'sticky top-16 z-30 shadow-md' : ''
      }`}
    >
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
