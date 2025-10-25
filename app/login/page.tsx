'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../lib/apiEndpoints';
import { useUser } from '../../contexts/UserContext';
import { ApiErrorBoundary } from '../../components/ApiErrorBoundary';

// Components
import { AnimatedBackground } from './components/AnimatedBackground';
import { BrandingPanel } from './components/BrandingPanel';
import { LoginHeader } from './components/LoginHeader';
import { InputField } from './components/InputField';
import { MessageDisplay } from './components/MessageDisplay';
import { LoginButton } from './components/LoginButton';
import { LoginFooter } from './components/LoginFooter';

// Constants
import { LOGIN_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';

// Types
interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  message: string;
  messageType: 'success' | 'error';
  showPassword: boolean;
  focusedField: string;
}

/**
 * Login Page - Optimized with clean component architecture
 * Features responsive design, animations, and proper error handling
 */
export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  
  // Consolidated state management
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    isLoading: false,
    message: '',
    messageType: 'error',
    showPassword: false,
    focusedField: ''
  });

  /**
   * Update state helper function
   */
  const updateState = (updates: Partial<LoginState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  /**
   * Handle input field focus
   */
  const handleFieldFocus = (field: string) => {
    updateState({ focusedField: field });
  };

  /**
   * Handle input field blur
   */
  const handleFieldBlur = () => {
    updateState({ focusedField: '' });
  };

  /**
   * Toggle password visibility
   */
  const handleTogglePassword = () => {
    updateState({ showPassword: !state.showPassword });
  };

  /**
   * Determine error message based on error type
   */
  const getErrorMessage = (error: any): string => {
    const errorMessage = error?.message || '';
    
    // Check for account status related errors
    if (errorMessage.includes('suspended') || errorMessage.includes('Your account has been suspended')) {
      return ERROR_MESSAGES.ACCOUNT_SUSPENDED;
    }
    if (errorMessage.includes('banned') || errorMessage.includes('Your account has been banned')) {
      return ERROR_MESSAGES.ACCOUNT_BANNED;
    }
    if (errorMessage.includes('verify your email') || errorMessage.includes('Please verify your email')) {
      return ERROR_MESSAGES.EMAIL_NOT_VERIFIED;
    }
    
    // Check for credential related errors
    if (errorMessage.includes('Invalid email format')) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    if (errorMessage.includes('User not found') || errorMessage.includes('Invalid credentials')) {
      return ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
    
    // Check for network related errors
    if (errorMessage.includes('Network Error') || errorMessage.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    return ERROR_MESSAGES.GENERIC_ERROR;
  };

  /**
   * Handle login form submission
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateState({ 
      isLoading: true, 
      message: '',
      messageType: 'error'
    });

    try {
      const response = await api.auth.login({ 
        email: state.email, 
        password: state.password 
      });
      
      if (response.data) {
        await refreshUser();
        updateState({ 
          message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
          messageType: 'success'
        });
        
        setTimeout(() => {
          router.push('/');
        }, LOGIN_CONFIG.REDIRECT_DELAY);
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      updateState({ 
        message: errorMessage,
        messageType: 'error'
      });
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <ApiErrorBoundary>
      <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <AnimatedBackground />
        
        <div className="relative z-10 min-h-screen flex">
          <BrandingPanel />
          
          {/* Login Form Panel - Enhanced Mobile Responsiveness */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
              <LoginCard onSubmit={handleLogin} state={state} handlers={{
                updateState,
                handleFieldFocus,
                handleFieldBlur,
                handleTogglePassword
              }} />
            </div>
          </div>
        </div>
      </div>
    </ApiErrorBoundary>
  );
}

/**
 * Login form card component
 */
interface LoginCardProps {
  onSubmit: (e: React.FormEvent) => void;
  state: LoginState;
  handlers: {
    updateState: (updates: Partial<LoginState>) => void;
    handleFieldFocus: (field: string) => void;
    handleFieldBlur: () => void;
    handleTogglePassword: () => void;
  };
}

function LoginCard({ onSubmit, state, handlers }: LoginCardProps) {
  const { updateState, handleFieldFocus, handleFieldBlur, handleTogglePassword } = handlers;
  const router = useRouter();

  return (
    <div className="bg-white/95 backdrop-blur-sm design-card rounded-none sm:rounded-2xl lg:rounded-3xl border-0 sm:border sm:border-white/50 shadow-none sm:shadow-lg lg:shadow-xl p-6 sm:p-8 lg:p-10 relative min-h-screen sm:min-h-0 flex flex-col justify-center">
      {/* Back to Home Button - Mobile Optimized */}
      <button
        onClick={() => router.push('/')}
        className="flex items-center text-gray-600 hover:text-[#009F9C] active:text-[#007B78] transition-colors duration-200 mb-6 sm:mb-8 group self-start touch-manipulation min-h-[44px]"
      >
        <ArrowLeft className="w-5 h-5 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium text-sm sm:text-base">Back to Home</span>
      </button>

      <LoginHeader />
      
      <form
        onSubmit={onSubmit}
        className="space-y-5 sm:space-y-6"
      >
        {/* Email Input */}
        <InputField
          type="email"
          value={state.email}
          onChange={(value) => updateState({ email: value })}
          onFocus={() => handleFieldFocus('email')}
          onBlur={handleFieldBlur}
          focused={state.focusedField === 'email'}
          placeholder="Enter your email address"
          label="Email Address"
        />

        {/* Password Input */}
        <InputField
          type="password"
          value={state.password}
          onChange={(value) => updateState({ password: value })}
          onFocus={() => handleFieldFocus('password')}
          onBlur={handleFieldBlur}
          focused={state.focusedField === 'password'}
          showPassword={state.showPassword}
          onTogglePassword={handleTogglePassword}
          placeholder="Enter your password"
          label="Password"
        />

        {/* Message Display */}
        {state.message && (
          <MessageDisplay 
            message={state.message} 
            type={state.messageType} 
          />
        )}

        {/* Login Button */}
        <LoginButton 
          isLoading={state.isLoading}
          onClick={() => {}} // Form submission handled by onSubmit
        />
      </form>

      <LoginFooter />
    </div>
  );
}
