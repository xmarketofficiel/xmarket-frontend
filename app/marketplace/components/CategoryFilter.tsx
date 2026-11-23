import { useEffect, useState, useRef } from 'react';
import { CATEGORY_CONFIG } from '../constants';
import type { CategoryFilterProps } from '../types';

/**
 * Get appropriate icon for a category based on its name
 */
function getCategoryIcon(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  // Map common category names to appropriate icons
  const iconMap: Record<string, string> = {
    // Technology & Electronics
    'electronics': '💻',
    'technology': '💻',
    'computers': '🖥️',
    'phones': '📱',
    'gadgets': '⌚',
    
    // Books & Education
    'books': '📚',
    'textbooks': '📖',
    'education': '🎓',
    'academic': '🎒',
    
    // Clothing & Fashion
    'clothing': '👕',
    'fashion': '👗',
    'accessories': '👜',
    'shoes': '👟',
    
    // Furniture & Home
    'furniture': '🪑',
    'home': '🏠',
    'decor': '🖼️',
    'kitchen': '🍽️',
    
    // Sports & Recreation
    'sports': '⚽',
    'fitness': '🏋️',
    'outdoor': '🏕️',
    'recreation': '🎾',
    
    // Transportation
    'transportation': '🚗',
    'vehicles': '🚙',
    'bikes': '🚲',
    'automotive': '🚗',
    
    // Services
    'services': '🔧',
    'repair': '🛠️',
    'tutoring': '📝',
    'cleaning': '🧹',
    
    // Beauty & Health
    'beauty': '💄',
    'health': '🏥',
    'cosmetics': '💋',
    'wellness': '🧘',
    
    // Art & Crafts
    'art': '🎨',
    'crafts': '✂️',
    'music': '🎵',
    'instruments': '🎸',
    
    // Food & Dining
    'food': '🍕',
    'dining': '🍽️',
    'cooking': '👨‍🍳',
    
    // Default categories
    'other': '📦',
    'miscellaneous': '📦',
    'general': '📦'
  };
  
  // Try to find an exact match first
  if (iconMap[lowerCategory]) {
    return iconMap[lowerCategory];
  }
  
  // Try partial matches for compound category names
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerCategory.includes(key) || key.includes(lowerCategory)) {
      return icon;
    }
  }
  
  // Default icon for unknown categories
  return '📦';
}

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

  // Ensure "all" is always first, then add other categories (avoid duplicates)
  const orderedCategories = ['all', ...categories.filter(cat => cat !== 'all' && cat !== 'All')];

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
      className={`bg-white border-b border-gray-100 transition-all duration-300 ${
        shouldStick ? 'sticky top-[88px] md:top-0 z-30 shadow-md' : ''
      }`}
    >
      <div className="w-full px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory">
          {orderedCategories.map((category) => {
            // Get config for known categories, or create dynamic config for unknown ones
            let config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
            
            // If category is not in predefined config, create a dynamic config
            if (!config) {
              config = {
                name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
                icon: getCategoryIcon(category), // Get appropriate icon
                color: '#6B7280',
                description: `${category.charAt(0).toUpperCase() + category.slice(1)} items`
              };
            }
            
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => onChange(category)}
                className={`
                  relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl
                  border-2 font-medium text-sm transition-all duration-200
                  snap-start transform hover:scale-105 active:scale-95
                  ${isSelected
                    ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600'
                  }
                `}
              >
                <span className="text-lg leading-none">{config.icon}</span>
                <span className="whitespace-nowrap">
                  {config.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
