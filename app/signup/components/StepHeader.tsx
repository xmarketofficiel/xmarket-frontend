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
    if (step === 'request-success') {
      return STEP_CONFIG.REQUEST_SUCCESS;
    }
    if (isRequestAccess) {
      return STEP_CONFIG.REQUEST_ACCESS;
    }
    if (step === 'user-type') {
      return STEP_CONFIG.USER_TYPE;
    }
    if (step === '1337-student') {
      return STEP_CONFIG["1337_STUDENT"];
    }
    return STEP_CONFIG[step.toUpperCase() as keyof typeof STEP_CONFIG] || STEP_CONFIG.EMAIL;
  };

  const config = getStepConfig();

  return (
    <motion.div
      {...ANIMATION_VARIANTS.fadeInUp}
      transition={{ duration: 0.6 }}
      className="text-center mb-6 lg:mb-8"
    >
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
        {config.title}
      </h2>
      {config.subtitle && (
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed px-2">
          {config.subtitle}
        </p>
      )}
      
      {/* Additional context for specific steps */}
      {step === 'otp' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500 mt-2 px-4"
        >
          Didn't receive the code? Check your spam folder
        </motion.p>
      )}
      
      {step === 'details' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mt-3 px-4"
        >
          This information helps us create a better experience for you
        </motion.p>
      )}
      
      {isRequestAccess && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mt-3 px-4"
        >
          We'll review your request and get back to you within 24 hours
        </motion.p>
      )}
    </motion.div>
  );
}
