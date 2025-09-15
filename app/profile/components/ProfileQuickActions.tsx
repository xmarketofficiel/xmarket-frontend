'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus,
  Search,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PROFILE_CONSTANTS } from './constants';
import type { ProfileQuickActionsProps } from './types';

const ProfileQuickActions: React.FC<ProfileQuickActionsProps> = ({
  onAction,
  loading = false
}) => {
  const router = useRouter();

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Plus,
      Search,
      Settings
    };
    return icons[iconName] || Plus;
  };

  const handleActionClick = (action: typeof PROFILE_CONSTANTS.QUICK_ACTIONS[number]) => {
    onAction(action.id);
    if (action.href) {
      router.push(action.href);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg h-32 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="h-5 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.CONTENT }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {PROFILE_CONSTANTS.QUICK_ACTIONS.map((action, index) => {
        const IconComponent = getIconComponent(action.icon);

        return (
          <motion.button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`
              bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300
              text-left group relative overflow-hidden
            `}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.CONTENT + (index * 0.1),
              type: 'spring',
              stiffness: 200 
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background gradient */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 
              group-hover:opacity-10 transition-opacity duration-300
            `} />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`
                  w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} 
                  flex items-center justify-center text-white
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#009F9C] transition-colors">
                  {action.label}
                </h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {action.description}
              </p>

              {/* Arrow indicator */}
              <div className="flex items-center justify-end">
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#009F9C] group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default ProfileQuickActions;
