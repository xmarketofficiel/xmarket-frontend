import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Mail, Clock } from 'lucide-react';
import { ANIMATION_VARIANTS } from '../constants';

interface RequestSuccessStepProps {
  requestData: {
    fullName: string;
    email: string;
    whatsappNumber: string;
    reason: string;
  };
  onGoToLanding: () => void;
}

/**
 * Request Success Step Component
 * Shows confirmation after successful join request submission
 */
export function RequestSuccessStep({
  requestData,
  onGoToLanding
}: RequestSuccessStepProps) {
  return (
    <motion.div
      className="text-center space-y-8"
      {...ANIMATION_VARIANTS.fadeInUp}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Success Icon */}
      <motion.div
        className="flex justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
      </motion.div>

      {/* Success Message */}
      <div className="space-y-4">
        <motion.h2
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Request Submitted Successfully! ✅
        </motion.h2>
        
        <motion.p
          className="text-gray-600 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Thank you <strong>{requestData.fullName}</strong> for your interest in joining XMarket!
        </motion.p>
      </div>

      {/* Status Information */}
      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-start space-x-3">
          <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-blue-700 space-y-2 text-sm">
              <li>• Our support team will review your request</li>
              <li>• You'll receive an email notification once approved</li>
              <li>• The approval process typically takes 1-2 business days</li>
              <li>• Once approved, you can create your account and start trading!</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Email Notification Info */}
      <motion.div
        className="bg-gray-50 border border-gray-200 rounded-xl p-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Mail className="w-5 h-5" />
          <span className="text-sm">
            We'll notify you at <strong>{requestData.email}</strong>
          </span>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        className="pt-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <button
          onClick={onGoToLanding}
          className="bg-gradient-to-r from-[#009F9C] to-[#00B8B5] hover:from-[#008A87] hover:to-[#009F9C] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-[1.02] w-full sm:w-auto mx-auto"
        >
          <span>Go to Landing Page</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        className="text-center pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="text-xs text-gray-500">
          Questions? Contact our support team for assistance.
        </p>
      </motion.div>
    </motion.div>
  );
}