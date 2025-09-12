'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/apiEndpoints';
import { useUser } from '../../contexts/UserContext';
import { ApiErrorBoundary } from '../../components/ApiErrorBoundary';

// Components
import { AnimatedBackground } from './components/AnimatedBackground';
import { BrandingPanel } from './components/BrandingPanel';
import { StepHeader } from './components/StepHeader';
import { EmailStep } from './components/EmailStep';
import { OtpStep } from './components/OtpStep';
import { DetailsStep } from './components/DetailsStep';
import { CompleteStep } from './components/CompleteStep';
import { RequestAccessStep } from './components/RequestAccessStep';
import { NavigationFooter } from './components/NavigationFooter';

// Constants and Types
import { SIGNUP_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';
import type { 
  SignupState, 
  FloatingElement, 
  SignupFormData, 
  RequestAccessData,
  SignupHandlers 
} from './types';

/**
 * Signup Page - Optimized with clean component architecture
 * Features multi-step signup flow, request access alternative, and comprehensive error handling
 */
export default function SignupPage() {
  const router = useRouter();
  const { refreshUser } = useUser();

  // Initialize floating elements for background animation
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  // Consolidated state management
  const [state, setState] = useState<SignupState>({
    signupMode: SIGNUP_CONFIG.DEFAULT_SIGNUP_MODE,
    formData: {
      step: 'email',
      email: '',
      otp: '',
      fullName: '',
      whatsappNumber: '',
      password: '',
      confirmPassword: ''
    },
    requestAccessData: {
      fullName: '',
      email: '',
      whatsappNumber: '',
      reason: ''
    },
    isLoading: false,
    message: '',
    messageType: 'error',
    resendTimer: 0,
    canResend: false,
    otpSent: false,
    focusedField: '',
    showPassword: false,
    showConfirmPassword: false
  });

  /**
   * Initialize floating elements animation
   */
  useEffect(() => {
    const elements = Array.from({ length: SIGNUP_CONFIG.FLOATING_ELEMENTS_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      delay: Math.random() * 5,
      size: Math.random() * 20 + 15
    }));
    setFloatingElements(elements);
  }, []);

  /**
   * Handle resend timer countdown
   */
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

  /**
   * Update state helper function
   */
  const updateState = (updates: Partial<SignupState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  /**
   * Start resend timer
   */
  const startResendTimer = () => {
    updateState({ 
      resendTimer: SIGNUP_CONFIG.RESEND_TIMER, 
      canResend: false 
    });
  };

  /**
   * Get error message based on error response
   */
  const getErrorMessage = (error: any): string => {
    const errorMessage = error?.message || '';
    
    if (errorMessage.includes('Invalid email format')) {
      return ERROR_MESSAGES.INVALID_EMAIL;
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

  /**
   * Handle sending OTP
   */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ isLoading: true, message: '', messageType: 'error' });

    // Validate email format
    if (!SIGNUP_CONFIG.EMAIL_REGEX.test(state.formData.email)) {
      updateState({ 
        message: ERROR_MESSAGES.INVALID_EMAIL,
        isLoading: false
      });
      return;
    }

    try {
      const response = await api.auth.sendOtp(state.formData.email);
      
      updateState({
        message: SUCCESS_MESSAGES.OTP_SENT,
        messageType: 'success',
        formData: { ...state.formData, step: 'otp' },
        otpSent: true
      });
      startResendTimer();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  /**
   * Handle resending OTP
   */
  const handleResendOtp = async () => {
    if (!state.canResend) return;

    updateState({ isLoading: true, message: '', messageType: 'error' });

    try {
      await api.auth.sendOtp(state.formData.email);
      
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

  /**
   * Handle OTP verification
   */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ isLoading: true, message: '', messageType: 'error' });

    // Validate OTP format
    if (state.formData.otp.length !== 6) {
      updateState({ 
        message: ERROR_MESSAGES.INVALID_OTP,
        isLoading: false
      });
      return;
    }

    try {
      const response = await api.auth.verifyOtp(state.formData.email, state.formData.otp);
      
      updateState({
        message: SUCCESS_MESSAGES.OTP_VERIFIED,
        messageType: 'success',
        formData: { ...state.formData, step: 'details' }
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  /**
   * Handle completing signup
   */
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ isLoading: true, message: '', messageType: 'error' });

    // Validate form data
    const { fullName, whatsappNumber, password, confirmPassword } = state.formData;
    
    if (!fullName) {
      updateState({ message: ERROR_MESSAGES.NAME_REQUIRED, isLoading: false });
      return;
    }
    
    if (!whatsappNumber) {
      updateState({ message: ERROR_MESSAGES.PHONE_REQUIRED, isLoading: false });
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
      const response = await api.auth.completeSignup({
        email: state.formData.email,
        otp: state.formData.otp,
        fullName,
        whatsappNumber,
        password
      });

      if (response.data) {
        await refreshUser();
        
        updateState({
          formData: { ...state.formData, step: 'complete' },
          message: SUCCESS_MESSAGES.SIGNUP_SUCCESS,
          messageType: 'success'
        });

        // Redirect after delay
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

  /**
   * Handle request access submission
   */
  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ isLoading: true, message: '', messageType: 'error' });

    const { fullName, email, whatsappNumber, reason } = state.requestAccessData;
    
    // Validate form data
    if (!fullName || !email || !whatsappNumber || !reason) {
      updateState({ 
        message: 'Please fill in all required fields',
        isLoading: false 
      });
      return;
    }

    if (!SIGNUP_CONFIG.EMAIL_REGEX.test(email)) {
      updateState({ 
        message: ERROR_MESSAGES.INVALID_EMAIL,
        isLoading: false 
      });
      return;
    }

    try {
      const response = await api.auth.requestAccess({
        fullName,
        email,
        whatsappNumber,
        reason
      });

      updateState({
        message: SUCCESS_MESSAGES.REQUEST_SUBMITTED,
        messageType: 'success',
        formData: { ...state.formData, step: 'complete' }
      });
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  /**
   * Create handlers object for components
   */
  const handlers: SignupHandlers = {
    handleSendOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleCompleteSignup,
    handleRequestAccess,
    handleFieldFocus: (field: string) => updateState({ focusedField: field }),
    handleFieldBlur: () => updateState({ focusedField: '' }),
    handleTogglePassword: (field: 'password' | 'confirmPassword') => {
      if (field === 'password') {
        updateState({ showPassword: !state.showPassword });
      } else {
        updateState({ showConfirmPassword: !state.showConfirmPassword });
      }
    },
    switchToSignup: () => updateState({ 
      signupMode: 'signup',
      formData: { ...state.formData, step: 'email' },
      message: ''
    }),
    switchToRequestAccess: () => updateState({ 
      signupMode: 'request-access',
      formData: { ...state.formData, step: 'request-access' },
      message: ''
    }),
    updateFormData: (updates: Partial<SignupFormData>) => {
      updateState({ formData: { ...state.formData, ...updates } });
    },
    updateRequestData: (updates: Partial<RequestAccessData>) => {
      updateState({ requestAccessData: { ...state.requestAccessData, ...updates } });
    }
  };

  return (
    <ApiErrorBoundary>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <AnimatedBackground floatingElements={floatingElements} />
        
        <div className="relative z-10 min-h-screen flex">
          <BrandingPanel 
            currentStep={state.formData.step} 
            signupMode={state.signupMode}
          />
          
          {/* Main Content Panel */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: SIGNUP_CONFIG.ANIMATION_DURATION }}
              className="max-w-md w-full"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 relative">
                <StepHeader 
                  step={state.formData.step} 
                  signupMode={state.signupMode}
                />
                
                <AnimatePresence mode="wait">
                  {/* Email Step */}
                  {state.signupMode === 'signup' && state.formData.step === 'email' && (
                    <EmailStep
                      key="email"
                      formData={state.formData}
                      isLoading={state.isLoading}
                      message={state.message}
                      messageType={state.messageType}
                      focusedField={state.focusedField}
                      onSubmit={handlers.handleSendOtp}
                      onFieldFocus={handlers.handleFieldFocus}
                      onFieldBlur={handlers.handleFieldBlur}
                      onUpdateFormData={handlers.updateFormData}
                      onSwitchToRequestAccess={handlers.switchToRequestAccess}
                    />
                  )}

                  {/* OTP Step */}
                  {state.signupMode === 'signup' && state.formData.step === 'otp' && (
                    <OtpStep
                      key="otp"
                      formData={state.formData}
                      isLoading={state.isLoading}
                      message={state.message}
                      messageType={state.messageType}
                      resendTimer={state.resendTimer}
                      canResend={state.canResend}
                      focusedField={state.focusedField}
                      onSubmit={handlers.handleVerifyOtp}
                      onResend={handlers.handleResendOtp}
                      onFieldFocus={handlers.handleFieldFocus}
                      onFieldBlur={handlers.handleFieldBlur}
                      onUpdateFormData={handlers.updateFormData}
                    />
                  )}

                  {/* Details Step */}
                  {state.signupMode === 'signup' && state.formData.step === 'details' && (
                    <DetailsStep
                      key="details"
                      formData={state.formData}
                      isLoading={state.isLoading}
                      message={state.message}
                      messageType={state.messageType}
                      focusedField={state.focusedField}
                      showPassword={state.showPassword}
                      showConfirmPassword={state.showConfirmPassword}
                      onSubmit={handlers.handleCompleteSignup}
                      onFieldFocus={handlers.handleFieldFocus}
                      onFieldBlur={handlers.handleFieldBlur}
                      onTogglePassword={handlers.handleTogglePassword}
                      onUpdateFormData={handlers.updateFormData}
                    />
                  )}

                  {/* Complete Step */}
                  {state.formData.step === 'complete' && (
                    <CompleteStep
                      key="complete"
                      formData={state.formData}
                    />
                  )}

                  {/* Request Access Step */}
                  {state.signupMode === 'request-access' && (
                    <RequestAccessStep
                      key="request-access"
                      requestData={state.requestAccessData}
                      isLoading={state.isLoading}
                      message={state.message}
                      messageType={state.messageType}
                      focusedField={state.focusedField}
                      onSubmit={handlers.handleRequestAccess}
                      onFieldFocus={handlers.handleFieldFocus}
                      onFieldBlur={handlers.handleFieldBlur}
                      onUpdateRequestData={handlers.updateRequestData}
                      onSwitchToSignup={handlers.switchToSignup}
                    />
                  )}
                </AnimatePresence>

                <NavigationFooter
                  currentStep={state.formData.step}
                  signupMode={state.signupMode}
                  onSwitchToSignup={handlers.switchToSignup}
                  onSwitchToRequestAccess={handlers.switchToRequestAccess}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ApiErrorBoundary>
  );
}
