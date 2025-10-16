import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { MessageDisplayProps } from '../types';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

/**
 * Message Display Component
 * Shows success and error messages with appropriate styling and animations
 */
export function MessageDisplay({ message, type }: MessageDisplayProps) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: 'easeOut'
      }}
      className={`
        design-card p-4 sm:p-4 rounded-xl border-2 flex items-start space-x-3 relative overflow-hidden
        ${isSuccess 
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 text-green-800 shadow-lg shadow-green-100' 
          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300 text-red-800 shadow-lg shadow-red-100'
        }
        backdrop-blur-sm
      `}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent" />
      </div>
      
      {/* Icon with animated background */}
      <motion.div 
        className={`
          flex-shrink-0 p-1.5 rounded-lg
          ${isSuccess 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
          }
        `}
        initial={{ scale: 0.5, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1
        }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      
      {/* Message text */}
      <div className="flex-1 min-w-0 relative">
        <p className="text-sm font-semibold leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}
