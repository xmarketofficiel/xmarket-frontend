"use client";

import { useState, useEffect } from "react";
import { Mail, Sparkles, Shield, Zap, Heart, Smartphone, Users, Star } from "lucide-react";
import './animations.css';

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      // Call the backend API to store the email
      const response = await fetch('http://localhost:3001/waitlist/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          notes: 'Subscribed from UM6P coming soon page'
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          setError("Email already registered! You're already on our waitlist.");
        } else {
          setError(data.message || "Something went wrong. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Success
      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      setError("Unable to connect to server. Please try again later.");
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: "🏫",
      title: "Exclusive UM6P Community",
      description: "A trusted marketplace exclusively for UM6P students and staff - verified university members only",
    },
    {
      icon: "🛡️",
      title: "Campus-Verified Sellers",
      description: "Every seller is verified through your UM6P credentials, ensuring safe transactions within your university community",
    },
    {
      icon: "📍",
      title: "On-Campus Meetups",
      description: "Meet sellers and buyers right on campus - library, cafeteria, or residence halls. No shipping hassles!",
    },
    {
      icon: "�",
      title: "Student-Friendly Pricing",
      description: "Find amazing deals from fellow students. From textbooks to electronics, everything at student-budget prices",
    },
    {
      icon: "📚",
      title: "Academic Focus",
      description: "Specialized categories for textbooks, lab equipment, graduation items, and everything students need",
    },
    {
      icon: "🤝",
      title: "Peer-to-Peer Trust",
      description: "Built-in rating system and community feedback from your classmates and campus colleagues",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#006666] to-[#40E0D0] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-white/10 rounded-full animate-float animation-delay-500"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-white/5 rounded-full animate-float animation-delay-800"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-white/15 rounded-full animate-float animation-delay-300"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-white mr-4 animate-pulse" />
            <h1 className="text-6xl font-bold text-white">XMarket</h1>
            <Sparkles className="w-12 h-12 text-white ml-4 animate-pulse delay-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-up animation-delay-200">
            Your Campus Marketplace is Coming
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-up animation-delay-300">
            The exclusive marketplace for UM6P students and staff. Buy, sell, and trade within your trusted university community. 
            From textbooks to electronics, find everything you need without leaving campus.
          </p>
        </div>

        {/* Email Signup */}
        <div className="max-w-md mx-auto mb-20 animate-slide-up animation-delay-400">
          <div className="glass rounded-2xl p-8 text-center">
            {!isSubmitted ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">Join the UM6P Waitlist</h3>
                <p className="text-white/80 mb-6">
                  Be among the first UM6P students and staff to access your exclusive campus marketplace.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-white/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                        error ? 'border-red-400 animate-shake' : 'border-white/20'
                      } rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-all duration-300`}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-300 text-sm animate-slide-up">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 bg-white text-[#006666] font-semibold rounded-lg transition-all duration-300 ${
                      isLoading
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-white/90 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-[#006666]/30 border-t-[#006666] rounded-full animate-spin mr-2"></div>
                        Joining...
                      </div>
                    ) : (
                      'Join the Waitlist'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="animate-slide-up">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">You're In!</h3>
                <p className="text-white/80">
                  Thanks for joining our waitlist. We'll notify you as soon as XMarket goes live!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up animation-delay-500">
            Why UM6P Students Love XMarket
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`glass rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* UM6P Community Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up animation-delay-1200">
            What UM6P Community is Saying
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '1300ms' }}>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 mb-4 italic">"Finally! A safe way to buy textbooks from fellow UM6P students. No more sketchy online deals!"</p>
              <div className="text-right">
                <p className="font-semibold text-white">Youssef A.</p>
                <p className="text-white/60 text-sm">Engineering Student</p>
              </div>
            </div>
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '1400ms' }}>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 mb-4 italic">"Perfect for finding lab equipment and graduation items. The campus community aspect makes all the difference!"</p>
              <div className="text-right">
                <p className="font-semibold text-white">Dr. Fatima L.</p>
                <p className="text-white/60 text-sm">Faculty Member</p>
              </div>
            </div>
            <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '1500ms' }}>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 mb-4 italic">"Love meeting sellers right on campus! Got my laptop from a senior student in the library. So convenient!"</p>
              <div className="text-right">
                <p className="font-semibold text-white">Amina K.</p>
                <p className="text-white/60 text-sm">Business Student</p>
              </div>
            </div>
          </div>
        </div>

        {/* Launch Timeline */}
        {/* Interactive Launch Timeline */}
        <div className="text-center mb-16">
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto animate-slide-up animation-delay-1600">
            <h3 className="text-3xl font-bold text-white mb-8">Campus Launch Roadmap</h3>
            
            {/* Timeline Progress Bar */}
            <div className="relative mb-8">
              <div className="absolute top-4 left-0 w-full h-1 bg-white/20 rounded-full"></div>
              <div className="absolute top-4 left-0 w-2/3 h-1 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Phase 1 - Completed */}
              <div className="relative">
                <div className="bg-green-500 w-8 h-8 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="glass rounded-lg p-4">
                  <h4 className="text-white font-bold mb-2">🎓 Beta Testing</h4>
                  <p className="text-white/80 text-sm mb-2">December 2024 - August 2025</p>
                  <p className="text-green-300 font-semibold text-sm">✅ COMPLETED</p>
                  <p className="text-white/70 text-xs mt-2">200+ UM6P students tested and provided feedback</p>
                </div>
              </div>
              
              {/* Phase 2 - In Progress */}
              <div className="relative">
                <div className="bg-yellow-400 w-8 h-8 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                </div>
                <div className="glass rounded-lg p-4 border-2 border-yellow-400/50">
                  <h4 className="text-white font-bold mb-2">⚙️ Final Polish</h4>
                  <p className="text-white/80 text-sm mb-2">August - September 2025</p>
                  <p className="text-yellow-300 font-semibold text-sm">🔧 FINAL WEEK!</p>
                  <p className="text-white/70 text-xs mt-2">Last-minute testing & UM6P ID verification setup</p>
                </div>
              </div>
              
              {/* Phase 3 - Launch Day */}
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-8 h-8 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="glass rounded-lg p-4 border-2 border-purple-400/50">
                  <h4 className="text-white font-bold mb-2">🎉 LAUNCH DAY</h4>
                  <p className="text-white/80 text-sm mb-2 font-bold">September 9, 2025</p>
                  <p className="text-purple-300 font-semibold text-sm animate-pulse">📅 7 DAYS LEFT!</p>
                  <p className="text-white/70 text-xs mt-2">Full campus rollout for all UM6P community!</p>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <h4 className="text-white font-bold mb-4">🔥 LAUNCH COUNTDOWN - September 9, 2025</h4>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-400/30">
                  <div className="text-3xl font-bold text-purple-300 animate-pulse">7</div>
                  <div className="text-white/70 text-sm font-semibold">Days Left!</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">~168</div>
                  <div className="text-white/70 text-sm">Hours</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-white/70 text-sm">Items Ready</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">1K+</div>
                  <div className="text-white/70 text-sm">Expected Users</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-white/90 font-bold text-lg">🚀 Mark your calendar: September 9th, 2025</p>
                <p className="text-white/70 text-sm">We're launching exactly on 9/9/25 - An easy date to remember!</p>
              </div>
            </div>

            {/* Campus-Specific Features Coming */}
            <div className="bg-gradient-to-r from-[#40E0D0]/20 to-[#006666]/20 rounded-lg p-6">
              <h4 className="text-white font-bold mb-3">🏫 Exclusive UM6P Features Coming:</h4>
              <div className="grid md:grid-cols-2 gap-3 text-left">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-white/90 text-sm">Dorm-to-dorm delivery service</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-white/90 text-sm">Campus event marketplace</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-white/90 text-sm">Study group equipment sharing</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  <span className="text-white/90 text-sm">Graduation cap & gown rentals</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-2">⏳</span>
                  <span className="text-white/90 text-sm">Campus food delivery integration</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-2">⏳</span>
                  <span className="text-white/90 text-sm">Professor-approved textbook exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Footer */}
                {/* Footer */}
        <div className="text-center mt-16 animate-fade-in animation-delay-2000">
          <p className="text-white/60">
            © 2024 XMarket. All rights reserved. | Built for the UM6P community with ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
