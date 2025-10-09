import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { STEP_CONFIG, ANIMATION_VARIANTS } from '../constants';
import type { CompleteStepProps } from '../types';

/**
 * Complete Step Component
 * Final step - success state with redirection
 */
export function CompleteStep({ formData }: CompleteStepProps) {
  const config = STEP_CONFIG.COMPLETE;

  return (
    <motion.div
      className="text-center space-y-6"
      {...ANIMATION_VARIANTS.scale}
      transition={{ duration: 0.6 }}
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
      >
        <CheckCircle className="w-12 h-12 text-green-500" />
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {config.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {config.subtitle}
        </p>
      </motion.div>

      {/* User info confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200"
      >
        <h3 className="font-semibold text-gray-900 mb-3">Account Details</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
          <p><span className="font-medium">Email:</span> {formData.email}</p>
          <p><span className="font-medium">Role:</span> {formData.role === 'student' ? 'Student' : 'Staff'}</p>
          <p><span className="font-medium">Department:</span> {formData.department}</p>
          <p><span className="font-medium">Address:</span> {formData.address}</p>
          {formData.whatsappNumber && formData.whatsappNumber !== 'Not provided' && (
            <p><span className="font-medium">WhatsApp:</span> {formData.whatsappNumber}</p>
          )}
        </div>
      </motion.div>

      {/* Redirect message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center space-x-2 text-[#009F9C] font-medium"
      >
        <div className="w-2 h-2 bg-[#009F9C] rounded-full animate-pulse" />
        <span>{config.redirectText}</span>
      </motion.div>

      {/* Manual navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="pt-4"
      >
        <Link href="/marketplace">
          <motion.button
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#00B8B5] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Go to Marketplace</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
