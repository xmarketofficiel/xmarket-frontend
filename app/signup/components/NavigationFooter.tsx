import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import type { NavigationFooterProps } from '../types';

/**
 * Navigation Footer Component
 * Footer with navigation links and mode switching
 */
export function NavigationFooter({ 
  currentStep, 
  signupMode,
  onSwitchToSignup,
  onSwitchToRequestAccess 
}: NavigationFooterProps) {
  const isRequestAccess = signupMode === 'request-access';
  const showFooter = currentStep !== 'complete';

  if (!showFooter) return null;

  return (
    <motion.div
      className="mt-8 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {/* Mode switching handled by individual step components to avoid duplication */}

      {/* Login link - Enhanced Design */}
      <motion.div className="text-center">
        <p className="text-sm sm:text-base text-gray-600 mb-4 font-medium">Already have an account?</p>
        <Link href="/login">
          <motion.div
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#009F9C] text-[#009F9C] 
              rounded-xl font-bold hover:bg-[#009F9C] hover:text-white 
              transition-all duration-300 group shadow-md hover:shadow-xl hover:shadow-[#009F9C]/25
              hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm bg-white/50
              text-sm sm:text-base"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            Sign In Instead
          </motion.div>
        </Link>
      </motion.div>

      {/* Help link - Enhanced Design */}
      <motion.div className="text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          Need help?{' '}
          <Link href="/contact" className="text-[#009F9C] hover:text-[#008A87] font-semibold underline decoration-2 underline-offset-2 transition-colors">
            Contact Support
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
