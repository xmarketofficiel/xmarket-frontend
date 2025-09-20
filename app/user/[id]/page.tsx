"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, Sparkles, Construction } from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-gray-900">User Profile</h1>
      </div>

      {/* Coming Soon Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-[#009F9C] to-[#00C4A7] rounded-full flex items-center justify-center">
                <Construction size={40} className="text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <Sparkles size={16} className="text-yellow-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Coming Soon!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-600 mb-2 text-lg"
          >
            User Profile #{userId}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-gray-500 mb-8 leading-relaxed"
          >
            We're working hard to bring you an amazing user profile experience. 
            This feature will include user details, ratings, listings history, and more!
          </motion.p>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white rounded-xl border border-gray-200 p-6 mb-8 text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <User size={20} className="text-[#009F9C] mr-2" />
              What's Coming:
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#009F9C] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Complete user profile with photo and bio</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#009F9C] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>User ratings and reviews from other buyers/sellers</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#009F9C] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Complete listing history and statistics</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#009F9C] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Direct messaging and contact options</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-[#009F9C] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Trust indicators and verification badges</span>
              </li>
            </ul>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full"
          >
            <Clock size={16} className="text-yellow-600 mr-2" />
            <span className="text-yellow-800 text-sm font-medium">Under Development</span>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8"
          >
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-[#009F9C] text-white rounded-xl font-medium hover:bg-[#008A87] transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
