'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit3, 
  MessageCircle, 
  MapPin, 
  Calendar,
  Shield,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { getSafeImageUrl } from '../../../utils/imageUtils';
import { ANIMATION_SYSTEM } from '../../../lib/design-system';
import { PROFILE_CONSTANTS } from './constants';
import type { ProfileHeaderProps } from './types';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwner,
  onEditProfile,
  onMessageUser,
  loading = false
}) => {
  const profileImageUrl = user.profileImageUrl || user.profilePicture;
  const hasProfileImage = profileImageUrl && profileImageUrl !== 'undefined';

  const getVerificationIcon = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVerificationText = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return 'Verified User';
      case 'pending':
        return 'Verification Pending';
      default:
        return 'Unverified';
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="design-card bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 hover:shadow-xl transition-all"
        style={{
          transitionDuration: ANIMATION_SYSTEM.durationString.normal,
          transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: ANIMATION_SYSTEM.duration.normal / 1000, 
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }}
      >
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-12">
            <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse border-4 border-white shadow-lg" />
            <div className="flex-1 mt-12 space-y-3">
              <div className="h-6 bg-gray-300 rounded w-48 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-64 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.HEADER,
        duration: ANIMATION_SYSTEM.duration.normal / 1000, 
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
      className="design-card relative bg-white rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all p-6"
      style={{
        transitionDuration: ANIMATION_SYSTEM.durationString.normal,
        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
      }}
    >
      {/* Modern Profile Layout */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Profile Picture */}
        <motion.div 
          className="relative z-10 flex-shrink-0 mx-auto sm:mx-0"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white hover:shadow-2xl transition-all"
               style={{
                 transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                 transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
               }}>
            {hasProfileImage ? (
              <img
                src={getSafeImageUrl(profileImageUrl)}
                alt={user.fullName}
                className="w-full h-full object-cover transition-all"
                style={{
                  transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                  transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007A77] flex items-center justify-center">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
            )}
            
            {/* Fallback for broken images */}
            <div 
              className={`w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007A77] flex items-center justify-center ${hasProfileImage ? 'hidden' : ''}`}
              style={{ display: hasProfileImage ? 'none' : 'flex' }}
            >
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>
          
          {/* Verification Badge */}
          {user.isVerified && (
            <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          )}
          
          {/* Activity Status */}
          {user.lastActive && (
            <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </motion.div>

        {/* User Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
              {/* Name and Verification */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  {user.fullName}
                </h1>
                {user.isVerified && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700 mx-auto sm:mx-0 w-fit"
                    title="Verified Seller"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </motion.div>
                )}
              </div>

              {/* Rating and Response Time */}
              {user.averageRating && user.averageRating > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full mx-auto sm:mx-0 w-fit">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-900">
                      {user.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({user.totalRatings || 0} reviews)
                    </span>
                  </div>
                  
                  {user.responseTime && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mx-auto sm:mx-0 w-fit">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">
                        ~{user.responseTime}h response
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Location and Join Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600 justify-center sm:justify-start">
                {user.location && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-700 leading-relaxed max-w-2xl text-center sm:text-left">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:ml-4">
              {isOwner ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEditProfile}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#009F9C] text-white rounded-xl hover:bg-[#007A77] transition-all font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onMessageUser}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#009F9C] text-white rounded-xl hover:bg-[#007A77] transition-all font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </motion.button>
              )}
            </div>
          </div>
        </div>

      {/* Marketplace Activity Summary */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            {user.activityScore && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Activity Score:</span>
                <span className="font-semibold text-gray-900">{user.activityScore}%</span>
              </div>
            )}
            {user.preferredCategories && user.preferredCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Interests:</span>
                <span className="font-medium text-gray-900">
                  {user.preferredCategories.slice(0, 2).join(', ')}
                  {user.preferredCategories.length > 2 && (
                    <span className="text-gray-500"> +{user.preferredCategories.length - 2} more</span>
                  )}
                </span>
              </div>
            )}
          </div>
          
          {user.lastActive && (
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Last active {new Date(user.lastActive).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default ProfileHeader;
