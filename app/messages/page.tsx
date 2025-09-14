"use client";

import { 
  MessageCircle, 
  Clock, 
  Zap, 
  Shield, 
  Image as ImageIcon, 
  Star,
  Users,
  Bell,
  Camera,
  Send,
  Heart,
  CheckCircle,
  Smartphone,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MessagesPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Cycle through features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Instant messaging with secure end-to-end encryption",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      preview: "💬 Hey! Is this item still available?"
    },
    {
      icon: Zap,
      title: "Quick Replies",
      description: "Smart suggestions and pre-made responses",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      preview: "⚡ Yes, it's available! When can you pick it up?"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Never miss important messages or offers",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      preview: "🔔 New message from Sarah about iPhone 13"
    }
  ];

  const additionalFeatures = [
    { icon: Shield, title: "Secure & Safe", description: "All messages are encrypted and monitored for safety" },
    { icon: ImageIcon, title: "Photo Sharing", description: "Share additional photos and item details easily" },
    { icon: Star, title: "Seller Ratings", description: "Rate your communication experience with sellers" },
    { icon: Users, title: "Group Offers", description: "Make group purchases with friends and family" },
    { icon: Camera, title: "Live Photos", description: "Request live photos to verify item condition" },
    { icon: CheckCircle, title: "Read Receipts", description: "Know when your messages have been seen" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-[#009F9C]/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Marketplace</span>
          </motion.button>

          {/* Main Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/20">
              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative mb-8"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-[#009F9C] to-[#007A77] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <MessageCircle className="w-16 h-16 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>

              {/* Title with gradient text */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#009F9C] to-[#007A77] bg-clip-text text-transparent mb-6"
              >
                Messages Coming Soon!
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                We're crafting an extraordinary messaging experience that will revolutionize how buyers and sellers connect. 
                <span className="block mt-2 text-[#009F9C] font-medium">Get ready for something amazing!</span>
              </motion.p>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="max-w-md mx-auto mb-8"
              >
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Development Progress</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#009F9C] to-[#007A77] rounded-full relative"
                  >
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Core Features with Live Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
              What to Expect
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Features List */}
              <div className="space-y-6">
                {features.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  const isActive = currentFeature === index;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                        isActive 
                          ? 'border-[#009F9C] bg-white shadow-lg scale-105' 
                          : 'border-gray-200 bg-white/50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                          isActive ? feature.bgColor : 'bg-gray-100'
                        }`}>
                          <FeatureIcon className={`w-7 h-7 transition-all duration-500 ${
                            isActive ? 'text-[#009F9C]' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-xl font-semibold mb-2 transition-all duration-500 ${
                            isActive ? 'text-[#009F9C]' : 'text-gray-900'
                          }`}>
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -right-2 -top-2"
                        >
                          <div className="w-6 h-6 bg-[#009F9C] rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Live Preview */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-200"
                >
                  {/* Phone Frame */}
                  <div className="bg-gray-900 rounded-3xl p-2 shadow-inner">
                    <div className="bg-white rounded-2xl overflow-hidden">
                      {/* Phone Header */}
                      <div className="bg-[#009F9C] px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">Messages</h4>
                          <p className="text-white/80 text-xs">Coming Soon</p>
                        </div>
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Chat Preview */}
                      <div className="p-4 h-64 flex flex-col justify-end space-y-3">
                        <motion.div
                          key={`preview-${currentFeature}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          {/* Incoming message */}
                          <div className="flex items-end gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                              <p className="text-sm text-gray-900">{features[currentFeature].preview}</p>
                            </div>
                          </div>
                          
                          {/* Typing indicator */}
                          <div className="flex items-center gap-2 ml-10">
                            <div className="bg-gray-100 rounded-2xl px-4 py-2">
                              <div className="flex space-x-1">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                  className="w-2 h-2 bg-gray-400 rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Input area */}
                        <div className="border-t border-gray-200 pt-3 mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                              <p className="text-sm text-gray-400">Type a message...</p>
                            </div>
                            <div className="w-8 h-8 bg-[#009F9C] rounded-full flex items-center justify-center">
                              <Send className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Star className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Heart className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Additional Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mb-16"
          >
            <h3 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8">
              Even More Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#009F9C]/10 to-[#007A77]/10 rounded-xl flex items-center justify-center mb-4">
                      <FeatureIcon className="w-6 h-6 text-[#009F9C]" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Current Alternative */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-[#009F9C]/10 via-blue-50 to-[#007A77]/10 rounded-3xl p-8 lg:p-12 mb-12 border border-[#009F9C]/20"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-br from-[#009F9C] to-[#007A77] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Smartphone className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                In the meantime...
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                Use the <span className="font-semibold text-[#009F9C]">"I want this"</span> feature on item listings to show interest, 
                and sellers will contact you directly via WhatsApp for instant communication!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/marketplace')}
                  className="px-8 py-4 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Marketplace
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/add-item')}
                  className="px-8 py-4 bg-white text-[#009F9C] border-2 border-[#009F9C] rounded-xl font-semibold hover:bg-[#009F9C] hover:text-white transition-all"
                >
                  Sell Something
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/20 text-center"
          >
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Be the First to Know!
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get notified when messaging goes live and be among the first to experience the future of marketplace communication.
            </p>
            
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#009F9C] focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Notify Me
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}