import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, ShieldX, Mail } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

interface MessageDisplayProps {
  message: string;
  type: 'success' | 'error';
}

/**
 * Animated message display for success/error states
 * Enhanced to handle account suspension with contact info
 */
export function MessageDisplay({ message, type }: MessageDisplayProps) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isSuspended = message.includes('suspended') || message.includes('banned');
  
  let Icon = isSuccess ? CheckCircle : AlertCircle;
  let containerClass = '';
  
  if (isSuccess) {
    containerClass = 'bg-green-50 text-green-800 border border-green-200';
  } else if (isSuspended) {
    Icon = ShieldX;
    containerClass = 'bg-orange-50 text-orange-800 border border-orange-200';
  } else {
    containerClass = 'bg-red-50 text-red-800 border border-red-200';
  }

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
        className={`design-card rounded-lg ${containerClass}`}
      >
        <div className="flex items-start space-x-3 p-3.5 sm:p-4">
          <Icon className="w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium leading-relaxed">{message}</p>
            {isSuspended && (
              <div className="mt-3 pt-3 border-t border-orange-200">
                <p className="text-xs text-orange-700 mb-2 font-medium">Need help? Contact support:</p>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a 
                    href="mailto:support@xmarket.com" 
                    className="text-xs text-orange-700 hover:text-orange-900 active:text-orange-950 underline break-all"
                  >
                    support@xmarket.com
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
