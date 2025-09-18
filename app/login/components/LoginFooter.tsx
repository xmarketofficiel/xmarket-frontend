import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, ArrowRight, AlertCircle } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import { LOGIN_CONFIG } from '../constants';

/**
 * Footer section with signup link and test account info
 */
export function LoginFooter() {
  return (
    <motion.div
      className="mt-8 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000, 
        delay: 0.6,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >
      <SignupLink />
    </motion.div>
  );
}

/**
 * Link to signup page
 */
function SignupLink() {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-4 transition-colors"
         style={{
           transitionDuration: ANIMATION_SYSTEM.durationString.fast,
           transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
         }}>
        Don't have an account?
      </p>
      <Link href="/signup">
        <motion.div
          className="design-card inline-flex items-center justify-center px-6 py-3 border-2 border-[#009F9C] text-[#009F9C] rounded-xl font-semibold hover:bg-[#009F9C] hover:text-white hover:shadow-lg transition-all group"
          style={{
            transitionDuration: ANIMATION_SYSTEM.durationString.normal,
            transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
        >
          <User className="w-5 h-5 mr-2 transition-transform"
                style={{
                  transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                  transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                }} />
          Create New Account
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                      style={{
                        transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                      }} />
        </motion.div>
      </Link>
    </div>
  );
}


