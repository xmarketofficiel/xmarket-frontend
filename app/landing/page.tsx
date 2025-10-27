'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import { 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

// Import constants and components
import { 
  FEATURES,
  FAQ_ITEMS
} from './constants';
import FeaturedProductsSection from './FeaturedProductsSection';
import LandingNavbar from './LandingNavbar';

/**
 * Landing Page - Redesigned with modern styling and improved UX
 */
export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  
  // State for FAQ accordion
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  // Redirect authenticated users
  if (user) {
    router.push('/marketplace');
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#009F9C] border-t-transparent" />
      </div>
    );
  }

  // Navigation handlers
  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleFAQToggle = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Landing Navbar */}
      <LandingNavbar />

      {/* Hero Section - Simplified */}
      <section id="hero" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Your Campus
              <span className="block mt-2 bg-gradient-to-r from-[#009F9C] via-[#008A87] to-[#007B78] bg-clip-text text-transparent">
                XMarket
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect, trade, and thrive within your university community. 
              Buy, sell, and discover services from verified students.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products">
        <FeaturedProductsSection />
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#009F9C]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#009F9C]/3 to-purple-500/3 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJ6bTAtNHYyaC0ydi0yem0wLTR2MmgtMnYtMnptMC00djJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <FeaturesSection />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjFoLTYweiIgZmlsbD0iIzAwOUY5QyIgZmlsbC1vcGFjaXR5PSIuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#009F9C]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
          <FAQSection 
            openFAQ={openFAQ}
            onFAQToggle={handleFAQToggle}
          />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#009F9C] via-[#008A87] to-[#007B78] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3djFoLTd6bTE0LTE0aDd2MWgtN3oiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Animated gradient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-20" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <CTASection onGetStarted={handleGetStarted} />
        </div>
      </section>
    </div>
  );
}

/**
 * Features section with feature cards
 */
function FeaturesSection() {
  return (
    <div>
      <div className="text-center mb-10 sm:mb-12 lg:mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
          Everything You Need
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          From marketplace to services, we've built everything students need to thrive
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {FEATURES.map((feature, index) => (
          <div key={feature.title}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          </div>
        ))}
      </div>
    </div>
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
    <div>
      <div className="text-center mb-10 sm:mb-12 lg:mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Got questions? We've got answers to help you get started
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {FAQ_ITEMS.map((faq, index) => (
          <div key={index}>
            <FAQItem
              question={faq.question}
              answer={faq.answer}
              isOpen={openFAQ === index}
              onToggle={() => onFAQToggle(index)}
            />
          </div>
        ))}
      </div>
    </div>
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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">
        Ready to Get Started?
      </h2>
      <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto opacity-95 leading-relaxed px-4">
        Join thousands of students already using XMarket to buy, sell, and connect
      </p>
      
      <button
        onClick={onGetStarted}
        className="px-10 sm:px-12 py-4 sm:py-5 bg-white text-[#009F9C] font-bold text-lg sm:text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center group hover:scale-105"
      >
        Join XMarket Today
        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

/**
 * FAQ item with smooth animation
 */
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        onClick={onToggle}
        className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#009F9C]/30 group"
      >
        <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base group-hover:text-[#009F9C] transition-colors">
          {question}
        </span>
        <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-[#009F9C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 border-t border-gray-100">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Feature card with improved styling
 */
interface FeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 lg:p-7 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#009F9C]/20 hover:-translate-y-2 transition-all duration-300 h-full overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30 opacity-50"></div>
      
      <div className="relative z-10">
        <div className={`inline-flex p-3 sm:p-3.5 rounded-xl bg-gradient-to-r ${color} mb-3 sm:mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#009F9C] transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </div>

      {/* Decorative gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#009F9C]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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