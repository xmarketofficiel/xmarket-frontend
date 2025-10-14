'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ApiErrorBoundary } from '../../components/ApiErrorBoundary';

// Components
import { AnimatedBackground } from './components/AnimatedBackground';
import { BrandingPanel } from './components/BrandingPanel';
import { StepHeader } from './components/StepHeader';
import { UserTypeStep } from './components/UserTypeStep';

// Constants and Types
import { SIGNUP_CONFIG } from './constants';
import type { 
  SignupState, 
  FloatingElement, 
  SignupFormData 
} from './types';

/**
 * Main Signup Page - User Type Selection Only
 * Routes users to appropriate signup flows based on their selection
 */
export default function SignupPage() {
  const router = useRouter();

  // Initialize floating elements for background animation
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  // Minimal state for user type selection
  const [state, setState] = useState<SignupState>({
    signupMode: SIGNUP_CONFIG.DEFAULT_SIGNUP_MODE,
    formData: {
      step: 'user-type',
      userType: undefined,
      email: '',
      otp: '',
      firstName: '',
      lastName: '',
      department: '',
      role: 'student',
      address: '',
      fullName: '',
      whatsappNumber: '',
      password: '',
      confirmPassword: '',
      loginName: ''
    },
    requestAccessData: {
      firstName: '',
      lastName: '',
      department: '',
      role: 'seller',
      address: '',
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
    showConfirmPassword: false,
    requestSubmitted: false
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

  return (
    <ApiErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <AnimatedBackground floatingElements={floatingElements} />
        
        <div className="relative z-10 min-h-screen flex">
          {/* Hide branding panel on mobile, show only on desktop */}
          <BrandingPanel 
            currentStep={state.formData.step} 
            signupMode={state.signupMode}
          />
          
          {/* Main Content Panel - Full width on mobile */}
          <div className="w-full lg:w-1/2 lg:ml-auto flex justify-center p-4 lg:p-6">
            <div className="w-full max-w-sm lg:max-w-md">
              <div className="relative">
                {/* Back to Home Button - Mobile optimized */}
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center text-gray-600 hover:text-[#009F9C] transition-colors duration-200 mb-6 group self-start touch-manipulation"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  <span className="font-medium">Back to Home</span>
                </button>

                <StepHeader 
                  step={state.formData.step} 
                  signupMode={state.signupMode}
                />
                
                {/* User Type Selection Step */}
                <UserTypeStep
                  key="user-type"
                  isLoading={state.isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApiErrorBoundary>
  );
}
