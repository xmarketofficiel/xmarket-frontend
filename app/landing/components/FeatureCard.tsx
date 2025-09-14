import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ANIMATION_VARIANTS } from '../constants';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
  index: number;
}

/**
 * Feature card component with hover animations and gradient backgrounds
 * Enhanced with design system principles for consistency and accessibility
 */
export function FeatureCard({ icon: Icon, title, description, color, delay, index }: FeatureCardProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={ANIMATION_VARIANTS.fadeInUp}
      transition={{ 
        delay: delay,
        duration: ANIMATION_SYSTEM.duration.normal 
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: ANIMATION_SYSTEM.duration.fast }
      }}
      className="design-card group relative overflow-hidden"
    >
      {/* Enhanced overlay with design system colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-design-lg">
        {/* Icon container with enhanced styling */}
        <div className={`inline-flex p-design-md rounded-design-lg bg-gradient-to-r ${color} mb-design-lg shadow-design-md group-hover:shadow-design-lg transition-shadow duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Typography following design system hierarchy */}
        <h3 className="text-typography-h3 font-typography-semibold text-semantic-text-primary mb-design-md group-hover:text-semantic-text-hover transition-colors duration-200">
          {title}
        </h3>
        
        <p className="text-typography-body text-semantic-text-secondary leading-typography-relaxed group-hover:text-semantic-text-primary transition-colors duration-200">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
