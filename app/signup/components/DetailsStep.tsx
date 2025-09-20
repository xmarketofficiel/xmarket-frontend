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

  // Validation functions
  const isValidPhoneNumber = (phone: string) => {
    if (!phone) return false;
    // Remove all spaces, dashes, and other non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Case 1: Numbers starting with 06 or 07 (local format)
    if (cleanPhone.startsWith('06') || cleanPhone.startsWith('07')) {
      return cleanPhone.length === 10; // Exactly 10 digits including 06/07
    }
    
    // Case 2: Numbers starting with +212 (international format)
    if (cleanPhone.startsWith('+212')) {
      const afterCode = cleanPhone.substring(4); // Remove +212
      return afterCode.length === 9; // Exactly 9 digits after +212
    }
    
    // All other cases are invalid
    return false;
  };

  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isPhoneValid = isValidPhoneNumber(formData.whatsappNumber);
  const isFormValid = formData.fullName && isPhoneValid && isPasswordValid && doPasswordsMatch;

  // Error messages
  const getPhoneError = () => {
    if (!formData.whatsappNumber) return '';
    if (!isPhoneValid) return 'Enter a valid Moroccan number: 06/07 (10 digits) or +212 (9 digits after)';
    return '';
  };

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
          placeholder="0612345678 or +212612345678"
          label="WhatsApp Number"
          required
          icon={<Phone className="w-5 h-5" />}
          error={formData.whatsappNumber && !isPhoneValid ? getPhoneError() : ''}
          isValid={formData.whatsappNumber ? isPhoneValid : undefined}
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
