'use client';

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
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-200 animate-slideDown">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-1">
            <svg width="40" height="40" viewBox="0 0 293 293" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="293" height="293" rx="20" fill="#009F9C"/>
              <path d="M201.938 152.832L201.938 152.833L201.939 152.835C201.94 152.837 201.941 152.839 201.942 152.843L202.011 152.994C202.059 153.101 202.131 153.261 202.226 153.471C202.415 153.89 202.695 154.51 203.057 155.312C203.78 156.915 204.831 159.245 206.144 162.154C208.768 167.972 212.436 176.105 216.61 185.359C220.609 194.225 225.073 204.121 229.529 214H196.619C194.072 208.354 191.589 202.85 189.264 197.694C185.089 188.44 181.421 180.308 178.797 174.49C178.722 174.325 178.649 174.161 178.576 174H114.953L96.9102 214H64L91.5918 152.832L95.5752 144H197.954L201.938 152.832ZM133.578 111H160.354C161.784 106.586 163.585 101.029 165.583 94.8604C167.099 90.1817 168.729 85.1511 170.397 80H201.933C199.242 88.3047 196.538 96.6524 194.123 104.106C191.679 111.651 189.532 118.279 187.995 123.022C187.227 125.394 186.611 127.294 186.188 128.602C185.976 129.255 185.813 129.761 185.702 130.103C185.647 130.273 185.604 130.404 185.576 130.491C185.562 130.535 185.551 130.568 185.544 130.59C185.541 130.6 185.538 130.609 185.536 130.614C185.535 130.617 185.535 130.62 185.534 130.621L185.533 130.622C185.529 130.621 185.28 130.541 171.263 126L185.533 130.623L182.171 141H111.762L108.399 130.623L92 80H123.535L133.578 111Z" fill="white"/>
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#009F9C] to-[#007B78] bg-clip-text text-transparent">
              Market
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
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-gray-700 hover:text-[#009F9C] font-semibold transition-all duration-200 hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-6 py-2 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
