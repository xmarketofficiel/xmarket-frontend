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
    design-card w-full py-4 sm:py-3.5 px-6 rounded-xl font-bold transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center space-x-2.5
    min-h-[3.5rem] sm:min-h-[3.25rem] text-base sm:text-base
    touch-manipulation relative overflow-hidden group
  `;
  
  const variantClasses = isPrimary
    ? `
      bg-gradient-to-r from-[#009F9C] via-[#00B8B5] to-[#009F9C] 
      bg-size-200 bg-pos-0 hover:bg-pos-100
      text-white shadow-lg shadow-[#009F9C]/30
      hover:shadow-xl hover:shadow-[#009F9C]/40
      focus:ring-[#009F9C]/50 
      transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0
      border border-[#00B8B5]/20
    `
    : `
      bg-white/90 backdrop-blur-sm border-2 border-[#009F9C] text-[#009F9C] 
      hover:bg-[#009F9C] hover:text-white hover:shadow-xl hover:shadow-[#009F9C]/25
      hover:border-[#009F9C]
      focus:ring-[#009F9C]/50 
      transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0
    `;

  return (
    <motion.button
      type="submit"
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses}`}
      style={{
        transitionDuration: ANIMATION_SYSTEM.duration.normal + 'ms',
        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut,
        backgroundSize: '200% 100%'
      }}
      whileHover={{ 
        scale: disabled || isLoading ? 1 : 1.02,
        y: disabled || isLoading ? 0 : -2
      }}
      whileTap={{ 
        scale: disabled || isLoading ? 1 : 0.98,
        y: disabled || isLoading ? 0 : 0
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: 'easeOut'
      }}
    >
      {/* Shimmer effect overlay */}
      {isPrimary && !disabled && !isLoading && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
      )}
      
      {/* Button content */}
      <div className="relative flex items-center justify-center space-x-2.5">
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            <span className="font-semibold">{loadingText}</span>
          </>
        ) : (
          <>
            {icon && <span className="text-lg">{icon}</span>}
            <span className="tracking-wide">{text}</span>
            {isPrimary && (
              <motion.svg 
                className="w-5 h-5 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
}
