import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bell, ShoppingBag, User } from 'lucide-react';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import type { MarketplaceHeaderProps } from '../types';

/**
 * Marketplace Header Component
 * Top navigation with notifications and user actions
 */
export function MarketplaceHeader({ 
  user, 
  pendingSalesCount, 
  onNotificationClick 
}: MarketplaceHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000, 
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
      className="design-card bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/50 sticky top-0 z-40"
      style={{
        transitionDuration: ANIMATION_SYSTEM.durationString.normal,
        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-[#009F9C] to-[#00B8B5] rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                 style={{
                   transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                   transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                 }}>
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 transition-colors"
                  style={{
                    transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                    transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                  }}>
                Marketplace
              </h1>
              <p className="text-xs text-gray-500 transition-colors"
                 style={{
                   transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                   transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                 }}>
                Find what you need
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            {user && (
              <motion.button
                onClick={onNotificationClick}
                className="design-card relative p-2 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 transition-all"
                style={{
                  transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                  transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
              >
                <Bell className="w-5 h-5 text-gray-600 transition-colors"
                      style={{
                        transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                      }} />
                {pendingSalesCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: ANIMATION_SYSTEM.duration.normal / 1000,
                      ease: ANIMATION_SYSTEM.framerEasing.bounce 
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-xs font-medium text-white">
                      {pendingSalesCount > 9 ? '9+' : pendingSalesCount}
                    </span>
                  </motion.div>
                )}
              </motion.button>
            )}

            {/* Profile */}
            {user ? (
              <Link href="/profile">
                <motion.div
                  className="design-card flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 transition-all"
                  style={{
                    transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                    transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
                >
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm hover:shadow-md transition-all"
                      style={{
                        transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-[#009F9C] to-[#00B8B5] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                         style={{
                           transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                           transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                         }}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-20 transition-colors"
                       style={{
                         transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                         transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                       }}>
                      {user.fullName?.split(' ')[0] || 'User'}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <Link href="/login">
                <motion.button
                  className="design-card px-4 py-2 bg-[#009F9C] text-white rounded-lg text-sm font-medium hover:bg-[#008A87] hover:shadow-md transition-all border border-transparent hover:border-[#007A77]"
                  style={{
                    transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                    transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
                >
                  Sign In
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
