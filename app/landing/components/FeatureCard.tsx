import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ANIMATION_VARIANTS } from '../constants';

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
 */
export function FeatureCard({ icon: Icon, title, description, color, delay, index }: FeatureCardProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={ANIMATION_VARIANTS.fadeInUp}
      transition={{ delay: delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" 
           style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
      
      <div className="relative p-8">
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${color} mb-6 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
