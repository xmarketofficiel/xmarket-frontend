"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";
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
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Loading Content */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 font-medium mt-6">
            Setting up your XMarket experience...
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Landing Page Content - Clean flat design for non-authenticated users
 */
function LandingPageContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* Hero Badge */}
          <div className="mb-12">
            <span className="inline-flex items-center px-8 py-4 rounded-xl bg-white border border-gray-200 text-[#009F9C] text-base font-bold shadow-lg">
              <Sparkles className="w-5 h-5 mr-3" />
              🎓 Built for Students, By Students
              <span className="ml-3">✨</span>
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
            Your Campus
            <span className="block text-[#009F9C]">
              Marketplace
            </span>
            <span className="block text-5xl md:text-6xl mt-4 text-gray-700">
              Revolution 🚀
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Transform how you buy, sell, and connect within your university community. 
            <span className="text-[#009F9C] font-bold"> Join thousands of students</span> already saving money and making friends!
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {[
              { icon: Users, text: "10K+ Students", color: "text-blue-600" },
              { icon: Shield, text: "100% Secure", color: "text-green-600" },
              { icon: TrendingUp, text: "Save 60%", color: "text-purple-600" },
              { icon: Heart, text: "Loved by All", color: "text-red-500" }
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white rounded-xl px-6 py-4 shadow-lg border border-gray-200"
              >
                <item.icon className={`w-6 h-6 mr-3 ${item.color}`} />
                <span className="font-bold text-gray-800">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => router.push('/signup')}
              className="bg-[#009F9C] hover:bg-[#007A77] text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg transition-colors duration-200 flex items-center"
            >
              Start Your Journey
              <ArrowRight className="w-6 h-6 ml-3" />
            </button>
            
            <button
              onClick={() => router.push('/login')}
              className="bg-white text-[#009F9C] border-2 border-[#009F9C] px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:bg-[#009F9C]/5 transition-colors duration-200"
            >
              I'm Already In! 🎉
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-sm text-gray-500">
            <p className="mb-4 font-medium">Trusted by students at:</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {["🏛️ Harvard", "🎓 MIT", "📚 Stanford", "🔬 Berkeley", "🎨 NYU"].map((uni, index) => (
                <span
                  key={index}
                  className="font-semibold"
                >
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Students Choose XMarket
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for seamless campus trading
            </p>
          </div>

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
              <div
                key={index}
                className="bg-white rounded-xl p-8 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-[#009F9C] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of students already transforming their campus experience
          </p>
          
          <button
            onClick={() => router.push('/signup')}
            className="bg-white text-[#009F9C] px-12 py-6 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-shadow duration-200 inline-flex items-center"
          >
            Join XMarket Today
            <ArrowRight className="w-6 h-6 ml-3" />
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * Clean loading spinner without framer-motion
 */
function LoadingSpinner() {
  return (
    <div className="relative">
      <div 
        className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: `${BRAND_COLOR} transparent transparent transparent` }}
      />
    </div>
  );
}
