'use client';

import { motion } from 'framer-motion';
import { STEP_CONFIG } from '../constants';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export default function StepIndicator({ 
  currentStep, 
  totalSteps, 
  className = '' 
}: StepIndicatorProps) {
  
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  const getStepConfig = (stepNumber: number) => {
    return STEP_CONFIG[stepNumber];
  };

  return (
    <div className={`flex items-center justify-center space-x-4 mb-6 ${className}`}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const status = getStepStatus(stepNumber);
        const config = getStepConfig(stepNumber);
        
        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step Circle */}
            <motion.div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-[#006666] border-[#006666] text-white'
                  : status === 'active'
                  ? 'bg-white border-[#006666] text-[#006666]'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {status === 'completed' ? (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              ) : (
                <span className="text-sm font-semibold">
                  {config?.icon || stepNumber}
                </span>
              )}
            </motion.div>

            {/* Step Label */}
            <div className="ml-3 hidden sm:block">
              <motion.p
                className={`text-sm font-medium transition-colors ${
                  status === 'active' ? 'text-[#006666]' : 'text-gray-500'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
              >
                {config?.title || `Step ${stepNumber}`}
              </motion.p>
              <motion.p
                className="text-xs text-gray-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {config?.description}
              </motion.p>
            </div>

            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <motion.div
                className={`w-8 h-0.5 mx-4 transition-colors duration-300 ${
                  stepNumber < currentStep ? 'bg-[#006666]' : 'bg-gray-300'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
