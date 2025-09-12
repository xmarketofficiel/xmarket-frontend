'use client';

import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormHeaderProps {
  title: string;
  onBack: () => void;
  step?: number;
  totalSteps?: number;
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
      className={`sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center z-10 ${className}`}
    >
      <motion.button
        onClick={onBack}
        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Go back"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} className="text-gray-700" />
      </motion.button>
      
      <div className="ml-2 flex-1">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {step && totalSteps && (
          <p className="text-sm text-gray-500">
            Step {step} of {totalSteps}
          </p>
        )}
      </div>
    </motion.div>
  );
}
