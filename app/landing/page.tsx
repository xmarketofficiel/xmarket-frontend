'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import { 
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react';

// Import constants and components
import { 
  FEATURES,
  FAQ_ITEMS,
  ANIMATION_VARIANTS 
} from './constants';
// No component imports needed for static sections

/**
 * Landing Page - Hero section with Features, FAQ, and CTA sections
 */
export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  
  // State for FAQ accordion
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  // Ref for hero section only
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Redirect authenticated users
  if (user) {
    router.push('/marketplace');
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Navigation handlers
  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handlePlayVideo = () => {
    // Could open a demo video modal in the future
    console.log('Demo video clicked');
  };

  const handleFAQToggle = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <HeroBackground />
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <HeroContent 
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
            onPlayVideo={handlePlayVideo}
          />
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 bg-white/50">
        <div className="container mx-auto px-4">
          <FeaturesSection />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <FAQSection 
            openFAQ={openFAQ}
            onFAQToggle={handleFAQToggle}
          />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white">
        <div className="container mx-auto px-4 text-center">
          <CTASection onGetStarted={handleGetStarted} />
        </div>
      </section>
    </div>
  );
}

/**
 * Hero background with animated elements
 */
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30" />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
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
          rotate: [5, 0, 5],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      />
    </div>
  );
}

/**
 * Hero content with CTA buttons
 */
interface HeroContentProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onPlayVideo: () => void;
}

function HeroContent({ onGetStarted, onLogin, onPlayVideo }: HeroContentProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={ANIMATION_VARIANTS.staggerContainer}
    >
      <motion.div
        variants={ANIMATION_VARIANTS.fadeInUp}
        className="mb-6"
      >
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#009F9C]/10 text-[#009F9C] text-sm font-semibold mb-8">
          <CheckCircle className="w-4 h-4 mr-2" />
          Trusted by 500+ Students
        </span>
      </motion.div>

      <motion.h1
        variants={ANIMATION_VARIANTS.fadeInUp}
        className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
      >
        Your Campus
        <span className="block bg-gradient-to-r from-[#009F9C] to-[#007B78] bg-clip-text text-transparent">
          Marketplace
        </span>
      </motion.h1>

      <motion.p
        variants={ANIMATION_VARIANTS.fadeInUp}
        className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
      >
        Connect, trade, and thrive within your university community. 
        Buy, sell, and discover services from verified students.
      </motion.p>

      <motion.div
        variants={ANIMATION_VARIANTS.fadeInUp}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="px-8 py-4 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
        >
          Get Started Free
          <ArrowRight className="ml-2 w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogin}
          className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Sign In
        </motion.button>
      </motion.div>

      <motion.button
        variants={ANIMATION_VARIANTS.fadeInUp}
        whileHover={{ scale: 1.05 }}
        onClick={onPlayVideo}
        className="inline-flex items-center text-gray-600 hover:text-[#009F9C] transition-colors duration-300"
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg mr-3 hover:shadow-xl transition-shadow duration-300">
          <Play className="w-5 h-5 text-[#009F9C] ml-1" />
        </div>
        Watch Demo
      </motion.button>
    </motion.div>
  );
}

/**
 * Features section with feature cards (no animations)
 */
function FeaturesSection() {
  return (
    <div>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Everything You Need
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From marketplace to services, we've built everything students need to thrive
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature, index) => (
          <StaticFeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * FAQ section with accordion (no animations)
 */
interface FAQSectionProps {
  openFAQ: number | null;
  onFAQToggle: (index: number) => void;
}

function FAQSection({ openFAQ, onFAQToggle }: FAQSectionProps) {
  return (
    <div>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Got questions? We've got answers to help you get started
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((faq, index) => (
          <StaticFAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openFAQ === index}
            onToggle={() => onFAQToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Final CTA section (no animations)
 */
interface CTASectionProps {
  onGetStarted: () => void;
}

function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <div>
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Ready to Get Started?
      </h2>
      <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
        Join thousands of students already using XMarket to buy, sell, and connect
      </p>
      
      <button
        onClick={onGetStarted}
        className="px-12 py-4 bg-white text-[#009F9C] font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
      >
        Join XMarket Today
        <ArrowRight className="ml-3 w-6 h-6" />
      </button>
    </div>
  );
}

/**
 * Static feature card without animations
 */
interface StaticFeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
}

function StaticFeatureCard({ icon: Icon, title, description, color }: StaticFeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-4 shadow-md`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/**
 * Static FAQ item without animations
 */
interface StaticFAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function StaticFAQItem({ question, answer, isOpen, onToggle }: StaticFAQItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#009F9C]/20"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}