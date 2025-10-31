'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

/**
 * Reset Password Page - Create new password after OTP verification
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if no email or code
  useEffect(() => {
    if (!email || !code) {
      router.push('/forgot-password');
    }
  }, [email, code, router]);

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isValid = passwordStrength >= 4 && passwordsMatch;

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength === 3) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      setError('Please ensure your password meets all requirements and matches confirmation');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.resetPassword(email!, code!, newPassword);
      
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !code) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Password Reset Successful!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Your password has been updated successfully.
          </p>

          <div className="inline-block w-6 h-6 border-2 border-[#009F9C] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30 px-4 py-8 relative overflow-x-hidden">
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/forgot-password')}
          className="flex items-center text-gray-600 hover:text-[#009F9C] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Start Over
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Create New Password
          </h1>
          <p className="text-gray-600 text-lg">
            Choose a strong password to protect your account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-4 pr-12 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#009F9C]/20 focus:border-[#009F9C] transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength <= 2 ? 'text-red-500' : 
                      passwordStrength === 3 ? 'text-yellow-500' : 
                      'text-green-500'
                    }`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-4 pr-12 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#009F9C]/20 focus:border-[#009F9C] transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`mt-2 text-xs font-medium flex items-center ${
                  passwordsMatch ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Passwords don't match
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className={newPassword.length >= 8 ? 'text-green-600 font-medium' : ''}>
                  • At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600 font-medium' : ''}>
                  • One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600 font-medium' : ''}>
                  • One lowercase letter
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-600 font-medium' : ''}>
                  • One number
                </li>
                <li className={/[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-600 font-medium' : ''}>
                  • One special character
                </li>
              </ul>
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
              disabled={!isValid || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                isValid
                  ? "bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3 animate-spin" />
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
