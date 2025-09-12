'use client';

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '../../contexts/UserContext';
import { 
  ArrowRight,
  Play,
  Download,
  CheckCircle
} from 'lucide-react';

// Import constants and components
import { 
  FEATURES, 
  STATISTICS, 
  TESTIMONIALS, 
  CATEGORIES, 
  FAQ_ITEMS,
  BRAND_COLORS,
  ANIMATION_VARIANTS 
} from './constants';
import { FeatureCard } from './components/FeatureCard';
import { TestimonialCard } from './components/TestimonialCard';
import { StatisticCard } from './components/StatisticCard';
import { CategoryCard } from './components/CategoryCard';
import { FAQItem } from './components/FAQItem';

// Lazy load heavy components
const AdvancedAnimations = lazy(() => import('./components/AdvancedAnimations'));

/**
 * Landing Page - Optimized with clean architecture and reusable components
 * Features hero section, feature showcase, testimonials, and FAQ
 */
export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  
  // State management
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Refs for intersection observer
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  // Scroll animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  
  // Intersection observers
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.push('/marketplace');
    }
  }, [user, loading, router]);

  // Handle FAQ toggle
  const handleFAQToggle = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Navigation handlers
  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <HeroBackground />
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <HeroContent 
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
            onPlayVideo={() => setIsVideoPlaying(true)}
          />
        </div>
      </motion.section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-white/50">
        <div className="container mx-auto px-4">
          <FeaturesSection inView={featuresInView} />
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} className="py-24 bg-gradient-to-r from-[#009F9C] to-[#007B78] relative overflow-hidden">
        <StatisticsSection inView={statsInView} />
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <CategoriesSection />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <TestimonialsSection 
            currentTestimonial={currentTestimonial}
            onTestimonialChange={setCurrentTestimonial}
          />
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white">
        <div className="container mx-auto px-4 text-center">
          <CTASection onGetStarted={handleGetStarted} />
        </div>
      </section>

      {/* Advanced Animations (Lazy Loaded) */}
      <Suspense fallback={null}>
        <AdvancedAnimations />
      </Suspense>
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
 * Features section with feature cards
 */
interface FeaturesSectionProps {
  inView: boolean;
}

function FeaturesSection({ inView }: FeaturesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Everything You Need
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A comprehensive platform designed specifically for university communities
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Statistics section with animated counters
 */
interface StatisticsSectionProps {
  inView: boolean;
}

function StatisticsSection({ inView }: StatisticsSectionProps) {
  return (
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Trusted by Students
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Join thousands of students who are already part of our community
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATISTICS.map((stat, index) => (
          <StatisticCard key={stat.label} {...stat} index={index} />
        ))}
      </div>
    </div>
  );
}

/**
 * Categories section
 */
function CategoriesSection() {
  return (
    <>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Popular Categories
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover what other students are buying and selling
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {CATEGORIES.map((category, index) => (
          <CategoryCard key={category.name} {...category} index={index} />
        ))}
      </div>
    </>
  );
}

/**
 * Testimonials section with carousel
 */
interface TestimonialsSectionProps {
  currentTestimonial: number;
  onTestimonialChange: (index: number) => void;
}

function TestimonialsSection({ currentTestimonial, onTestimonialChange }: TestimonialsSectionProps) {
  return (
    <>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          What Students Say
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Real feedback from our university community
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              {...testimonial}
              isActive={index === currentTestimonial}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => onTestimonialChange(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentTestimonial ? 'bg-[#009F9C]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * FAQ section with accordion
 */
interface FAQSectionProps {
  openFAQ: number | null;
  onFAQToggle: (index: number) => void;
}

function FAQSection({ openFAQ, onFAQToggle }: FAQSectionProps) {
  return (
    <>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600">
          Everything you need to know about XMarket
        </p>
      </div>

      <div>
        {FAQ_ITEMS.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openFAQ === index}
            onToggle={() => onFAQToggle(index)}
          />
        ))}
      </div>
    </>
  );
}

/**
 * Final CTA section
 */
interface CTASectionProps {
  onGetStarted: () => void;
}

function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Ready to Get Started?
      </h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
        Join thousands of students who are already part of our thriving community
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGetStarted}
        className="px-8 py-4 bg-white text-[#009F9C] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
      >
        Get Started Today
        <ArrowRight className="ml-2 w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
