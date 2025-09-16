'use client';

import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

interface FormHeaderProps {
  title: string;
  onBack: () => void;
  step?: number;
  totalSteps?: number;
  showBackButton?: boolean;
  className?: string;
}

export default function FormHeader({ 
  title, 
  onBack, 
  step, 
  totalSteps, 
  className = '' 
}: FormHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000, 
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
      className={`design-card sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 flex items-center z-10 shadow-sm hover:shadow-md transition-all ${className}`}
      style={{
        transitionDuration: ANIMATION_SYSTEM.durationString.normal,
        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
      }}
    >
      <motion.button
        onClick={onBack}
        className="design-card p-2 -ml-2 hover:bg-gray-100/80 rounded-full transition-all border border-transparent hover:border-gray-200/50"
        style={{
          transitionDuration: ANIMATION_SYSTEM.durationString.normal,
          transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
        }}
        aria-label="Go back"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
      >
        <ArrowLeft size={20} className="text-gray-700 hover:text-[#009F9C] transition-colors"
                   style={{
                     transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                     transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                   }} />
      </motion.button>
      
      <div className="ml-2 flex-1">
        <h1 className="text-lg font-semibold text-gray-900 transition-colors"
            style={{
              transitionDuration: ANIMATION_SYSTEM.durationString.fast,
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
            }}>
          {title}
        </h1>
        {step && totalSteps && (
          <motion.p 
            className="text-sm text-gray-500 transition-colors"
            style={{
              transitionDuration: ANIMATION_SYSTEM.durationString.fast,
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: ANIMATION_SYSTEM.duration.normal / 1000,
              delay: 0.1
            }}
          >
            Step {step} of {totalSteps}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
