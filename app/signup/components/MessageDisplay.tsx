import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { MessageDisplayProps } from '../types';

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
      transition={{ duration: 0.3 }}
      className={`
        p-4 rounded-xl border flex items-center space-x-3
        ${isSuccess 
          ? 'bg-green-50/80 border-green-200 text-green-700' 
          : 'bg-red-50/80 border-red-200 text-red-700'
        }
        backdrop-blur-sm
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${isSuccess ? 'text-green-500' : 'text-red-500'}`} />
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}
