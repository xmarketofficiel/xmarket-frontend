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
        placeholder="your.name@um6p.ma"
        label="Community email address"
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

      <p className="text-sm leading-6 text-gray-500 text-center">
        For UM6P community students and staff with an <strong>@um6p.ma</strong> or{' '}
        <strong>@student.1337.ma</strong> email. Every member can buy and sell items.
      </p>
    </motion.form>
  );
}
