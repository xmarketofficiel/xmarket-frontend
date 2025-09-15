import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { InputField } from './InputField';
import { MessageDisplay } from './MessageDisplay';
import { SubmitButton } from './SubmitButton';
import { STEP_CONFIG, ANIMATION_VARIANTS } from '../constants';
import type { RequestAccessStepProps } from '../types';

/**
 * Request Access Step Component
 * Alternative flow for users without authorized emails
 */
export function RequestAccessStep({
  requestData,
  isLoading,
  message,
  messageType,
  focusedField,
  onSubmit,
  onFieldFocus,
  onFieldBlur,
  onUpdateRequestData,
  onSwitchToSignup
}: RequestAccessStepProps) {
  const config = STEP_CONFIG.REQUEST_ACCESS;

  const isFormValid = requestData.fullName && requestData.email && requestData.whatsappNumber && requestData.reason;

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6"
      {...ANIMATION_VARIANTS.fadeInUp}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Information note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-blue-50/50 rounded-lg border border-blue-200"
      >
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> We're currently in early access. Fill out this form and we'll review your request within 24 hours.
        </p>
      </motion.div>

      {/* Personal Information */}
      <div className="space-y-4">
        <InputField
          type="text"
          value={requestData.fullName}
          onChange={(value) => onUpdateRequestData({ fullName: value })}
          onFocus={() => onFieldFocus('fullName')}
          onBlur={onFieldBlur}
          focused={focusedField === 'fullName'}
          placeholder="Enter your full name"
          label="Full Name"
          required
          icon={<User className="w-5 h-5" />}
        />

        <InputField
          type="email"
          value={requestData.email}
          onChange={(value) => onUpdateRequestData({ email: value })}
          onFocus={() => onFieldFocus('email')}
          onBlur={onFieldBlur}
          focused={focusedField === 'email'}
          placeholder="your.email@university.edu"
          label="Email Address"
          required
          icon={<Mail className="w-5 h-5" />}
        />

        <InputField
          type="tel"
          value={requestData.whatsappNumber}
          onChange={(value) => onUpdateRequestData({ whatsappNumber: value })}
          onFocus={() => onFieldFocus('whatsappNumber')}
          onBlur={onFieldBlur}
          focused={focusedField === 'whatsappNumber'}
          placeholder="+1 (555) 123-4567"
          label="WhatsApp Number"
          required
          icon={<Phone className="w-5 h-5" />}
        />
      </div>

      {/* Reason for access */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Why do you want to join XMarket? <span className="text-red-500">*</span>
        </label>
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute left-3 top-3 text-gray-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <textarea
            value={requestData.reason}
            onChange={(e) => onUpdateRequestData({ reason: e.target.value })}
            onFocus={() => onFieldFocus('reason')}
            onBlur={onFieldBlur}
            placeholder="Tell us about your university, what you're studying, and why you'd like to use our marketplace..."
            className={`
              w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 
              bg-white/50 backdrop-blur-sm placeholder-gray-400 resize-none
              ${focusedField === 'reason'
                ? 'border-[#009F9C] shadow-lg shadow-[#009F9C]/20 bg-white/80' 
                : 'border-gray-200 hover:border-gray-300'
              }
              focus:outline-none focus:border-[#009F9C] focus:shadow-lg focus:shadow-[#009F9C]/20 focus:bg-white/80
            `}
            rows={4}
            maxLength={500}
            required
          />
          {requestData.reason.length > 0 && (
            <div className="text-xs text-gray-500 mt-1 text-right">
              {requestData.reason.length}/500
            </div>
          )}
        </motion.div>
      </div>

      {message && (
        <MessageDisplay message={message} type={messageType} />
      )}

      <SubmitButton
        isLoading={isLoading}
        text={config.buttonText}
        loadingText={config.loadingText}
        disabled={!isFormValid}
        icon={<Send className="w-4 h-4" />}
      />

      {/* Switch back to signup */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500 mb-2">
          Have an authorized student email?
        </p>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-[#009F9C] hover:text-[#008A87] font-medium underline transition-colors duration-200"
        >
          Sign Up Instead
        </button>
      </motion.div>
    </motion.form>
  );
}
