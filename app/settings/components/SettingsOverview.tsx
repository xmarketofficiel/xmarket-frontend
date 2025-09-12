'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Settings,
  Bell,
  Shield,
  UserCog,
  HelpCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { SETTINGS_CONSTANTS } from './constants';
import type { SettingsOverviewProps, SettingsSection } from './types';

const SettingsOverview: React.FC<SettingsOverviewProps> = ({
  user,
  onQuickAction,
  onSectionClick
}) => {
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      User,
      Bell,
      Shield,
      Settings,
      UserCog,
      HelpCircle
    };
    return icons[iconName] || Settings;
  };

  return (
    <div className="space-y-8">
      {/* User Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: SETTINGS_CONSTANTS.ANIMATION_DELAYS.HEADER }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-[#009F9C]/20">
            {user.profileImageUrl && user.profileImageUrl !== 'undefined' ? (
              <img 
                src={user.profileImageUrl}
                alt={user.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007A77] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Active Listings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Total Sales</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Profile Views</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: SETTINGS_CONSTANTS.ANIMATION_DELAYS.NAVIGATION }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SETTINGS_CONSTANTS.QUICK_ACTIONS.map((action, index) => {
            const IconComponent = getIconComponent(action.icon);
            
            return (
              <motion.button
                key={action.id}
                onClick={() => onQuickAction(action.id)}
                className={`
                  p-4 rounded-xl border-2 border-transparent
                  bg-gradient-to-br ${action.color} text-white
                  hover:shadow-lg transition-all duration-300
                  group text-left
                `}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: SETTINGS_CONSTANTS.ANIMATION_DELAYS.NAVIGATION + (index * 0.1),
                  type: 'spring',
                  stiffness: 200 
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent className="w-5 h-5" />
                  <h4 className="font-medium">{action.title}</h4>
                </div>
                <p className="text-sm text-white/80">{action.description}</p>
                <ArrowRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Settings Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: SETTINGS_CONSTANTS.ANIMATION_DELAYS.CONTENT }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SETTINGS_CONSTANTS.SETTINGS_SECTIONS.map((section, index) => {
            const IconComponent = getIconComponent(section.icon);
            
            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionClick(section.id as SettingsSection)}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-left group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: SETTINGS_CONSTANTS.ANIMATION_DELAYS.CONTENT + (index * 0.05),
                  type: 'spring',
                  stiffness: 200 
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${section.bgColor} rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${section.iconColor}`} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {section.items.slice(0, 3).map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                  {section.items.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      +{section.items.length - 3} more
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: SETTINGS_CONSTANTS.ANIMATION_DELAYS.CARDS }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">App Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium">Today</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Build</span>
            <span className="font-medium">2024.1.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsOverview;
