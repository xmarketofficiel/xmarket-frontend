'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import SettingsOverview from './SettingsOverview';
import { SETTINGS_CONSTANTS } from './constants';
import type { SettingsSection, UserSettings } from './types';

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const { addToast } = useToast();

  // Handle user not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access settings.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Event handlers
  const handleQuickAction = (actionId: string) => {
    const action = SETTINGS_CONSTANTS.QUICK_ACTIONS.find(a => a.id === actionId);
    if (action?.href) {
      router.push(action.href);
    } else {
      addToast('Feature coming soon!', 'info');
    }
  };

  const handleSectionClick = (sectionId: SettingsSection) => {
    const section = SETTINGS_CONSTANTS.SETTINGS_SECTIONS.find(s => s.id === sectionId);
    if (section?.href) {
      router.push(section.href);
    } else {
      addToast('Feature coming soon!', 'info');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: SETTINGS_CONSTANTS.ANIMATION_DELAYS.HEADER }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and app preferences</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SettingsOverview
            user={user as UserSettings}
            onQuickAction={handleQuickAction}
            onSectionClick={handleSectionClick}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
