'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/apiEndpoints';
import { useUser } from '../../contexts/UserContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShoppingBag,
  Sparkles,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Shield,
  Heart,
  ArrowLeft,
  UserPlus,
  Send
} from 'lucide-react';

interface SignupStep {
  step: 'email' | 'otp' | 'details' | 'complete' | 'request-access';
  email: string;
  otp: string;
  fullName: string;
  whatsappNumber: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [signupMode, setSignupMode] = useState<'signup' | 'request-access'>('signup');
  const [formData, setFormData] = useState<SignupStep>({
    step: 'email',
    email: '',
    otp: '',
    fullName: '',
    whatsappNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [requestAccessData, setRequestAccessData] = useState({
    fullName: '',
    email: '',
    whatsappNumber: '',
    reason: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  const { refreshUser } = useUser();

  // Floating elements animation
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number, size: number}>>([]);

  useEffect(() => {
    const elements = Array.from({length: 15}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 40 + 20
    }));
    setFloatingElements(elements);
  }, []);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(60);
    setCanResend(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Let backend handle all validation (university domains + approved join requests)
      const response = await api.auth.sendOtp(formData.email);
      setOtpSent(true);
      setFormData(prev => ({ ...prev, step: 'otp' }));
      setMessage('OTP sent to your email. Please check your inbox.');
      startResendTimer();
    } catch (error: any) {
      // Backend will return appropriate error message for unauthorized emails
      setMessage(error?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setMessage('');

    try {
      await api.auth.sendOtp(formData.email);
      setMessage('OTP resent to your email.');
      startResendTimer();
    } catch (error: any) {
      setMessage(error?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (formData.otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.auth.verifyOtp(formData.email, formData.otp);
      
      // Check if verification was successful
      if (response.data) {
        setFormData(prev => ({ ...prev, step: 'details' }));
        setMessage('Email verified! Please complete your profile.');
      } else {
        setMessage('OTP verification failed. Please try again.');
      }
    } catch (error: any) {
      // Handle different types of errors without console logging
      if (error.name === 'ValidationError' || error.status === 400) {
        setMessage('Invalid OTP. Please check and try again.');
      } else if (error.name === 'AuthenticationError' || error.status === 401) {
        setMessage('OTP has expired. Please request a new one.');
      } else {
        setMessage('Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate required fields
    if (!formData.fullName.trim()) {
      setMessage('Full name is required');
      setIsLoading(false);
      return;
    }

    if (!formData.whatsappNumber.trim()) {
      setMessage('WhatsApp number is required');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.auth.completeRegistration({
        email: formData.email,
        fullName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        password: formData.password
      });

      if (response.data) {
        await refreshUser();
        setFormData(prev => ({ ...prev, step: 'complete' }));
        setMessage('Account created successfully! Redirecting...');
        setTimeout(() => router.push('/marketplace'), 2000);
      }
    } catch (error: any) {
      setMessage(error?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validate required fields
    if (!requestAccessData.fullName.trim()) {
      setMessage('Full name is required');
      setIsLoading(false);
      return;
    }

    if (!requestAccessData.email.trim()) {
      setMessage('Email is required');
      setIsLoading(false);
      return;
    }

    if (!requestAccessData.whatsappNumber.trim()) {
      setMessage('WhatsApp number is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.joinRequests.create({
        fullName: requestAccessData.fullName,
        email: requestAccessData.email,
        whatsappNumber: requestAccessData.whatsappNumber,
      });

      if (response.data) {
        setFormData(prev => ({ ...prev, step: 'request-access' }));
        setMessage('Request submitted successfully!');
      }
    } catch (error: any) {
      if (error.status === 409) {
        setMessage('This email has already been used for a request.');
      } else {
        setMessage(error?.message || 'Failed to submit request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBackStep = () => {
    if (formData.step === 'otp') {
      setFormData(prev => ({ ...prev, step: 'email' }));
      setOtpSent(false);
    } else if (formData.step === 'details') {
      setFormData(prev => ({ ...prev, step: 'otp' }));
    }
    setMessage('');
  };

  const getStepInfo = () => {
    switch (formData.step) {
      case 'email':
        return { title: 'Create Account', subtitle: 'Enter your email to get started', progress: 25 };
      case 'otp':
        return { title: 'Verify Email', subtitle: 'Enter the 6-digit code sent to your email', progress: 50 };
      case 'details':
        return { title: 'Complete Profile', subtitle: 'Tell us a bit about yourself', progress: 75 };
      case 'complete':
        return { title: 'All Set!', subtitle: 'Welcome to XMarket', progress: 100 };
      case 'request-access':
        return { title: 'Request Submitted', subtitle: 'We will review your application soon', progress: 100 };
      default:
        return { title: 'Sign Up', subtitle: 'Join XMarket today', progress: 0 };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full opacity-10"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              background: `linear-gradient(135deg, #009F9C, #40E0D0)`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + element.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-[#009F9C]/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007B78] flex items-center justify-center p-12 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 right-20 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-24 h-24 border border-white rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-white rounded-full"></div>
            </div>
            
            <div className="relative z-10 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8">
                  <UserPlus className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-6">Join XMarket</h2>
                <p className="text-xl text-teal-100 mb-8 leading-relaxed">
                  Become part of the largest student marketplace. Buy, sell, and discover amazing services.
                </p>
                <div className="space-y-4 text-left max-w-sm mx-auto">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-cyan-300" />
                    <span className="text-teal-100">Secure & verified platform</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-cyan-300" />
                    <span className="text-teal-100">Connect with fellow students</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6 text-cyan-300" />
                    <span className="text-teal-100">Smart matching system</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            {/* Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 relative">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">Step {formData.step === 'email' ? 1 : formData.step === 'otp' ? 2 : formData.step === 'details' ? 3 : 4} of 4</div>
                  <div className="text-sm font-medium text-[#009F9C]">{stepInfo.progress}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-[#009F9C] to-[#40E0D0] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stepInfo.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009F9C] to-[#40E0D0] rounded-2xl mb-6 shadow-lg">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{stepInfo.title}</h1>
                <p className="text-gray-600">{stepInfo.subtitle}</p>
              </motion.div>

              {/* Mode Toggle */}
              {formData.step !== 'complete' && formData.step !== 'request-access' && (
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setSignupMode('signup')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        signupMode === 'signup'
                          ? 'bg-white text-[#009F9C] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupMode('request-access')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        signupMode === 'request-access'
                          ? 'bg-white text-[#009F9C] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Request Access
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Message Display */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex items-center space-x-2 p-4 rounded-lg mb-6 ${
                      message.includes('successful') || message.includes('verified') || message.includes('sent')
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {message.includes('successful') || message.includes('verified') || message.includes('sent') ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Signup Flow */}
              {signupMode === 'signup' && (
                <>
                  {/* Email Step */}
                  {formData.step === 'email' && (
                <motion.form
                  onSubmit={handleSendOtp}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <motion.div
                      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                        focusedField === 'email' 
                          ? 'ring-2 ring-[#009F9C] ring-opacity-50' 
                          : ''
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-4 focus-within:border-[#009F9C] focus-within:bg-white transition-all duration-300">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter your email address"
                          className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                          required
                        />
                      </div>
                    </motion.div>
                    <p className="text-xs text-gray-500 mt-2">Use university email (@um6p.ma or @emines.um6p.ma) or get approval through join request</p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-[#009F9C] to-[#40E0D0] p-4 text-white font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#007B78] to-[#009F9C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send Verification Code
                          <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </motion.form>
              )}

              {/* OTP Step */}
              {formData.step === 'otp' && (
                <motion.form
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code *
                    </label>
                    <motion.div
                      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                        focusedField === 'otp' 
                          ? 'ring-2 ring-[#009F9C] ring-opacity-50' 
                          : ''
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-4 focus-within:border-[#009F9C] focus-within:bg-white transition-all duration-300">
                        <Shield className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                          type="text"
                          id="otp"
                          value={formData.otp}
                          onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                          onFocus={() => setFocusedField('otp')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter 6-digit code"
                          className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-center text-2xl tracking-widest"
                          maxLength={6}
                          required
                        />
                      </div>
                    </motion.div>
                    <p className="text-xs text-gray-500 mt-2">Check your email for the verification code</p>
                    
                    {/* Resend OTP Section */}
                    <div className="mt-4 text-center">
                      {resendTimer > 0 ? (
                        <p className="text-sm text-gray-500">
                          Resend code in <span className="font-semibold text-[#009F9C]">{resendTimer}s</span>
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Didn't receive the code?</p>
                          <div className="flex flex-col space-y-2">
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={!canResend || isLoading}
                              className="text-[#009F9C] font-medium hover:text-[#007A77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Resend Code
                            </button>
                            <p className="text-xs text-gray-500">
                              💡 <strong>Tip:</strong> Check your spam/junk folder if you don't see the email
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      type="button"
                      onClick={goBackStep}
                      className="flex-1 border-2 border-gray-300 text-gray-700 p-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2 inline" />
                      Back
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading || formData.otp.length !== 6}
                      className="flex-1 relative overflow-hidden rounded-xl bg-gradient-to-r from-[#009F9C] to-[#40E0D0] p-4 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#007B78] to-[#009F9C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* Details Step */}
              {formData.step === 'details' && (
                <motion.form
                  onSubmit={handleCompleteSignup}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="relative">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <motion.div
                        className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                          focusedField === 'fullName' 
                            ? 'ring-2 ring-[#009F9C] ring-opacity-50' 
                            : ''
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-4 focus-within:border-[#009F9C] focus-within:bg-white transition-all duration-300">
                          <User className="w-5 h-5 text-gray-400 mr-3" />
                          <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            onFocus={() => setFocusedField('fullName')}
                            onBlur={() => setFocusedField('')}
                            placeholder="Enter your full name"
                            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                            required
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* WhatsApp Number */}
                    <div className="relative">
                      <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp Number *
                      </label>
                      <motion.div
                        className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                          focusedField === 'whatsappNumber' 
                            ? 'ring-2 ring-[#009F9C] ring-opacity-50' 
                            : ''
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-4 focus-within:border-[#009F9C] focus-within:bg-white transition-all duration-300">
                          <Phone className="w-5 h-5 text-gray-400 mr-3" />
                          <input
                            type="tel"
                            id="whatsappNumber"
                            value={formData.whatsappNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                            onFocus={() => setFocusedField('whatsappNumber')}
                            onBlur={() => setFocusedField('')}
                            placeholder="+212 6XX XXX XXX"
                            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                            required
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Password */}
                    <div className="relative">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <motion.div
                        className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                          focusedField === 'password' 
                            ? 'ring-2 ring-[#009F9C] ring-opacity-50' 
                            : ''
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-4 focus-within:border-[#009F9C] focus-within:bg-white transition-all duration-300">
                          <Lock className="w-5 h-5 text-gray-400 mr-3" />
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField('')}
                            placeholder="Create a password"
                            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-3 text-gray-400 hover:text-[#009F9C] transition-colors p-1"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <motion.div
                        className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                          focusedField === 'confirmPassword' 
                            ? 'ring-2 ring-[#009F9C] ring-opacity-50' 
                            : ''
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-4 focus-within:border-[#009F9C] focus-within:bg-white transition-all duration-300">
                          <Lock className="w-5 h-5 text-gray-400 mr-3" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField('')}
                            placeholder="Confirm your password"
                            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="ml-3 text-gray-400 hover:text-[#009F9C] transition-colors p-1"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      type="button"
                      onClick={goBackStep}
                      className="flex-1 border-2 border-gray-300 text-gray-700 p-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2 inline" />
                      Back
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 relative overflow-hidden rounded-xl bg-gradient-to-r from-[#009F9C] to-[#40E0D0] p-4 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#007B78] to-[#009F9C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* Complete Step */}
              {formData.step === 'complete' && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to XMarket!</h3>
                  <p className="text-gray-600 mb-8">
                    Your account has been created successfully. You're now part of the campus marketplace community.
                  </p>
                  <motion.div
                    className="flex items-center justify-center space-x-2 text-[#009F9C] font-medium"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Redirecting to marketplace...</span>
                  </motion.div>
                </motion.div>
              )}
                </>
              )}

              {/* Request Access Flow */}
              {signupMode === 'request-access' && formData.step !== 'request-access' && (
                <motion.form
                  onSubmit={handleRequestAccess}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Access to XMarket</h3>
                    <p className="text-sm text-gray-600">
                      Fill out the form below and we'll review your request within 2-3 business days.
                    </p>
                  </div>

                  <div className="relative">
                    <label htmlFor="requestFullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="requestFullName"
                        type="text"
                        value={requestAccessData.fullName}
                        onChange={(e) => setRequestAccessData({...requestAccessData, fullName: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="requestEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="requestEmail"
                        type="email"
                        value={requestAccessData.email}
                        onChange={(e) => setRequestAccessData({...requestAccessData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="requestWhatsApp" className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="requestWhatsApp"
                        type="tel"
                        value={requestAccessData.whatsappNumber}
                        onChange={(e) => setRequestAccessData({...requestAccessData, whatsappNumber: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#009F9C] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter your WhatsApp number"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#009F9C] to-[#40E0D0] text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* Request Access Success */}
              {formData.step === 'request-access' && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for your interest in XMarket! We've received your request and will review it within 2-3 business days. 
                    You'll receive an email notification once we've made a decision.
                  </p>
                  <motion.div
                    className="flex items-center justify-center space-x-2 text-[#009F9C] font-medium"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mail className="w-5 h-5" />
                    <span>Check your email for updates...</span>
                  </motion.div>
                  
                  <motion.div className="mt-8">
                    <Link href="/landing">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Back to Homepage
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>
              )}

              {/* Footer Links */}
              {formData.step !== 'complete' && formData.step !== 'request-access' && (
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <p className="text-gray-600 mb-4">Already have an account?</p>
                  <Link href="/login">
                    <motion.div
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#009F9C] text-[#009F9C] rounded-xl font-semibold hover:bg-[#009F9C] hover:text-white transition-all duration-300 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Sign In Instead
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
