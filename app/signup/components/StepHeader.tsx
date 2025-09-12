import { motion } from 'framer-motion';
import { STEP_CONFIG, BRAND_FEATURES, ANIMATION_VARIANTS } from '../constants';
import type { StepHeaderProps } from '../types';

/**
 * Step Header Component
 * Dynamic header that changes based on current step
 */
export function StepHeader({ step, signupMode }: StepHeaderProps) {
  const isRequestAccess = signupMode === 'request-access';
  
  // Get step configuration
  const getStepConfig = () => {
    if (isRequestAccess) {
      return STEP_CONFIG.REQUEST_ACCESS;
    }
    return STEP_CONFIG[step.toUpperCase() as keyof typeof STEP_CONFIG] || STEP_CONFIG.EMAIL;
  };

  const config = getStepConfig();

  return (
    <motion.div
      {...ANIMATION_VARIANTS.fadeInUp}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {config.title}
      </h2>
      <p className="text-gray-600 text-lg">
        {config.subtitle}
      </p>
      
      {/* Additional context for specific steps */}
      {step === 'otp' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mt-2"
        >
          Didn't receive the code? Check your spam folder
        </motion.p>
      )}
      
      {step === 'details' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mt-2"
        >
          This information helps us create a better experience for you
        </motion.p>
      )}
      
      {isRequestAccess && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mt-2"
        >
          We'll review your request and get back to you within 24 hours
        </motion.p>
      )}
    </motion.div>
  );
}
