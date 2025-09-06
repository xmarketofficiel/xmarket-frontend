"use client";

import { MessageCircle, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-white rounded-3xl p-12 shadow-lg">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-[#009F9C] to-[#007A77] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <MessageCircle className="w-12 h-12 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Messages Coming Soon!
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              We're working hard to bring you an amazing messaging experience. 
              Soon you'll be able to chat directly with buyers and sellers!
            </motion.p>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-[#009F9C]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <MessageCircle className="w-6 h-6 text-[#009F9C]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Chat</h3>
                <p className="text-gray-600 text-sm">
                  Instant messaging with buyers and sellers
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-[#009F9C]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-[#009F9C]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quick Replies</h3>
                <p className="text-gray-600 text-sm">
                  Pre-made responses for faster communication
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-[#009F9C]/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-[#009F9C]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Notifications</h3>
                <p className="text-gray-600 text-sm">
                  Never miss an important message
                </p>
              </div>
            </motion.div>

            {/* Current Alternative */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-[#009F9C]/10 to-[#007A77]/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                In the meantime...
              </h3>
              <p className="text-gray-600">
                Use the <strong>"I want this"</strong> feature on item listings to show interest, 
                and sellers will contact you directly via WhatsApp!
              </p>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all transform hover:scale-105"
              >
                Go Back
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}