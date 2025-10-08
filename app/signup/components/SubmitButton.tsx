import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { SubmitButtonProps } from '../types';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

/**
 * Submit Button Component
 * Reusable button with loading states and variants
 */
export function SubmitButton({
  isLoading,
  text,
  loadingText,
  disabled = false,
  variant = 'primary',
  icon
}: SubmitButtonProps) {
  const isPrimary = variant === 'primary';
  
  const baseClasses = `
    design-card w-full py-4 sm:py-3 px-6 rounded-xl font-semibold transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center space-x-2
    min-h-[3.5rem] sm:min-h-[3rem] text-base sm:text-sm
    touch-manipulation
  `;
  
  const variantClasses = isPrimary
    ? `
      bg-gradient-to-r from-[#009F9C] to-[#00B8B5] text-white 
      hover:from-[#008A87] hover:to-[#009F9C] hover:shadow-lg hover:shadow-[#009F9C]/25
      focus:ring-[#009F9C]/50 transform hover:scale-[1.02] active:scale-[0.98]
    `
    : `
      bg-white border-2 border-[#009F9C] text-[#009F9C] 
      hover:bg-[#009F9C] hover:text-white hover:shadow-lg
      focus:ring-[#009F9C]/50 transform hover:scale-[1.02] active:scale-[0.98]
    `;

  return (
    <motion.button
      type="submit"
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses}`}
      style={{
        transitionDuration: ANIMATION_SYSTEM.duration.normal + 'ms',
        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
      }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: 'easeOut'
      }}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 bg-white/30 rounded animate-pulse" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{text}</span>
        </>
      )}
    </motion.button>
  );
}
