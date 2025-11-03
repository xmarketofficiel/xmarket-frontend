import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { InputField } from './InputField';
import { MessageDisplay } from './MessageDisplay';
import { SubmitButton } from './SubmitButton';
import { STEP_CONFIG, ANIMATION_VARIANTS } from '../constants';
import type { EmailStepProps } from '../types';

/**
 * Email Step Component
 * First step - email verification
 */
export function EmailStep({
  formData,
  isLoading,
  message,
  messageType,
  focusedField,
  onSubmit,
  onFieldFocus,
  onFieldBlur,
  onUpdateFormData,
  onSwitchToRequestAccess
}: EmailStepProps) {
  const config = STEP_CONFIG.EMAIL;

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6"
      {...ANIMATION_VARIANTS.fadeInUp}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <InputField
        type="email"
        value={formData.email}
        onChange={(value) => onUpdateFormData({ email: value })}
        onFocus={() => onFieldFocus('email')}
        onBlur={onFieldBlur}
        focused={focusedField === 'email'}
        placeholder="your.email@university.edu"
        label="Student Email Address"
        required
        icon={<Mail className="w-5 h-5" />}
      />

      {message && (
        <MessageDisplay message={message} type={messageType} />
      )}

      <SubmitButton
        isLoading={isLoading}
        text={config.buttonText}
        loadingText={config.loadingText}
      />

      {/* Email not authorized helper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <div className="relative py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-gradient-to-br from-teal-50 via-white to-cyan-50 text-xs text-gray-500 font-medium uppercase tracking-wider">
              Alternative
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
            Not from UM6P or don't have a university email?
          </p>
          <button
            type="button"
            onClick={onSwitchToRequestAccess}
            className="inline-flex items-center space-x-2 text-[#009F9C] hover:text-white bg-white hover:bg-[#009F9C] 
              px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 
              border-2 border-[#009F9C] shadow-sm hover:shadow-md hover:scale-105 active:scale-95
              text-sm"
          >
            <span>Request Access Instead</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.form>
  );
}
