import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Building, MapPin, Users, Send } from 'lucide-react';
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

  const isPhoneValid = isValidPhoneNumber(requestData.whatsappNumber);
  const isFormValid = requestData.firstName && requestData.lastName && requestData.email && 
                     isPhoneValid && requestData.reason && requestData.role && 
                     requestData.department;

  // Error messages
  const getPhoneError = () => {
    if (!requestData.whatsappNumber) return '';
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
                {/* Name Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            type="text"
            value={requestData.firstName || ''}
            onChange={(value) => onUpdateRequestData({ firstName: value })}
            onFocus={() => onFieldFocus('firstName')}
            onBlur={onFieldBlur}
            focused={focusedField === 'firstName'}
            icon={<User className="w-5 h-5" />}
            placeholder="Enter your first name"
            required
          />
          
          <InputField
            label="Last Name"
            type="text"
            value={requestData.lastName || ''}
            onChange={(value) => onUpdateRequestData({ lastName: value })}
            onFocus={() => onFieldFocus('lastName')}
            onBlur={onFieldBlur}
            focused={focusedField === 'lastName'}
            icon={<User className="w-5 h-5" />}
            placeholder="Enter your last name"
            required
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          {/* <label className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3"> */}
            {/* <button
              type="button"
              onClick={() => onUpdateRequestData({ role: 'seller' })}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                requestData.role === 'seller'
                  ? 'border-[#009F9C] bg-[#009F9C]/10 text-[#009F9C]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 mx-auto mb-1" />
              Student
            </button> */}
            {/* <InputField
          label="Role"
          type="text"
          value={requestData.role || ''}
          onChange={(value) => onUpdateRequestData({ role: value as 'seller' })}
          onFocus={() => onFieldFocus('role')}
          onBlur={onFieldBlur}
          focused={focusedField === 'role'}
          icon={<Building className="w-5 h-5" />}
          placeholder="Enter your role"
          disabled
          required
        /> */}
            {/* <button
              type="button"
              onClick={() => onUpdateRequestData({ role: 'staff' })}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                requestData.role === 'staff'
                  ? 'border-[#009F9C] bg-[#009F9C]/10 text-[#009F9C]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building className="w-4 h-4 mx-auto mb-1" />
              Staff
            </button>/ */}
          {/* </div> */}
        </div>

        {/* Department Field */}
        {/* <InputField
          label="Department"
          type="text"
          value={requestData.department || ''}
          onChange={(value) => onUpdateRequestData({ department: value })}
          onFocus={() => onFieldFocus('department')}
          onBlur={onFieldBlur}
          focused={focusedField === 'department'}
          icon={<Building className="w-5 h-5" />}
          placeholder="Enter your department"
          required
        /> */}

        {/* Address Field - Hidden, automatically set to UM6P Ben Guerir */}
        {/* The address is automatically set to "UM6P Ben Guerir" in the backend submission */}

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
          placeholder="0612345678 or +212612345678"
          label="WhatsApp Number"
          required
          icon={<Phone className="w-5 h-5" />}
          error={requestData.whatsappNumber && !isPhoneValid ? getPhoneError() : ''}
          isValid={requestData.whatsappNumber ? isPhoneValid : undefined}
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
