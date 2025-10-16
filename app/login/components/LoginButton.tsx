import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

interface LoginButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

/**
 * Animated login button with loading state
 */
export function LoginButton({ isLoading, onClick }: LoginButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      onClick={onClick}
      className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-[#009F9C] to-[#40E0D0] p-3.5 sm:p-4 text-white font-semibold text-base sm:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-xl active:shadow-md design-card min-h-[52px] sm:min-h-[56px] touch-manipulation"
      style={{
        transition: `all ${ANIMATION_SYSTEM.duration.normal}ms ${ANIMATION_SYSTEM.easing.easeOut}`
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.fast / 1000,
        ease: 'easeOut'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#007B78] to-[#009F9C] opacity-0 group-hover:opacity-100 transition-opacity" 
           style={{ 
             transitionDuration: ANIMATION_SYSTEM.duration.normal + 'ms',
             transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
           }} />
      <div className="relative flex items-center justify-center">
        {isLoading ? (
          <LoadingState />
        ) : (
          <DefaultState />
        )}
      </div>
    </motion.button>
  );
}

/**
 * Loading state component
 */
function LoadingState() {
  return (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      Signing In...
    </>
  );
}

/**
 * Default button state
 */
function DefaultState() {
  return (
    <>
      Sign In
      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  style={{ 
                    transitionDuration: ANIMATION_SYSTEM.duration.normal + 'ms',
                    transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                  }} />
    </>
  );
}
