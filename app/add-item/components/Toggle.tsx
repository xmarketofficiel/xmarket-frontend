'use client';

import { motion } from 'framer-motion';
import { ToggleProps } from '../types';

export default function Toggle({
  label,
  name,
  value,
  onChange,
  description,
  className = ''
}: ToggleProps) {

  const toggleId = `toggle-${name}`;
  const descriptionId = `${toggleId}-description`;

  const handleToggle = () => {
    onChange(!value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 ${className}`}
      role="group"
      aria-labelledby={toggleId}
    >
      <div className="flex-1">
        <h3 id={toggleId} className="font-medium text-gray-900">
          {label}
        </h3>
        {description && (
          <p id={descriptionId} className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>
      
      <motion.button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006666] focus:ring-offset-2 ${
          value ? 'bg-[#006666]' : 'bg-gray-300'
        }`}
        role="switch"
        aria-checked={value}
        aria-labelledby={toggleId}
        aria-describedby={description ? descriptionId : undefined}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform"
          initial={false}
          animate={{ 
            x: value ? 24 : 4,
            scale: value ? 1.1 : 1
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 500, 
            damping: 30 
          }}
        />
      </motion.button>
    </motion.div>
  );
}
