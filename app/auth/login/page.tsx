"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ANIMATION_SYSTEM } from "../../../lib/design-system";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get('type') || 'student';
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Using HTTP-only cookies now, no need for localStorage
        router.push('/marketplace');
      } else {
        // Enhanced error handling for suspension
        let errorMessage = data.message || "Login failed";
        
        // Check for specific suspension/ban messages
        if (errorMessage.includes('suspended')) {
          errorMessage = "Your account has been suspended by the admin. Please contact support for assistance.";
        } else if (errorMessage.includes('banned')) {
          errorMessage = "Your account has been banned. Please contact support for assistance.";
        } else if (errorMessage.includes('verify your email')) {
          errorMessage = "Please verify your email address before logging in.";
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006666]/5 via-white to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-[#006666] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">X</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">XMarket</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in as UM6P {userType === 'student' ? 'Student' : 'Staff Member'}
          </p>
        </div>

        {/* Login Form */}
        <div className="design-card bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow"
             style={{ 
               transitionDuration: ANIMATION_SYSTEM.duration.slow + 'ms',
               transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
             }}>
          {error && (
            <div className="design-card mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'student' ? 'Student Email' : 'Staff Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666] focus:border-transparent transition-all"
                style={{ 
                  transitionDuration: ANIMATION_SYSTEM.duration.normal + 'ms',
                  transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                }}
                placeholder={userType === 'student' ? 'your.name@student.um6p.ma' : 'your.name@um6p.ma'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006666] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#006666] focus:ring-[#006666] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-[#006666] hover:text-[#005555]">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006666] text-white py-3 px-4 rounded-lg hover:bg-[#005555] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href={`/auth/register?type=${userType}`}
                className="font-medium text-[#006666] hover:text-[#005555]"
              >
                Register here
              </Link>
            </p>
          </div>

          {/* University Verification Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-lg">🎓</div>
              <div>
                <p className="text-sm text-blue-800">
                  <strong>UM6P Verification:</strong> Only verified university email addresses can access XMarket. 
                  {userType === 'student' 
                    ? ' Use your @student.um6p.ma email address.' 
                    : ' Use your @um6p.ma email address.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/landing"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-1"
          >
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
