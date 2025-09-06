'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/apiEndpoints';
import { useUser } from '../../contexts/UserContext';
import { ApiErrorBoundary } from '../../components/ApiErrorBoundary';
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
  Heart,
  Shield
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const router = useRouter();
  const { refreshUser } = useUser();

  // Floating elements animation
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number, size: number}>>([]);

  useEffect(() => {
    const elements = Array.from({length: 12}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 40 + 20
    }));
    setFloatingElements(elements);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.auth.login({ email, password });
      console.log('Login response:', response);
      
      if (response.data) {
        await refreshUser();
        setMessage('Login successful! Redirecting...');
        setTimeout(() => router.push('/'), 1000);
      }
    } catch (error: any) {
      // Prevent error from bubbling to error boundary
      console.debug('Login attempt failed:', error?.message);
      
      // Handle different error types with user-friendly messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (error?.name === 'AuthenticationError' || error?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error?.message && error.message.toLowerCase().includes('invalid credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error?.status === 500 || error?.name === 'ServerError') {
        errorMessage = 'Server error. Please try again later.';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection.';
      } else if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestAccount = async () => {
    setIsLoading(true);
    setMessage('✅ Test account ready! Use the credentials below to login, or create your own account with the "Create New Account" button.');
    setIsLoading(false);
  };

  return (
    <ApiErrorBoundary>
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
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-[#009F9C]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#009F9C] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#40E0D0] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#FF6B35] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007B78] flex items-center justify-center p-12 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rounded-full"></div>
              </div>
              
              <div className="relative z-10 text-center text-white">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8">
                    <ShoppingBag className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold mb-6">Welcome to XMarket</h2>
                  <p className="text-xl text-teal-100 mb-8 leading-relaxed">
                    Your trusted campus marketplace connecting students for secure trading and services.
                  </p>
                  <div className="space-y-4 text-left max-w-sm mx-auto">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-cyan-300" />
                      <span className="text-teal-100">University verified community</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="w-6 h-6 text-cyan-300" />
                      <span className="text-teal-100">Trusted by thousands of students</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-6 h-6 text-cyan-300" />
                      <span className="text-teal-100">Smart interest matching</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md w-full"
            >
              {/* Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 relative">
                {/* Header */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009F9C] to-[#40E0D0] rounded-2xl mb-6 shadow-lg">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
                  <p className="text-gray-600">Welcome back to your campus marketplace</p>
                </motion.div>

                {/* Form */}
                <motion.form
                  onSubmit={handleLogin}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {/* Email Input */}
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter your email address"
                          className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                          required
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField('')}
                          placeholder="Enter your password"
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

                  {/* Message Display */}
                  <AnimatePresence>
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex items-center space-x-2 p-4 rounded-lg ${
                          message.includes('successful') 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {message.includes('successful') ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">{message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Button */}
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
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </motion.form>

                {/* Footer Links */}
                <motion.div
                  className="mt-8 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {/* Create Account Link */}
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Don't have an account?</p>
                    <Link href="/signup">
                      <motion.div
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#009F9C] text-[#009F9C] rounded-xl font-semibold hover:bg-[#009F9C] hover:text-white transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <User className="w-5 h-5 mr-2" />
                        Create New Account
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </Link>
                  </div>

                  {/* Test Account Info */}
                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Test Account</h4>
                        <p className="text-xs text-gray-600 mb-2">Pre-filled credentials for testing:</p>
                        <div className="text-xs text-gray-700 space-y-1">
                          <div><strong>Email:</strong> test@example.com</div>
                          <div><strong>Password:</strong> password123</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ApiErrorBoundary>
  );
}
                    </div>
                  </motion.button>
                </motion.form>

                {/* Quick Access Section */}
                <motion.div
                  className="mt-8 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {/* Test Account Info */}
                  <button
                    onClick={createTestAccount}
                    disabled={isLoading}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">Quick Test Access</p>
                        <p className="text-gray-400 text-sm">Click to learn about demo credentials</p>
                      </div>
                      <svg className="ml-auto w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Create Account */}
                  <Link href="/signup" className="block">
                    <motion.div
                      className="w-full p-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] transition-all duration-300 text-center group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className="text-white font-semibold">Create New Account</span>
                        <svg className="ml-2 w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>

                {/* Message Display */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`mt-6 p-4 rounded-xl backdrop-blur-lg border ${
                        message.includes('successful') || message.includes('✅') 
                          ? 'bg-green-500/20 border-green-400/30 text-green-100' 
                          : message.includes('Invalid email') || message.includes('Login failed')
                            ? 'bg-red-500/20 border-red-400/30 text-red-100'
                            : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {message.includes('successful') || message.includes('✅') ? (
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : message.includes('Invalid email') || message.includes('Login failed') ? (
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed">{message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Links */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm">
                      Demo: test@example.com / password123
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <Link href="/landing" className="text-gray-400 hover:text-[#40E0D0] transition-colors">
                        ← Back to Home
                      </Link>
                      <span className="text-gray-600">•</span>
                      <Link href="/signup" className="text-gray-400 hover:text-[#40E0D0] transition-colors">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ApiErrorBoundary>
  );
}
