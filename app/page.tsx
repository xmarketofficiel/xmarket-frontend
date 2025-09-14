"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Shield, TrendingUp, Heart } from "lucide-react";

// Import the actual marketplace page component
import MarketplacePage from "./marketplace/page";

const BRAND_COLOR = '#009F9C';

/**
 * HomePage - Smart content display based on authentication
 * Shows landing page for guests, actual marketplace for authenticated users
 * NO REDIRECTS - everything happens on the same "/" path
 */
export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useUser();

  // Show loading state while determining auth status
  if (loading) {
    return <LoadingScreen />;
  }

  // Show actual marketplace content for authenticated users (NO REDIRECT)
  if (user) {
    return <MarketplacePage />;
  }

  // Show landing page content for non-authenticated users (NO REDIRECT)
  return <LandingPageContent />;

}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#009F9C]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [180, 0, 180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <LoadingSpinner />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 font-medium mt-6"
          >
            Setting up your XMarket experience...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Landing Page Content - Full landing experience for non-authenticated users
 */
function LandingPageContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#009F9C]/30 to-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [180, 540],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/20 to-[#009F9C]/30 rounded-full blur-3xl"
          />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
              className={`absolute w-2 h-2 bg-[#009F9C]/40 rounded-full`}
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + i * 8}%`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Enhanced Hero Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-8 py-4 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-[#009F9C] text-base font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
              🎓 Built for Students, By Students
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="ml-3"
              >
                ✨
              </motion.div>
            </span>
          </motion.div>

          {/* Enhanced Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight"
          >
            Your Campus
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="block bg-gradient-to-r from-[#009F9C] via-[#00B8B5] to-[#007B78] bg-clip-text text-transparent"
            >
              Marketplace
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="block text-5xl md:text-6xl mt-4 text-gray-700"
            >
              Revolution 🚀
            </motion.span>
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Transform how you buy, sell, and connect within your university community. 
            <span className="text-[#009F9C] font-bold">Join thousands of students</span> already saving money and making friends!
          </motion.p>

          {/* Enhanced Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mb-16"
          >
            {[
              { icon: Users, text: "10K+ Students", color: "text-blue-600" },
              { icon: Shield, text: "100% Secure", color: "text-green-600" },
              { icon: TrendingUp, text: "Save 60%", color: "text-purple-600" },
              { icon: Heart, text: "Loved by All", color: "text-red-500" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <item.icon className={`w-6 h-6 mr-3 ${item.color}`} />
                <span className="font-bold text-gray-800">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/signup')}
              className="group bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center"
            >
              Start Your Journey
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-3"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/login')}
              className="group bg-white/80 backdrop-blur-sm text-[#009F9C] border-2 border-[#009F9C]/30 px-10 py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#009F9C]/5"
            >
              I'm Already In! 🎉
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 text-sm text-gray-500"
          >
            <p className="mb-4 font-medium">Trusted by students at:</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {["🏛️ Harvard", "🎓 MIT", "📚 Stanford", "🔬 Berkeley", "🎨 NYU"].map((uni, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="font-semibold hover:text-[#009F9C] transition-all duration-300 cursor-default"
                >
                  {uni}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-24 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Students Choose XMarket
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for seamless campus trading
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔒",
                title: "University Verified",
                description: "Trade only with verified students from your university"
              },
              {
                icon: "💰",
                title: "Best Prices",
                description: "Save up to 60% compared to retail stores"
              },
              {
                icon: "📱",
                title: "Easy to Use",
                description: "Intuitive interface designed for busy students"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of students already transforming their campus experience
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/signup')}
              className="bg-white text-[#009F9C] px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center"
            >
              Join XMarket Today
              <ArrowRight className="w-6 h-6 ml-3" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/**
 * Enhanced loading spinner with smooth animations
 */
function LoadingSpinner() {
  return (
    <div className="relative">
      {/* Main spinner */}
      <motion.div 
        className="w-16 h-16 border-4 border-t-transparent rounded-full"
        style={{ borderColor: `${BRAND_COLOR} transparent transparent transparent` }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner pulse */}
      <motion.div
        className="absolute inset-2 rounded-full bg-[#009F9C]/20"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.5, 0.2, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
