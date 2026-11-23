import { motion } from 'framer-motion';
import { User, Phone, Lock, Building, MapPin, Users, Mail } from 'lucide-react';
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
  
  // Email validation
  const isEmailValid = formData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) : false;
  
  // Department is automatically set for 1337 and UM6P users
  const isDepartmentDisabled = formData.userType === '1337' || formData.userType === 'um6p';
  const isDepartmentValid = isDepartmentDisabled || formData.department;
  
  // Address is automatically set to "UM6P Ben Guerir" for UM6P and 1337 users
  const isAddressAutoFilled = formData.userType === '1337' || formData.userType === 'um6p';
  
  const isFormValid = formData.firstName && 
                     formData.lastName && 
                     isEmailValid &&
                     isDepartmentValid && 
                     formData.role && 
                     isPhoneValid && 
                     isPasswordValid && 
                     doPasswordsMatch;

  // Error messages
  const getPhoneError = () => {
    if (!formData.whatsappNumber) return '';
    if (!isPhoneValid) return 'Enter a valid Moroccan number: 06/07 (10 digits) or +212 (9 digits after)';
    return '';
  };

  const getEmailError = () => {
    if (!formData.email) return '';
    if (!isEmailValid) return 'Please enter a valid email address';
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
        
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            type="text"
            value={formData.firstName || ''}
            onChange={(value) => onUpdateFormData({ firstName: value })}
            onFocus={() => onFieldFocus('firstName')}
            onBlur={onFieldBlur}
            focused={focusedField === 'firstName'}
            placeholder="Enter your first name"
            label="First Name"
            required
            icon={<User className="w-5 h-5" />}
          />

          <InputField
            type="text"
            value={formData.lastName || ''}
            onChange={(value) => onUpdateFormData({ lastName: value })}
            onFocus={() => onFieldFocus('lastName')}
            onBlur={onFieldBlur}
            focused={focusedField === 'lastName'}
            placeholder="Enter your last name"
            label="Last Name"
            required
            icon={<User className="w-5 h-5" />}
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <InputField
            type="email"
            value={formData.email || ''}
            onChange={(value) => onUpdateFormData({ email: value })}
            onFocus={() => onFieldFocus('email')}
            onBlur={onFieldBlur}
            focused={focusedField === 'email'}
            placeholder="Enter your email address"
            label="Email Address"
            required
            icon={<Mail className="w-5 h-5" />}
            error={formData.email && !isEmailValid ? getEmailError() : ''}
            isValid={formData.email ? isEmailValid : undefined}
            disabled={true}
          />
          {formData.email && formData.userType && (formData.userType === '1337' || formData.userType === 'um6p') && (
            <p className="text-xs text-gray-500 px-1">
              This is your verified community email address.
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 px-1">
            Role <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              onClick={() => onUpdateFormData({ role: 'student' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.role === 'student'
                  ? 'border-[#009F9C] bg-[#009F9C]/10 text-[#009F9C]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center space-y-2">
                <Users className="w-6 h-6" />
                <span className="font-medium">Student</span>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => onUpdateFormData({ role: 'staff' })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.role === 'staff'
                  ? 'border-[#009F9C] bg-[#009F9C]/10 text-[#009F9C]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center space-y-2">
                <Building className="w-6 h-6" />
                <span className="font-medium">Staff</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Department */}
        <InputField
          type="text"
          value={formData.department || ''}
          onChange={(value) => onUpdateFormData({ department: value })}
          onFocus={() => onFieldFocus('department')}
          onBlur={onFieldBlur}
          focused={focusedField === 'department'}
          placeholder={formData.userType === '1337' ? '1337 School' : formData.userType === 'um6p' ? 'UM6P' : 'e.g., Computer Science, Engineering, Administration'}
          label="Department"
          required
          icon={<Building className="w-5 h-5" />}
          disabled={formData.userType === '1337' || formData.userType === 'um6p'}
        />

        {/* Address - Hidden for UM6P and 1337 users, automatically set to "UM6P Ben Guerir" */}
        {!isAddressAutoFilled && (
          <InputField
            type="text"
            value={formData.address || ''}
            onChange={(value) => onUpdateFormData({ address: value })}
            onFocus={() => onFieldFocus('address')}
            onBlur={onFieldBlur}
            focused={focusedField === 'address'}
            placeholder="Enter your address"
            label="Address"
            required
            icon={<MapPin className="w-5 h-5" />}
          />
        )}

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
