'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package,
  Heart,
  Clock,
  ShoppingBag,
  CheckCircle,
  Eye,
  Bell
} from 'lucide-react';
import { PROFILE_CONSTANTS } from './constants';
import type { ProfileTabsProps, ProfileTab } from './types';

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  stats,
  loading = false
}) => {
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Package,
      Heart,
      Clock,
      ShoppingBag,
      CheckCircle,
      Eye,
      Bell
    };
    return icons[iconName] || Package;
  };

  const getTabCount = (tab: ProfileTab): number => {
    switch (tab) {
      case 'my-items':
        return stats.activeListingsCount || 0;
      case 'my-interests':
        return stats.savedItemsCount || 0;
      case 'pending-sales':
        return stats.pendingSalesCount || 0;
      case 'purchase-history':
        return stats.purchaseHistoryCount || 0;
      case 'sold-items':
        return stats.soldItemsCount || 0;
      case 'viewed-items':
        return stats.viewedItemsCount || 0;
      case 'notifications':
        return stats.notificationsCount || 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="flex-1 min-w-[120px] h-12 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.NAVIGATION }}
      className="bg-white rounded-2xl shadow-lg p-2"
    >
      <div className="flex flex-wrap gap-2">
        {PROFILE_CONSTANTS.TABS.map((tab, index) => {
          const IconComponent = getIconComponent(tab.icon);
          const count = getTabCount(tab.id as ProfileTab);
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id as ProfileTab)}
              className={`
                flex-1 min-w-[120px] px-4 py-3 rounded-lg transition-all duration-200
                flex items-center justify-center gap-2 text-sm font-medium
                hover:shadow-md relative overflow-hidden group
                ${isActive 
                  ? 'bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white shadow-lg' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.NAVIGATION + (index * 0.05),
                type: 'spring',
                stiffness: 200 
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={tab.description}
            >
              {/* Background animation */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#009F9C]/10 to-[#007A77]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
              )}

              <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              
              <span className="hidden sm:inline truncate">
                {tab.label}
              </span>
              
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    text-xs px-2 py-0.5 rounded-full font-semibold min-w-[20px] text-center
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[#009F9C]/10 text-[#009F9C]'
                    }
                  `}
                >
                  {count > 99 ? '99+' : count}
                </motion.span>
              )}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-[#009F9C] to-[#007A77] rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Mobile tab labels */}
      <div className="sm:hidden mt-3 text-center">
        <p className="text-sm text-gray-600">
          {PROFILE_CONSTANTS.TABS.find(tab => tab.id === activeTab)?.description || 'Profile section'}
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileTabs;
