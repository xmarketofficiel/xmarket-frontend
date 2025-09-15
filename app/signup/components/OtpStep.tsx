import { motion } from 'framer-motion';
import { KeyRound, RefreshCw } from 'lucide-react';
import { InputField } from './InputField';
import { MessageDisplay } from './MessageDisplay';
import { SubmitButton } from './SubmitButton';
import { STEP_CONFIG, ANIMATION_VARIANTS } from '../constants';
import type { OtpStepProps } from '../types';

/**
 * OTP Verification Step Component
 * Second step - verify email with OTP
 */
export function OtpStep({
  formData,
  isLoading,
  message,
  messageType,
  resendTimer,
  canResend,
  focusedField,
  onSubmit,
  onResend,
  onFieldFocus,
  onFieldBlur,
  onUpdateFormData
}: OtpStepProps) {
  const config = STEP_CONFIG.OTP;

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6"
      {...ANIMATION_VARIANTS.fadeInUp}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Email confirmation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center p-4 bg-teal-50/50 rounded-lg border border-teal-200"
      >
        <p className="text-sm text-gray-600">
          Verification code sent to:
        </p>
        <p className="font-medium text-gray-900">{formData.email}</p>
      </motion.div>

      <InputField
        type="text"
        value={formData.otp}
        onChange={(value) => onUpdateFormData({ otp: value.replace(/\D/g, '').slice(0, 6) })}
        onFocus={() => onFieldFocus('otp')}
        onBlur={onFieldBlur}
        focused={focusedField === 'otp'}
        placeholder="000000"
        label="Verification Code"
        required
        maxLength={6}
        icon={<KeyRound className="w-5 h-5" />}
      />

      {message && (
        <MessageDisplay message={message} type={messageType} />
      )}

      <SubmitButton
        isLoading={isLoading}
        text={config.buttonText}
        loadingText={config.loadingText}
        disabled={formData.otp.length !== 6}
      />

      {/* Resend OTP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500 mb-2">
          Didn't receive the code?
        </p>
        
        {canResend ? (
          <button
            type="button"
            onClick={onResend}
            className="inline-flex items-center text-[#009F9C] hover:text-[#008A87] font-medium underline transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Resend Code
          </button>
        ) : (
          <p className="text-sm text-gray-400">
            Resend in {resendTimer}s
          </p>
        )}
      </motion.div>
    </motion.form>
  );
}
