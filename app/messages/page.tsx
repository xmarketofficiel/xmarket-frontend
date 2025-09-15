"use client";

import { MessageCircle, Users, Clock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center flex-shrink-0 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors mr-3"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center min-h-full px-4 py-8">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-24 h-24 bg-[#009F9C] rounded-xl flex items-center justify-center mb-6 mx-auto">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Messages Coming Soon
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              We're building a secure messaging system to help you connect with buyers and sellers safely. Stay tuned for updates!
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <MessageCircle className="w-4 h-4 mr-2 text-[#009F9C]" />
                <span>Real-time chat</span>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-[#009F9C]" />
                <span>Group conversations</span>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-[#009F9C]" />
                <span>Message history</span>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.push('/')}
              className="w-full bg-[#009F9C] hover:bg-[#007A77] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}