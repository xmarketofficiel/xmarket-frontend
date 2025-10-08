'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';
import { MessageDisplay } from './MessageDisplay';
import { DetailsStep } from './DetailsStep';
import { STEP_CONFIG } from '../constants';
import { api } from '../../../lib/apiEndpoints';
import type { SignupFormData } from '../types';

interface Student1337StepProps {
  onBack: () => void;
  onNext?: (formData: SignupFormData) => void;
}

export function Student1337Step({ onBack, onNext }: Student1337StepProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState<'form' | 'details'>('form');
  
  const [formData, setFormData] = useState<SignupFormData>({
    step: 'email',
    userType: '1337',
    email: '',
    otp: '',
    fullName: '',
    whatsappNumber: '',
    password: '',
    confirmPassword: '',
    loginName: '',
    studentType: '1337',
    discordData: undefined
  });

  const [state, setState] = useState({
    isLoading: false,
    message: '',
    messageType: 'error' as 'success' | 'error',
    focusedField: '',
    showPassword: false,
    showConfirmPassword: false,
    discordAuthenticated: false,
    discordUserData: null as any,
    processedCodes: new Set<string>(), // Track processed OAuth codes
    authenticatedCredentials: null as { email: string; loginName: string } | null // Track what was authenticated
  });

  const config = STEP_CONFIG["1337_STUDENT"];

  // Discord OAuth configuration
  const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || 'your_discord_client_id';
  const DISCORD_REDIRECT_URI = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/discord/callback`
    : '/auth/discord/callback';
  const DISCORD_SCOPE = 'identify email guilds';

  // Handle mobile OAuth redirect return
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      if (code || error) {
        // This is a return from mobile OAuth
        const savedFormData = localStorage.getItem('discord_signup_form_data');
        if (savedFormData) {
          try {
            const parsedData = JSON.parse(savedFormData);
            setFormData(parsedData);
            
            // Clean up localStorage
            localStorage.removeItem('discord_signup_form_data');
            localStorage.removeItem('discord_signup_return_url');
            
            // Process the OAuth result
            if (error) {
              setState(prev => ({ 
                ...prev, 
                message: 'Discord authentication failed. Please try again.',
                messageType: 'error'
              }));
            } else if (code && parsedData.email && parsedData.loginName) {
              // Check if this code has already been processed
              setState(prev => {
                if (prev.processedCodes.has(code)) {
                  return prev;
                }
                
                const newProcessedCodes = new Set(prev.processedCodes);
                newProcessedCodes.add(code);
                
                return { 
                  ...prev, 
                  isLoading: true, 
                  message: 'Verifying Discord membership...',
                  processedCodes: newProcessedCodes
                };
              });
              
              // Process Discord verification
              handleDiscordVerification(code, parsedData.email, parsedData.loginName);
            }
            
            // Clean up URL
            router.replace('/signup/1337-student', { scroll: false });
          } catch (error) {
            console.error('Error parsing saved form data:', error);
          }
        }
      }
    }
  }, [searchParams, router]);

  const handleDiscordVerification = async (code: string, email: string, loginName: string) => {
    try {
      const response = await api.auth.verifyDiscord1337({
        code,
        email,
        loginName
      });

      if (response.data.verified) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          discordAuthenticated: true,
          discordUserData: response.data.user,
          authenticatedCredentials: { email, loginName }, // Store what was authenticated
          message: 'Discord authentication successful! 1337 server membership verified.',
          messageType: 'success'
        }));
      } else {
        // This case should not happen with updated backend, but keeping as fallback
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          message: response.data.message || 'Verification failed',
          messageType: 'error'
        }));
      }
    } catch (error: any) {
      console.error('Discord verification error:', error);
      
      // Extract the error message from the response
      let errorMessage = 'Discord verification failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid Discord verification data. Please try again.';
      } else if (error.response?.status === 409) {
        errorMessage = 'This email address is already registered. Please log in or use a different email address.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        message: errorMessage,
        messageType: 'error'
      }));
    }
  };

  // Handle Discord OAuth via popup window or mobile-friendly redirect
  useEffect(() => {
    const handleDiscordMessage = async (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;
      
      const { type, code, error } = event.data;
      
      if (type === 'DISCORD_OAUTH_RESULT') {
        if (error) {
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            message: 'Discord authentication failed. Please try again.',
            messageType: 'error'
          }));
          return;
        }
        
        if (code && formData.email && formData.loginName) {
          // Check if this code has already been processed
          if (state.processedCodes.has(code)) {
            console.log('Discord code already processed, ignoring duplicate');
            return;
          }

          // Mark code as being processed
          const newProcessedCodes = new Set(state.processedCodes);
          newProcessedCodes.add(code);
          
          setState(prev => ({ 
            ...prev, 
            isLoading: true, 
            message: 'Verifying Discord membership...',
            processedCodes: newProcessedCodes
          }));
          
          // Use the same verification function
          handleDiscordVerification(code, formData.email, formData.loginName);
        }
      }
    };

    window.addEventListener('message', handleDiscordMessage);
    return () => window.removeEventListener('message', handleDiscordMessage);
  }, [formData.email, formData.loginName, state.processedCodes]);

  // Monitor form changes and invalidate Discord auth if credentials change
  useEffect(() => {
    if (state.discordAuthenticated && state.authenticatedCredentials) {
      const currentCredentials = { email: formData.email, loginName: formData.loginName };
      const authenticatedCredentials = state.authenticatedCredentials;
      
      // Check if current form data differs from what was authenticated
      if (currentCredentials.email !== authenticatedCredentials.email || 
          currentCredentials.loginName !== authenticatedCredentials.loginName) {
        
        setState(prev => ({ 
          ...prev, 
          discordAuthenticated: false,
          discordUserData: null,
          message: 'Discord authentication is no longer valid. Please authenticate again with the current email and login name.',
          messageType: 'error' as const
        }));
      }
    }
  }, [formData.email, formData.loginName, state.discordAuthenticated, state.authenticatedCredentials]);

  // Detect mobile device
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  };

  const handleDiscordOAuth = () => {
    if (!formData.email || !formData.loginName) {
      setState(prev => ({ 
        ...prev, 
        message: 'Please fill in email and login name first',
        messageType: 'error'
      }));
      return;
    }

    // Set loading state for the OAuth process
    setState(prev => ({ ...prev, isLoading: true, message: 'Opening Discord authentication...' }));

    // Construct Discord OAuth URL
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?` +
      `client_id=${DISCORD_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(DISCORD_SCOPE)}`;

    if (isMobile()) {
      // Mobile: Save form data and use full-page redirect
      if (typeof window !== 'undefined') {
        localStorage.setItem('discord_signup_form_data', JSON.stringify(formData));
        localStorage.setItem('discord_signup_return_url', window.location.pathname);
      }
      // Full redirect for mobile
      window.location.href = discordAuthUrl;
    } else {
      // Desktop: Use popup window
      const popup = window.open(
        discordAuthUrl,
        'discord-oauth',
        'width=500,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
      );

      // Monitor the popup
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Reset loading state if popup was closed without completing auth
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            message: prev.discordAuthenticated ? prev.message : ''
          }));
        }
      }, 1000);

      // Fallback timeout (5 minutes)
      setTimeout(() => {
        if (popup && !popup.closed) {
          popup.close();
        }
        clearInterval(checkClosed);
      }, 300000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.loginName) {
      setState(prev => ({ 
        ...prev, 
        message: 'Please fill in all fields',
        messageType: 'error'
      }));
      return;
    }

    // Validate 1337 email format
    if (!formData.email.endsWith('@student.1337.ma')) {
      setState(prev => ({ 
        ...prev, 
        message: 'Please use your 1337 student email address (@student.1337.ma)',
        messageType: 'error'
      }));
      return;
    }

    if (!state.discordAuthenticated || hasChangedFromAuthenticated) {
      setState(prev => ({ 
        ...prev, 
        message: hasChangedFromAuthenticated 
          ? 'Please re-authenticate with Discord for your current credentials or revert to the previously authenticated ones.'
          : 'Please authenticate with Discord first',
        messageType: 'error'
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, message: '' }));
    
    // Simulate registration process
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        message: 'Registration successful!',
        messageType: 'success'
      }));
      
      // Update form data with Discord info and move to details step
      const updatedFormData = {
        ...formData,
        fullName: state.discordUserData?.username || formData.loginName || '',
        step: 'details' as const,
        discordData: {
          discordUsername: state.discordUserData?.username || '',
          discordUserId: state.discordUserData?.id || '',
          avatarUrl: state.discordUserData?.avatar_url,
          isGuildMember: state.discordUserData?.is_guild_member || false,
          guildName: state.discordUserData?.guild_name
        }
      };
      
      setFormData(updatedFormData);
      setCurrentStep('details');
    }, 1000);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate 1337 email format
    if (field === 'email' && value) {
      if (!value.endsWith('@student.1337.ma')) {
        setState(prev => ({
          ...prev,
          message: 'Please use your 1337 student email address (@student.1337.ma)',
          messageType: 'error'
        }));
      } else {
        // Clear error message if email format is correct
        setState(prev => ({
          ...prev,
          message: '',
          messageType: 'error'
        }));
      }
    }
  };

  const handleFieldFocus = (field: string) => {
    setState(prev => ({ ...prev, focusedField: field }));
  };

  const handleFieldBlur = () => {
    setState(prev => ({ ...prev, focusedField: '' }));
  };

  // Function to revert to authenticated credentials
  const revertToAuthenticatedCredentials = () => {
    if (state.authenticatedCredentials) {
      setFormData(prev => ({
        ...prev,
        email: state.authenticatedCredentials!.email,
        loginName: state.authenticatedCredentials!.loginName
      }));
      setState(prev => ({ 
        ...prev, 
        discordAuthenticated: true,
        message: 'Reverted to previously authenticated credentials. Discord authentication is now valid.',
        messageType: 'success'
      }));
    }
  };

  // Check if current form differs from authenticated credentials
  const hasChangedFromAuthenticated = state.authenticatedCredentials && 
    (formData.email !== state.authenticatedCredentials.email || 
     formData.loginName !== state.authenticatedCredentials.loginName);

  // Handle complete signup for details step
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.discordAuthenticated) {
      setState(prev => ({
        ...prev,
        message: 'Please authenticate with Discord first',
        messageType: 'error'
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, message: '' }));

    try {
      const signupData = {
        email: formData.email,
        fullName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        password: formData.password,
        loginName: formData.loginName,
        userType: '1337',
        discordUserId: state.discordUserData?.id,
        discordUsername: state.discordUserData?.username
      };

      const response = await api.auth.completeRegistration({
        email: formData.email,
        fullName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        password: formData.password
      });

      if (response.status === 200 || response.status === 201) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          message: 'Account created successfully!',
          messageType: 'success'
        }));

        // Navigate to complete step
        if (onNext) {
          setTimeout(() => {
            onNext({ ...formData, step: 'complete' });
          }, 1000);
        }
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          message: response.message || 'Signup failed',
          messageType: 'error'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        message: 'Network error. Please try again.',
        messageType: 'error'
      }));
    }
  };

  // Helper functions for details step
  const updateFormData = (updates: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateState = (updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Handle back navigation
  const handleBackNavigation = () => {
    if (currentStep === 'details') {
      setCurrentStep('form');
    } else {
      onBack();
    }
  };

  // Conditional rendering based on current step
  if (currentStep === 'details') {
    return (
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
    );
  }

  return (
    <motion.div 
      className="space-y-4 px-6 py-4 max-w-sm mx-auto min-h-screen flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col"
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_SYSTEM.duration.normal / 1000,
            delay: 0.1,
            ease: ANIMATION_SYSTEM.framerEasing.easeOut 
          }}
        >
          <InputField
            type="email"
            label="1337 Email"
                        placeholder="your.email@student.1337.ma"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            onFocus={() => handleFieldFocus('email')}
            onBlur={handleFieldBlur}
            required
            focused={state.focusedField === 'email'}
          />
        </motion.div>

        {/* Login Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_SYSTEM.duration.normal / 1000,
            delay: 0.2,
            ease: ANIMATION_SYSTEM.framerEasing.easeOut 
          }}
        >
          <InputField
            type="text"
            label="1337 Login Name"
            placeholder="Your 1337 login username"
            value={formData.loginName || ''}
            onChange={(value) => handleFieldChange('loginName', value)}
            onFocus={() => handleFieldFocus('loginName')}
            onBlur={handleFieldBlur}
            required
            focused={state.focusedField === 'loginName'}
          />
        </motion.div>

        {/* Message Display */}
        {state.message && (
          <MessageDisplay 
            message={state.message} 
            type={state.messageType} 
          />
        )}

        {/* Credential Change Warning & Revert Option */}
        {hasChangedFromAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-amber-800">
                  Credentials Changed
                </h4>
                <p className="text-sm text-amber-700 mt-2 leading-relaxed">
                  You've changed your email or login name. Please re-authenticate with Discord for the new credentials.
                </p>
                <div className="mt-4 p-3 bg-amber-100 rounded-xl">
                  <p className="text-xs text-amber-800 font-medium">
                    Previously authenticated:<br />
                    <span className="font-normal">
                      {state.authenticatedCredentials?.email}<br />
                      {state.authenticatedCredentials?.loginName}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={revertToAuthenticatedCredentials}
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2.5 border border-amber-400 text-sm font-medium rounded-xl text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors touch-manipulation"
                >
                  ↶ Revert to authenticated credentials
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Discord OAuth Button - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_SYSTEM.duration.normal / 1000,
            delay: 0.3,
            ease: ANIMATION_SYSTEM.framerEasing.easeOut 
          }}
        >
          <motion.button
            type="button"
            onClick={handleDiscordOAuth}
            disabled={state.isLoading || !formData.email || !formData.loginName || (state.discordAuthenticated && !hasChangedFromAuthenticated)}
            className={`w-full flex items-center justify-center px-6 py-5 border border-transparent rounded-2xl shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation min-h-[4rem] text-lg ${
              state.discordAuthenticated && !hasChangedFromAuthenticated
                ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' 
                : hasChangedFromAuthenticated
                ? 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500'
                : 'bg-[#5865F2] text-white hover:bg-[#4752C4] focus:ring-[#5865F2]'
            }`}
            whileHover={!state.isLoading && formData.email && formData.loginName && !(state.discordAuthenticated && !hasChangedFromAuthenticated) ? { 
              scale: 1.02,
              boxShadow: state.discordAuthenticated && !hasChangedFromAuthenticated
                ? "0 10px 25px rgba(34, 197, 94, 0.3)" 
                : hasChangedFromAuthenticated
                ? "0 10px 25px rgba(217, 119, 6, 0.3)"
                : "0 10px 25px rgba(88, 101, 242, 0.3)"
            } : {}}
            whileTap={!state.isLoading && formData.email && formData.loginName && !(state.discordAuthenticated && !hasChangedFromAuthenticated) ? { 
              scale: 0.98,
              boxShadow: state.discordAuthenticated && !hasChangedFromAuthenticated
                ? "0 5px 15px rgba(34, 197, 94, 0.3)" 
                : hasChangedFromAuthenticated
                ? "0 5px 15px rgba(217, 119, 6, 0.3)"
                : "0 5px 15px rgba(88, 101, 242, 0.3)"
            } : {}}
          >
            {state.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Opening Discord...
              </>
            ) : state.discordAuthenticated && !hasChangedFromAuthenticated ? (
              <>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Discord Authenticated ✓
              </>
            ) : hasChangedFromAuthenticated ? (
              <>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Re-authenticate with Discord
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 mr-3" />
                Sign up with Discord
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Submit Button - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_SYSTEM.duration.normal / 1000,
            delay: 0.4,
            ease: ANIMATION_SYSTEM.framerEasing.easeOut 
          }}
        >
          <SubmitButton
            isLoading={state.isLoading}
            text={config.buttonText}
            loadingText={config.loadingText}
            disabled={!formData.email || !formData.loginName || !state.discordAuthenticated || !!hasChangedFromAuthenticated}
          />
        </motion.div>

        {/* Instructions - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_SYSTEM.duration.normal / 1000,
            delay: 0.5,
            ease: ANIMATION_SYSTEM.framerEasing.easeOut 
          }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-3 mt-auto"
        >
          <h4 className="font-semibold text-blue-900 text-base flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Quick Setup
          </h4>
          <div className="text-blue-800 text-sm space-y-2">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
              <span>Enter your 1337 student email (@student.1337.ma)</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
              <span>Add your 1337 login username</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
              <span>Connect with Discord to verify your 1337 membership</span>
            </div>
          </div>
          <div className="bg-blue-100 rounded-xl p-3 mt-3">
            <p className="text-xs text-blue-700 font-medium">
              📱 You'll be redirected to Discord for secure authentication
            </p>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
