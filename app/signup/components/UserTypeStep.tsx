'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GraduationCap, Globe } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';

interface UserTypeStepProps {
  isLoading: boolean;
}

export function UserTypeStep({ isLoading }: UserTypeStepProps) {
  const router = useRouter();

  const userTypes = [
    {
      route: '/signup/um6p-student',
      title: 'UM6P Student',
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
    {
      route: '/signup/external',
      title: 'External People',
      tooltip: 'Request access to join the platform',
      icon: Globe,
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700',
      inCard: false
    }
  ];

  const cardTypes = userTypes.filter(type => type.inCard);
  const externalType = userTypes.find(type => !type.inCard);

  const handleNavigation = (route: string) => {
    if (!isLoading) {
      router.push(route);
    }
  };

  return (
    <motion.div 
      className="space-y-6 lg:space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >
      {/* Student Card */}
      <motion.div
        className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/40 p-6 lg:p-8 space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          delay: 0.1,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }}
      >
        {/* Removed "Students" title as requested */}

        <div className="grid grid-cols-1 gap-5">
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
                  bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 
                  group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap
                  before:content-[''] before:absolute before:top-full before:left-1/2 
                  before:transform before:-translate-x-1/2 before:border-4 
                  before:border-transparent before:border-t-gray-900">
                  {userType.tooltip}
                </div>

                <motion.button
                  onClick={() => handleNavigation(userType.route)}
                  disabled={isLoading}
                  className={`w-full p-6 lg:p-8 rounded-2xl border border-gray-200 ${userType.color} ${userType.hoverColor} text-white 
                    transition-all duration-300 transform hover:scale-[1.02] lg:hover:scale-[1.05] hover:shadow-xl
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#009F9C]/30
                    touch-manipulation min-h-[5rem] lg:min-h-[6rem]`}
                  whileHover={{ 
                    scale: isLoading ? 1 : (typeof window !== 'undefined' && window.innerWidth < 1024) ? 1.02 : 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: isLoading ? 1 : 0.98,
                    transition: { duration: 0.1 }
                  }}
                >
                  <div className="flex flex-col lg:flex-col items-center space-y-3 lg:space-y-4">
                    <div className="p-3 lg:p-4 bg-white/20 rounded-2xl">
                      <Icon className="w-7 h-7 lg:w-8 lg:h-8" />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg lg:text-xl">{userType.title}</div>
                      <div className="text-white/80 text-sm lg:hidden mt-1">
                        {userType.tooltip}
                      </div>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* External People option */}
      {externalType && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: ANIMATION_SYSTEM.duration.normal / 1000,
            delay: 0.4,
            ease: ANIMATION_SYSTEM.framerEasing.easeOut 
          }}
        >
          <div className="text-sm text-gray-500 mb-4 font-medium">or</div>
          
          <motion.div className="group relative">
            {/* Tooltip - Hidden on mobile */}
            <div className="hidden lg:block absolute -top-12 left-1/2 transform -translate-x-1/2 
              bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 
              group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap
              before:content-[''] before:absolute before:top-full before:left-1/2 
              before:transform before:-translate-x-1/2 before:border-4 
              before:border-transparent before:border-t-gray-900">
              {externalType.tooltip}
            </div>

            <motion.button
              onClick={() => handleNavigation(externalType.route)}
              disabled={isLoading}
              className={`w-full lg:w-auto px-8 lg:px-12 py-5 lg:py-6 rounded-2xl border border-gray-300 ${externalType.color} ${externalType.hoverColor} text-white 
                transition-all duration-300 transform hover:scale-[1.02] lg:hover:scale-[1.05] hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-gray-500/30
                touch-manipulation min-h-[4rem]`}
              whileHover={{ 
                scale: isLoading ? 1 : (typeof window !== 'undefined' && window.innerWidth < 1024) ? 1.02 : 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: isLoading ? 1 : 0.98,
                transition: { duration: 0.1 }
              }}
            >
              <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <externalType.icon className="w-6 h-6" />
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-bold text-lg">{externalType.title}</div>
                  <div className="text-white/80 text-sm lg:hidden mt-1">
                    {externalType.tooltip}
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
