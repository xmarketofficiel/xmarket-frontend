'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';

/**
 * Email Verification Page - Clear verification status and resend options
 * Features verification status display, resend functionality, and clear messaging
 */
export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | 'expired'>('pending');
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const token = searchParams?.get('token');
  const emailParam = searchParams?.get('email');

  useEffect(() => {
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    if (token) {
      // Auto-verify if token is present
      verifyEmail(token);
    }
  }, [token, emailParam]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add actual email verification logic here
      
      // Simulate different outcomes
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setVerificationStatus('success');
        setMessage('Your email has been successfully verified!');
      } else {
        setVerificationStatus('expired');
        setMessage('This verification link has expired. Please request a new one.');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Failed to verify email. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address to resend verification.');
      return;
    }

    setIsResending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add actual resend verification logic here
      
      setMessage('New verification email sent! Check your inbox.');
      setResendTimer(60); // 60 seconds cooldown
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      case 'pending':
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-12 h-12 text-[#009F9C]" />
          </motion.div>
        );
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success':
        return 'from-green-500 to-green-600';
      case 'error':
      case 'expired':
        return 'from-red-500 to-red-600';
      case 'pending':
      default:
        return 'from-[#009F9C] to-[#007B78]';
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Email Verified! ✅';
      case 'error':
        return 'Verification Failed ❌';
      case 'expired':
        return 'Link Expired 🕒';
      case 'pending':
      default:
        return 'Verifying Email... ⏳';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#009F9C]/20 to-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${getStatusColor()} rounded-full mb-6 shadow-lg`}
          >
            {getStatusIcon()}
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {getStatusTitle()}
          </h1>
          
          {email && (
            <p className="text-gray-600 text-lg">
              {email}
            </p>
          )}
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 mb-6"
        >
          {/* Status Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={`p-4 rounded-xl mb-6 ${
                verificationStatus === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : verificationStatus === 'error' || verificationStatus === 'expired'
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
              }`}
            >
              <p className="font-medium">{message}</p>
            </motion.div>
          )}

          {/* Actions based on status */}
          {verificationStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue to Login
              </motion.button>
            </motion.div>
          )}

          {(verificationStatus === 'error' || verificationStatus === 'expired') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              {/* Email input for resend */}
              <div>
                <label htmlFor="resend-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resend-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@university.edu"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#009F9C]/20 focus:border-[#009F9C] transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70"
                />
              </div>

              {/* Resend Button */}
              <motion.button
                whileHover={{ scale: email && resendTimer === 0 ? 1.02 : 1 }}
                whileTap={{ scale: email && resendTimer === 0 ? 0.98 : 1 }}
                onClick={handleResendVerification}
                disabled={!email || isResending || resendTimer > 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                  email && resendTimer === 0
                    ? "bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isResending ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Sending...
                  </div>
                ) : resendTimer > 0 ? (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Resend in {resendTimer}s
                  </div>
                ) : (
                  <div className="flex items-center">
                    Resend Verification
                    <Mail className="w-5 h-5 ml-2" />
                  </div>
                )}
              </motion.button>
            </motion.div>
          )}

          {verificationStatus === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Verifying your email...
                </h3>
                <p className="text-blue-700 text-sm">
                  This may take a few moments. Please wait.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center space-y-4"
        >
          <button
            onClick={() => router.push('/login')}
            className="text-[#009F9C] hover:text-[#007B78] font-medium transition-colors"
          >
            Back to Login
          </button>
          
          <p className="text-gray-500 text-sm">
            Need help? Contact our{" "}
            <button className="text-[#009F9C] hover:underline">
              support team
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}