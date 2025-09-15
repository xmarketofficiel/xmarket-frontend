"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function JoinRequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    affiliation: "",
    reason: "",
    additionalInfo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/join-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          affiliation: "",
          reason: "",
          additionalInfo: ""
        });
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center max-w-lg w-full shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-4xl">✅</span>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Request Submitted!
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for your interest in XMarket! We've received your join request and will review it within 2-3 business days. 
            You'll receive an email notification once we've made a decision.
          </p>
          
          <div className="space-y-4">
            <Link href="/landing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Back to Homepage
              </motion.button>
            </Link>
            
            <p className="text-sm text-gray-500">
              Questions? Email us at <a href="mailto:support@xmarket.um6p.ma" className="text-purple-600 hover:underline">support@xmarket.um6p.ma</a>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">XMarket</span>
                <div className="text-xs text-purple-300 font-semibold -mt-1">
                  UM6P EXCLUSIVE
                </div>
              </div>
            </Link>
            
            <Link href="/landing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-purple-200 hover:text-white transition-colors"
              >
                ← Back to Home
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="sticky top-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Join Our
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Community
                </span>
              </h1>
              
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                XMarket is exclusively for the UM6P community. If you're not currently a student or staff member but would like to join, tell us about yourself!
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-purple-300">📋</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Quick Review</h3>
                    <p className="text-purple-200 text-sm">We review all requests within 2-3 business days</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-purple-300">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Privacy First</h3>
                    <p className="text-purple-200 text-sm">Your information is secure and only used for verification</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                    <span className="text-purple-300">📧</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email Updates</h3>
                    <p className="text-purple-200 text-sm">Get notified about your application status</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Request Access
                </h2>
                <p className="text-purple-200">
                  Fill out the form below and we'll get back to you soon.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-2">
                    Current Affiliation *
                  </label>
                  <select
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  >
                    <option value="" className="bg-gray-800">Select your affiliation</option>
                    <option value="prospective-student" className="bg-gray-800">Prospective UM6P Student</option>
                    <option value="alumni" className="bg-gray-800">UM6P Alumni</option>
                    <option value="partner-university" className="bg-gray-800">Partner University</option>
                    <option value="local-community" className="bg-gray-800">Local Community Member</option>
                    <option value="business-partner" className="bg-gray-800">Business Partner</option>
                    <option value="other" className="bg-gray-800">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-2">
                    Why would you like to join XMarket? *
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your connection to UM6P and why you'd like access to our marketplace..."
                  />
                </div>

                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                    placeholder="Any additional details you'd like us to know..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                    isSubmitting 
                      ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
                      : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:shadow-xl hover:shadow-purple-500/25"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 bg-white/30 rounded animate-pulse mr-3" />
                      <div className="h-4 w-20 bg-white/20 rounded animate-pulse" />
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </motion.button>

                <p className="text-center text-purple-300 text-sm">
                  By submitting this form, you agree to our{" "}
                  <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>
                  {" "}and{" "}
                  <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>
    </div>
  );
}
