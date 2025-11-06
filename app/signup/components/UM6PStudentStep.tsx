'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../../lib/apiEndpoints';
import { useUser } from '../../../contexts/UserContext';

// Import existing step components
import { EmailStep } from './EmailStep';
import { OtpStep } from './OtpStep';
import { DetailsStep } from './DetailsStep';
import { CompleteStep } from './CompleteStep';

// Constants and Types
import { SIGNUP_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { motion } from 'framer-motion';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import type { SignupFormData } from '../types';

interface UM6PStudentStepProps {
  onBack: () => void;
}

export function UM6PStudentStep({ onBack }: UM6PStudentStepProps) {
  const router = useRouter();
  const { refreshUser } = useUser();

  const [formData, setFormData] = useState<SignupFormData>({
    step: 'email',
    userType: 'um6p',
    email: '',
    otp: '',
    firstName: '',
    lastName: '',
    department: 'UM6P',
    role: 'student',
    address: 'UM6P Ben Guerir',
    whatsappNumber: '',
    password: '',
    confirmPassword: '',
    loginName: '',
    fullName: '' // Legacy field
  });

  const [state, setState] = useState({
    isLoading: false,
    message: '',
    messageType: 'error' as 'success' | 'error',
    resendTimer: 0,
    canResend: false,
    focusedField: '',
    showPassword: false,
    showConfirmPassword: false
  });

  // Handle resend timer countdown
  useEffect(() => {
    if (state.resendTimer <= 0) {
      setState(prev => ({ ...prev, canResend: true }));
      return;
    }

    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        resendTimer: prev.resendTimer > 0 ? prev.resendTimer - 1 : 0
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.resendTimer]);

  // Update state helper
  const updateState = (updates: any) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Start resend timer
  const startResendTimer = () => {
    updateState({ 
      resendTimer: SIGNUP_CONFIG.RESEND_TIMER, 
      canResend: false 
    });
  };

  // Validate phone number format
  const isValidPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    if (cleanPhone.startsWith('06') || cleanPhone.startsWith('07')) {
      return cleanPhone.length === 10;
    }
    
    if (cleanPhone.startsWith('+212')) {
      const afterCode = cleanPhone.substring(4);
      return afterCode.length === 9;
    }
    
    return false;
  };

  // Get error message
  const getErrorMessage = (error: any): string => {
    const errorMessage = error?.message || '';
    
    if (errorMessage.includes('Invalid email format')) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    if (errorMessage.includes('Cette adresse email est déjà enregistrée') || 
        errorMessage.includes('already registered') || 
        errorMessage.includes('déjà enregistrée')) {
      return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
    }
    if (errorMessage.includes('not authorized') || errorMessage.includes('unauthorized')) {
      return ERROR_MESSAGES.EMAIL_NOT_AUTHORIZED;
    }
    if (errorMessage.includes('Invalid OTP') || errorMessage.includes('incorrect')) {
      return ERROR_MESSAGES.OTP_INCORRECT;
    }
    if (errorMessage.includes('expired')) {
      return ERROR_MESSAGES.OTP_EXPIRED;
    }
    if (errorMessage.includes('Network Error') || errorMessage.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return ERROR_MESSAGES.GENERIC_ERROR;
  };

  // Handle sending OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ isLoading: true, message: '', messageType: 'error' });

    if (!SIGNUP_CONFIG.EMAIL_REGEX.test(formData.email)) {
      updateState({ 
        message: ERROR_MESSAGES.INVALID_EMAIL,
        isLoading: false
      });
      return;
    }

    try {
      await api.auth.sendOtp(formData.email);
      
      updateState({
        message: SUCCESS_MESSAGES.OTP_SENT,
        messageType: 'success'
      });
      setFormData(prev => ({ ...prev, step: 'otp' }));
      startResendTimer();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    if (!state.canResend) return;

    updateState({ isLoading: true, message: '', messageType: 'error' });

    try {
      await api.auth.sendOtp(formData.email);
      
      updateState({
        message: SUCCESS_MESSAGES.RESEND_SUCCESS,
        messageType: 'success'
      });
      startResendTimer();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ isLoading: true, message: '', messageType: 'error' });

    if (formData.otp.length !== 6) {
      updateState({ 
        message: ERROR_MESSAGES.INVALID_OTP,
        isLoading: false
      });
      return;
    }

    try {
      await api.auth.verifyOtp(formData.email, formData.otp);
      
      updateState({
        message: SUCCESS_MESSAGES.OTP_VERIFIED,
        messageType: 'success'
      });
      setFormData(prev => ({ ...prev, step: 'details' }));
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  // Handle completing signup
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ isLoading: true, message: '', messageType: 'error' });

    const { fullName, whatsappNumber, password, confirmPassword } = formData;
    

    
    if (!whatsappNumber) {
      updateState({ message: ERROR_MESSAGES.PHONE_REQUIRED, isLoading: false });
      return;
    }
    
    if (!isValidPhoneNumber(whatsappNumber)) {
      updateState({ message: ERROR_MESSAGES.PHONE_INVALID, isLoading: false });
      return;
    }
    
    if (password.length < SIGNUP_CONFIG.PASSWORD_MIN_LENGTH) {
      updateState({ message: ERROR_MESSAGES.PASSWORD_TOO_SHORT, isLoading: false });
      return;
    }
    
    if (password !== confirmPassword) {
      updateState({ message: ERROR_MESSAGES.PASSWORD_MISMATCH, isLoading: false });
      return;
    }

    try {
      const response = await api.auth.completeRegistration({
        email: formData.email,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        department: 'UM6P',
        role: formData.role || 'student',
        address: formData.address || '',
        whatsappNumber,
        password,
        // Backward compatibility
        fullName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || fullName
      });

      if (response.data) {
        await refreshUser();
        
        updateState({
          message: SUCCESS_MESSAGES.SIGNUP_SUCCESS,
          messageType: 'success'
        });
        setFormData(prev => ({ ...prev, step: 'complete' }));

        setTimeout(() => {
          router.push('/marketplace');
        }, SIGNUP_CONFIG.REDIRECT_DELAY);
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const updateFormData = (updates: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >

      {/* Email Step */}
      {formData.step === 'email' && (
        <EmailStep
          formData={formData}
          isLoading={state.isLoading}
          message={state.message}
          messageType={state.messageType}
          focusedField={state.focusedField}
          onSubmit={handleSendOtp}
          onFieldFocus={(field: string) => updateState({ focusedField: field })}
          onFieldBlur={() => updateState({ focusedField: '' })}
          onUpdateFormData={updateFormData}
          onSwitchToRequestAccess={() => router.push('/signup/external')}
        />
      )}

      {/* OTP Step */}
      {formData.step === 'otp' && (
        <OtpStep
          formData={formData}
          isLoading={state.isLoading}
          message={state.message}
          messageType={state.messageType}
          resendTimer={state.resendTimer}
          canResend={state.canResend}
          focusedField={state.focusedField}
          onSubmit={handleVerifyOtp}
          onResend={handleResendOtp}
          onFieldFocus={(field: string) => updateState({ focusedField: field })}
          onFieldBlur={() => updateState({ focusedField: '' })}
          onUpdateFormData={updateFormData}
        />
      )}

      {/* Details Step */}
      {formData.step === 'details' && (
        <DetailsStep
          formData={formData}
          isLoading={state.isLoading}
          message={state.message}
          messageType={state.messageType}
          focusedField={state.focusedField}
          showPassword={state.showPassword}
          showConfirmPassword={state.showConfirmPassword}
          onSubmit={handleCompleteSignup}
          onFieldFocus={(field: string) => updateState({ focusedField: field })}
          onFieldBlur={() => updateState({ focusedField: '' })}
          onTogglePassword={(field: 'password' | 'confirmPassword') => {
            if (field === 'password') {
              updateState({ showPassword: !state.showPassword });
            } else {
              updateState({ showConfirmPassword: !state.showConfirmPassword });
            }
          }}
          onUpdateFormData={updateFormData}
        />
      )}

      {/* Complete Step */}
      {formData.step === 'complete' && (
        <CompleteStep
          formData={formData}
        />
      )}
    </motion.div>
  );
}
