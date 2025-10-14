'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
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
  
  // Use ref to track processed codes to avoid dependency issues
  const processedCodesRef = useRef(new Set<string>());
  
  const [formData, setFormData] = useState<SignupFormData>({
    step: 'email',
    userType: '1337',
    email: '',
    otp: '',
    firstName: '',
    lastName: '',
    department: '1337 School',
    role: 'student',
    address: '',
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
    discordUserData: null as any
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
    console.log('=== Mobile OAuth useEffect triggered ===');
    if (typeof window !== 'undefined') {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      console.log('URL params - code:', code, 'error:', error);
      
      if (code || error) {
        // Clean up URL immediately to prevent re-processing
        router.replace('/signup/1337-student', { scroll: false });
        
        // Process the OAuth result
        if (error) {
          console.log('OAuth error from URL params:', error);
          setState(prev => ({ 
            ...prev, 
            message: 'Discord authentication failed. Please try again.',
            messageType: 'error'
          }));
        } else if (code) {
          console.log('Processing code from URL params:', code);
          // Check if this code has already been processed
          if (processedCodesRef.current.has(code)) {
            console.log('Code already processed, skipping');
            return;
          }
          
          // Mark code as being processed
          processedCodesRef.current.add(code);
          
          setState(prev => ({ 
            ...prev, 
            isLoading: true, 
            message: 'Verifying Discord membership...'
          }));
          
          // Process Discord verification
          console.log('Calling handleDiscordVerification from mobile useEffect');
          handleDiscordVerification(code);
        }
      }
    }
  }, [searchParams, router]);

  const handleDiscordVerification = async (code: string) => {
    console.log('=== handleDiscordVerification called ===');
    console.log('Code:', code);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Already processed codes:', Array.from(processedCodesRef.current));
    
    try {
      const response = await api.auth.verifyDiscord1337({
        code
      });

      if (response.data.verified) {
        // Auto-fill email from Discord user data
        const discordEmail = response.data.user?.email || '';
        
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          discordAuthenticated: true,
          discordUserData: response.data.user,
          message: 'Discord authentication successful! 1337 server membership verified.',
          messageType: 'success'
        }));

        // Update form data with Discord info and move to details step
        const updatedFormData = {
          ...formData,
          email: discordEmail,
          department: '1337 School', // Auto-fill department
          step: 'details' as const,
          discordData: {
            discordUsername: response.data.user?.username || '',
            discordUserId: response.data.user?.id || '',
            avatarUrl: response.data.user?.avatar_url,
            isGuildMember: response.data.user?.is_guild_member || false,
            guildName: response.data.user?.guild_name
          }
        };
        
        setFormData(updatedFormData);
        setCurrentStep('details');
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          message: response.data.message || 'Verification failed',
          messageType: 'error'
        }));
      }
    } catch (error: any) {
      console.error('Discord verification error:', error);
      
      let errorMessage = 'Discord verification failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'You must be a member of the 1337 Discord server to register.';
      } else if (error.response?.status === 409) {
        errorMessage = 'This Discord account is already registered. Please log in instead.';
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
    console.log('=== Popup OAuth useEffect triggered ===');
    const handleDiscordMessage = async (event: MessageEvent) => {
      console.log('Message event received:', event.data);
      // Verify origin for security
      if (event.origin !== window.location.origin) return;
      
      const { type, code, error } = event.data;
      
      if (type === 'DISCORD_OAUTH_RESULT') {
        console.log('Discord OAuth result received via popup:', { code, error });
        if (error) {
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            message: 'Discord authentication failed. Please try again.',
            messageType: 'error'
          }));
          return;
        }
        
        if (code) {
          // Check if this code has already been processed
          if (processedCodesRef.current.has(code)) {
            console.log('Discord code already processed, ignoring duplicate');
            return;
          }

          console.log('Processing code from popup message:', code);
          // Mark code as being processed
          processedCodesRef.current.add(code);
          
          setState(prev => ({ 
            ...prev, 
            isLoading: true, 
            message: 'Verifying Discord membership...'
          }));
          
          // Use the same verification function
          console.log('Calling handleDiscordVerification from popup useEffect');
          handleDiscordVerification(code);
        }
      }
    };

    window.addEventListener('message', handleDiscordMessage);
    return () => window.removeEventListener('message', handleDiscordMessage);
  }, []);

  // Detect mobile device
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  };

  const handleDiscordOAuth = () => {
    // Set loading state for the OAuth process
    setState(prev => ({ ...prev, isLoading: true, message: 'Opening Discord authentication...' }));

    // Construct Discord OAuth URL
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?` +
      `client_id=${DISCORD_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(DISCORD_SCOPE)}`;

    if (isMobile()) {
      // Mobile: Use full-page redirect
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
      const response = await api.auth.completeRegistration({
        email: formData.email,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        department: formData.department || '1337 School',
        role: formData.role || 'student',
        address: formData.address || '',
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
      className="space-y-6 px-6 py-4 max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >
      {/* Message Display */}
      {state.message && (
        <MessageDisplay 
          message={state.message} 
          type={state.messageType} 
        />
      )}

      {/* Discord OAuth Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          delay: 0.2,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }}
        className="flex items-center justify-center"
      >
        <motion.button
          type="button"
          onClick={handleDiscordOAuth}
          disabled={state.isLoading}
          className={`w-full flex items-center justify-center px-6 py-6 border border-transparent rounded-2xl shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation min-h-[5rem] text-lg ${
            state.discordAuthenticated 
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' 
              : 'bg-[#5865F2] text-white hover:bg-[#4752C4] focus:ring-[#5865F2]'
          }`}
          whileHover={!state.isLoading ? { 
            scale: 1.02,
            boxShadow: state.discordAuthenticated
              ? "0 10px 25px rgba(34, 197, 94, 0.3)" 
              : "0 10px 25px rgba(88, 101, 242, 0.3)"
          } : {}}
          whileTap={!state.isLoading ? { 
            scale: 0.98,
            boxShadow: state.discordAuthenticated
              ? "0 5px 15px rgba(34, 197, 94, 0.3)" 
              : "0 5px 15px rgba(88, 101, 242, 0.3)"
          } : {}}
        >
          {state.isLoading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Verifying membership...
            </>
          ) : state.discordAuthenticated ? (
            <>
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified ✓ Complete Profile
            </>
          ) : (
            <>
              <MessageCircle className="w-6 h-6 mr-3" />
              Sign in with Discord
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          delay: 0.3,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-3"
      >
        <h4 className="font-semibold text-blue-900 text-base flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          How it works
        </h4>
        <div className="text-blue-800 text-sm space-y-2">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
            <span>Click "Sign in with Discord" to authenticate</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
            <span>We'll verify your 1337 Discord server membership</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
            <span>Complete your profile to finish registration</span>
          </div>
        </div>
        <div className="bg-blue-100 rounded-xl p-3 mt-3">
          <p className="text-xs text-blue-700 font-medium">
            🔒 Secure authentication via Discord OAuth
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
