'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingNavbar() {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#009F9C] to-[#007B78] bg-clip-text text-transparent">
              XMarket
            </span>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-[#009F9C] font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-gray-700 hover:text-[#009F9C] font-medium transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-[#009F9C] font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-700 hover:text-[#009F9C] font-medium transition-colors"
            >
              FAQ
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-gray-700 hover:text-[#009F9C] font-semibold transition-colors"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/signup')}
              className="px-6 py-2 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Sign Up
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
