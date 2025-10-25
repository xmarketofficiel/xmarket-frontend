'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Forgot Password Page - Streamlined password recovery flow
 * Features email submission and confirmation with clear UX
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add actual password reset logic here
      
      setIsEmailSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return <EmailSentConfirmation email={email} onBack={() => setIsEmailSent(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30 px-4 relative overflow-x-hidden">
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
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => router.push('/login')}
          className="flex items-center text-gray-600 hover:text-[#009F9C] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Login
        </motion.button>

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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#009F9C] to-[#007B78] rounded-2xl mb-6 shadow-lg"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Forgot Password? 🔐
          </h1>
          <p className="text-gray-600 text-lg">
            No worries! We'll send you reset instructions.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                University Email Address
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@university.edu"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#009F9C]/20 focus:border-[#009F9C] transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: email ? 1.02 : 1 }}
              whileTap={{ scale: email ? 0.98 : 1 }}
              type="submit"
              disabled={!email || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                email
                  ? "bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  Sending Reset Link...
                </div>
              ) : (
                <>
                  Send Reset Link
                  <Mail className="w-5 h-5 ml-2" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <button
                onClick={() => router.push('/login')}
                className="text-[#009F9C] hover:text-[#007B78] font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Email Sent Confirmation Component
 */
interface EmailSentConfirmationProps {
  email: string;
  onBack: () => void;
}

function EmailSentConfirmation({ email, onBack }: EmailSentConfirmationProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30 px-4 relative overflow-x-hidden">
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
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Check Your Email! 📬
          </h1>
          
          <p className="text-gray-600 text-lg mb-2">
            We've sent password reset instructions to:
          </p>
          
          <p className="text-[#009F9C] font-bold text-lg mb-8">
            {email}
          </p>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Next Steps:</h3>
            <ul className="text-left space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#009F9C] mr-2">1.</span>
                Check your email inbox and spam folder
              </li>
              <li className="flex items-start">
                <span className="text-[#009F9C] mr-2">2.</span>
                Click the reset link in the email
              </li>
              <li className="flex items-start">
                <span className="text-[#009F9C] mr-2">3.</span>
                Create a new strong password
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Back to Login
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="w-full bg-white/80 text-[#009F9C] border-2 border-[#009F9C]/30 py-3 rounded-xl font-semibold hover:bg-[#009F9C]/5 transition-all duration-300"
            >
              Try Different Email
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}