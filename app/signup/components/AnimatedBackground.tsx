import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Heart } from 'lucide-react';
import type { AnimatedBackgroundProps } from '../types';

/**
 * Animated Background Component
 * Creates floating elements animation for visual appeal
 */
export function AnimatedBackground({ floatingElements }: AnimatedBackgroundProps) {
  const iconComponents = [Sparkles, ShoppingBag, Heart];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingElements.map((element) => {
        const IconComponent = iconComponents[element.id % iconComponents.length];
        
        return (
          <motion.div
            key={element.id}
            className="absolute text-teal-200/20"
            initial={{ 
              x: element.x, 
              y: element.y,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: element.x + 50, 
              y: element.y - 100,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              fontSize: `${element.size}px`
            }}
          >
            <IconComponent className="w-full h-full" />
          </motion.div>
        );
      })}
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-teal-50/30 to-cyan-50/30" />
    </div>
  );
}
