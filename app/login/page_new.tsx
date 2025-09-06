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
      console.debug('Login attempt failed:', error?.message);
      
      if (error?.message?.includes('Invalid email format')) {
        setMessage('Please enter a valid email address.');
      } else if (error?.message?.includes('User not found') || error?.message?.includes('Invalid credentials')) {
        setMessage('Invalid email or password. Please try again.');
      } else if (error?.message?.includes('Network Error') || error?.message?.includes('fetch')) {
        setMessage('Unable to connect to server. Please check your connection and try again.');
      } else {
        setMessage('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
