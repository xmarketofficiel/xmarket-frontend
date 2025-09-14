import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

interface MessageDisplayProps {
  message: string;
  type: 'success' | 'error';
}

/**
 * Animated message display for success/error states
 */
export function MessageDisplay({ message, type }: MessageDisplayProps) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  
  const containerClass = isSuccess 
    ? 'bg-green-50 text-green-800 border border-green-200'
    : 'bg-red-50 text-red-800 border border-red-200';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          ease: 'easeOut'
        }}
        className={`design-card flex items-center space-x-2 p-4 rounded-lg ${containerClass}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
