'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
    email: LOGIN_CONFIG.DEFAULT_EMAIL,
    password: LOGIN_CONFIG.DEFAULT_PASSWORD,
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
    
    if (errorMessage.includes('Invalid email format')) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    if (errorMessage.includes('User not found') || errorMessage.includes('Invalid credentials')) {
      return ERROR_MESSAGES.INVALID_CREDENTIALS;
    }
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
          router.push('/marketplace');
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <AnimatedBackground />
        
        <div className="relative z-10 min-h-screen flex">
          <BrandingPanel />
          
          {/* Login Form Panel */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: LOGIN_CONFIG.ANIMATION_DURATION }}
              className="max-w-md w-full"
            >
              <LoginCard onSubmit={handleLogin} state={state} handlers={{
                updateState,
                handleFieldFocus,
                handleFieldBlur,
                handleTogglePassword
              }} />
            </motion.div>
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

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 relative">
      <LoginHeader />
      
      <motion.form
        onSubmit={onSubmit}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
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
      </motion.form>

      <LoginFooter />
    </div>
  );
}
