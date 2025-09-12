import { motion } from 'framer-motion';
import { User, Phone, Lock } from 'lucide-react';
import { InputField } from './InputField';
import { MessageDisplay } from './MessageDisplay';
import { SubmitButton } from './SubmitButton';
import { STEP_CONFIG, ANIMATION_VARIANTS } from '../constants';
import type { DetailsStepProps } from '../types';

/**
 * Details Step Component
 * Third step - complete profile information
 */
export function DetailsStep({
  formData,
  isLoading,
  message,
  messageType,
  focusedField,
  showPassword,
  showConfirmPassword,
  onSubmit,
  onFieldFocus,
  onFieldBlur,
  onTogglePassword,
  onUpdateFormData
}: DetailsStepProps) {
  const config = STEP_CONFIG.DETAILS;

  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.fullName && formData.whatsappNumber && isPasswordValid && doPasswordsMatch;

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6"
      {...ANIMATION_VARIANTS.fadeInUp}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Personal Information
        </h3>
        
        <InputField
          type="text"
          value={formData.fullName}
          onChange={(value) => onUpdateFormData({ fullName: value })}
          onFocus={() => onFieldFocus('fullName')}
          onBlur={onFieldBlur}
          focused={focusedField === 'fullName'}
          placeholder="Enter your full name"
          label="Full Name"
          required
          icon={<User className="w-5 h-5" />}
        />

        <InputField
          type="tel"
          value={formData.whatsappNumber}
          onChange={(value) => onUpdateFormData({ whatsappNumber: value })}
          onFocus={() => onFieldFocus('whatsappNumber')}
          onBlur={onFieldBlur}
          focused={focusedField === 'whatsappNumber'}
          placeholder="+1 (555) 123-4567"
          label="WhatsApp Number"
          required
          icon={<Phone className="w-5 h-5" />}
        />
      </div>

      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Security
        </h3>
        
        <InputField
          type="password"
          value={formData.password}
          onChange={(value) => onUpdateFormData({ password: value })}
          onFocus={() => onFieldFocus('password')}
          onBlur={onFieldBlur}
          focused={focusedField === 'password'}
          showPassword={showPassword}
          onTogglePassword={() => onTogglePassword('password')}
          placeholder="Create a strong password"
          label="Password"
          required
          icon={<Lock className="w-5 h-5" />}
        />

        <InputField
          type="password"
          value={formData.confirmPassword}
          onChange={(value) => onUpdateFormData({ confirmPassword: value })}
          onFocus={() => onFieldFocus('confirmPassword')}
          onBlur={onFieldBlur}
          focused={focusedField === 'confirmPassword'}
          showPassword={showConfirmPassword}
          onTogglePassword={() => onTogglePassword('confirmPassword')}
          placeholder="Confirm your password"
          label="Confirm Password"
          required
          icon={<Lock className="w-5 h-5" />}
        />

        {/* Password validation hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <div className={`text-xs flex items-center space-x-2 ${isPasswordValid ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isPasswordValid ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>At least 8 characters</span>
          </div>
          
          {formData.confirmPassword && (
            <div className={`text-xs flex items-center space-x-2 ${doPasswordsMatch ? 'text-green-600' : 'text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${doPasswordsMatch ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
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
      />
    </motion.form>
  );
}
