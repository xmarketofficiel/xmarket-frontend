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
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-12">
            <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse border-4 border-white" />
            <div className="flex-1 mt-12 space-y-3">
              <div className="h-6 bg-gray-300 rounded w-48 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
              <div className="h-4 bg-gray-300 rounded w-64 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.HEADER }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-[#009F9C] to-[#007A77] relative">
        {user.coverImage && (
          <img
            src={getSafeImageUrl(user.coverImage)}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#009F9C]/80 to-[#007A77]/80" />
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        <div className="flex items-start gap-6 -mt-12 relative">
          {/* Profile Picture */}
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
              {hasProfileImage ? (
                <img
                  src={getSafeImageUrl(profileImageUrl)}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-br from-[#009F9C] to-[#007A77] flex items-center justify-center ${hasProfileImage ? 'hidden' : ''}`}>
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
            
            {/* Activity Status */}
            {user.lastActive && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 mt-12">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.fullName}
                  </h1>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-sm"
                    title={getVerificationText()}
                  >
                    {getVerificationIcon()}
                  </motion.div>
                </div>

                {/* User Rating */}
                {user.averageRating && user.averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {user.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      • {user.responseTime ? `${user.responseTime}h response time` : 'New seller'}
                    </span>
                  </div>
                )}

                {/* Location and Join Date */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.joinedDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-700 max-w-md leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                {isOwner ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEditProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-[#009F9C] text-white rounded-lg hover:bg-[#007A77] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onMessageUser}
                    className="flex items-center gap-2 px-4 py-2 bg-[#009F9C] text-white rounded-lg hover:bg-[#007A77] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Bar */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              {user.activityScore && (
                <div>
                  Activity Score: <span className="font-medium text-gray-900">{user.activityScore}%</span>
                </div>
              )}
              {user.preferredCategories && user.preferredCategories.length > 0 && (
                <div>
                  Interests: <span className="font-medium text-gray-900">{user.preferredCategories.slice(0, 3).join(', ')}</span>
                  {user.preferredCategories.length > 3 && (
                    <span className="text-gray-500"> +{user.preferredCategories.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
            
            {user.lastActive && (
              <div className="text-xs text-gray-500">
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
