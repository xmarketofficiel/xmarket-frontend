'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

interface UserTypeStepProps {
  isLoading: boolean;
}

export function UserTypeStep({ isLoading }: UserTypeStepProps) {
  const router = useRouter();

  const userTypes = [
    {
      route: '/signup/um6p-student',
      title: 'UM6P Student or Staff',
      tooltip: 'Mohammed VI Polytechnic University',
      icon: GraduationCap,
      color: 'bg-[#009F9C]',
      hoverColor: 'hover:bg-[#008B88]',
      inCard: true
    },
    {
      route: '/signup/1337-student',
      title: '1337 Student', 
      tooltip: '1337 Coding School',
      icon: ({ className }: { className?: string }) => (
        <svg 
          className={className} 
          viewBox="0 -200 960 960"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1 32,279.1" />
          <polygon points="597.9,114.2 762.7,-51.1 597.9,-51.1" />
          <polygon points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1" />
          <polygon points="928,279.1 762.7,443.9 928,443.9" />
        </svg>
      ),
      color: 'bg-black',
      hoverColor: 'hover:bg-gray-800',
      inCard: true
    },

  ];

  const cardTypes = userTypes.filter(type => type.inCard);

  const handleNavigation = (route: string) => {
    if (!isLoading) {
      router.push(route);
    }
  };

  return (
    <motion.div 
      className="space-y-4 lg:space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >
      {/* Student Card - Premium Design */}
      <motion.div
        className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-white/50 shadow-2xl shadow-gray-200/50 p-5 sm:p-6 lg:p-7 space-y-3 sm:space-y-4 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          delay: 0.1,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#009F9C]/5 via-transparent to-cyan-500/5 pointer-events-none" />
        
        {/* Title */}
        <div className="relative">
          <h3 className="text-sm sm:text-base font-bold text-gray-700 mb-1 tracking-wide uppercase">Student &amp; Staff Access</h3>
          <p className="text-xs sm:text-sm text-gray-500">Select your institution</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:gap-3.5 lg:gap-4">
          {cardTypes.map((userType, index) => {
            const Icon = userType.icon;
            return (
              <motion.div
                key={userType.route}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: ANIMATION_SYSTEM.duration.fast / 1000,
                  delay: 0.2 + (index * 0.1),
                  ease: ANIMATION_SYSTEM.framerEasing.easeOut 
                }}
              >
                {/* Tooltip - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:block absolute -top-12 left-1/2 transform -translate-x-1/2 
                  bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 
                  group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap
                  before:content-[''] before:absolute before:top-full before:left-1/2 
                  before:transform before:-translate-x-1/2 before:border-4 
                  before:border-transparent before:border-t-gray-900">
                  {userType.tooltip}
                </div>

                <motion.button
                  onClick={() => handleNavigation(userType.route)}
                  disabled={isLoading}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 border-white/30 ${userType.color} ${userType.hoverColor} text-white 
                    transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0
                    hover:shadow-2xl hover:shadow-black/20 active:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009F9C]/50
                    touch-manipulation relative overflow-hidden group min-h-[80px] sm:min-h-[88px]`}
                  whileHover={{ 
                    scale: isLoading ? 1 : 1.03,
                    y: isLoading ? 0 : -4,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: isLoading ? 1 : 0.98,
                    y: isLoading ? 0 : 0,
                    transition: { duration: 0.1 }
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                  
                  <div className="relative flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 p-3 sm:p-3.5 bg-white/25 backdrop-blur-md rounded-xl shadow-lg group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-lg" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-bold text-base sm:text-lg mb-0.5 group-hover:translate-x-1 transition-transform duration-200">
                        {userType.title}
                      </div>
                      <div className="text-white/85 text-xs sm:text-sm lg:hidden truncate">
                        {userType.tooltip}
                      </div>
                    </div>
                    <motion.svg 
                      className="w-6 h-6 flex-shrink-0 text-white/70 group-hover:text-white transition-colors duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </motion.svg>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* External registration is retired; only community students and staff can join. */}
    </motion.div>
  );
}
