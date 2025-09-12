import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bell, ShoppingBag, User } from 'lucide-react';
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
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30"
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#009F9C] to-[#00B8B5] rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Marketplace</h1>
              <p className="text-xs text-gray-500">Find what you need</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            {user && (
              <motion.button
                onClick={onNotificationClick}
                className="relative p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {pendingSalesCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
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
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-[#009F9C] to-[#00B8B5] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-20">
                      {user.fullName?.split(' ')[0] || 'User'}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <Link href="/login">
                <motion.button
                  className="px-4 py-2 bg-[#009F9C] text-white rounded-lg text-sm font-medium hover:bg-[#008A87] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
