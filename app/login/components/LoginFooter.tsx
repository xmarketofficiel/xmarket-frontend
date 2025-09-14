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
      <TestAccountInfo />
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

/**
 * Test account information panel
 */
function TestAccountInfo() {
  return (
    <motion.div 
      className="design-card bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200/50 rounded-xl p-4 backdrop-blur-sm hover:shadow-md transition-all"
      style={{
        transitionDuration: ANIMATION_SYSTEM.durationString.normal,
        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        delay: 0.2,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all"
             style={{
               transitionDuration: ANIMATION_SYSTEM.durationString.normal,
               transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
             }}>
          <AlertCircle className="w-5 h-5 text-cyan-600 transition-colors"
                       style={{
                         transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                         transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                       }} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1 transition-colors"
              style={{
                transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
              }}>
            Test Account
          </h4>
          <p className="text-xs text-gray-600 mb-2 transition-colors"
             style={{
               transitionDuration: ANIMATION_SYSTEM.durationString.fast,
               transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
             }}>
            Pre-filled credentials for testing:
          </p>
          <div className="text-xs text-gray-700 space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
            >
              <strong>Email:</strong> {LOGIN_CONFIG.DEFAULT_EMAIL}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
            >
              <strong>Password:</strong> {LOGIN_CONFIG.DEFAULT_PASSWORD}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
