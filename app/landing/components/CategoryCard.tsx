import { motion } from 'framer-motion';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

interface CategoryCardProps {
  name: string;
  icon: string;
  count: string;
  index: number;
}

/**
 * Category card component with hover effects
 * Enhanced with design system principles for consistency and accessibility
 */
export function CategoryCard({ name, icon, count, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: ANIMATION_SYSTEM.duration.normal 
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: ANIMATION_SYSTEM.duration.fast }
      }}
      className="design-card cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`Browse ${name} category with ${count}`}
    >
      <div className="text-center">
        <div className="text-4xl mb-design-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-typography-h4 font-typography-semibold text-semantic-text-primary mb-design-xs">
          {name}
        </h3>
        <p className="text-typography-small text-semantic-text-secondary">
          {count}
        </p>
      </div>
    </motion.div>
  );
}
