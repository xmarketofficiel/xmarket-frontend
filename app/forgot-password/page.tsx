'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

/**
 * Forgot Password Page - Streamlined password recovery flow
 * Features email submission and confirmation with clear UX
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.forgotPassword(email);
      
      if (response.status === 201 || response.status === 200) {
        // Redirect to OTP verification page with email
        router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
      } else {
        setError(response.message || 'Failed to send reset email. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30 px-4 py-8 relative overflow-x-hidden">
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/login')}
          className="flex items-center text-gray-600 hover:text-[#009F9C] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Login
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-lg">
            No worries! We'll send you reset instructions.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                University Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#009F9C]/20 focus:border-[#009F9C] transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3 animate-spin" />
                  Sending OTP Code...
                </div>
              ) : (
                "Send OTP Code"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6"
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
          </div>
        </div>
      </div>
    </div>
  );
}