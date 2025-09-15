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
        <p className="text-sm text-gray-500 mb-2">
          Don't have an authorized student email?
        </p>
        <button
          type="button"
          onClick={onSwitchToRequestAccess}
          className="text-[#009F9C] hover:text-[#008A87] font-medium underline transition-colors duration-200"
        >
          Request Access Instead
        </button>
      </motion.div>
    </motion.form>
  );
}
