'use client';

import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, User, Star, Clock } from 'lucide-react';

interface SellerInfo {
  id?: string | number;
  name?: string;
  fullName?: string;
  program?: string;
  year?: string;
  isVerified?: boolean;
  verified?: boolean;
  rating?: number;
  responseTime?: string;
  whatsappNumber?: string;
}

interface SellerCardProps {
  seller: SellerInfo;
  isAnonymous?: boolean;
  isOwnItem?: boolean;
  onMessageClick: () => void;
  onViewProfile?: () => void;
  className?: string;
}

export default function SellerCard({
  seller,
  isAnonymous = false,
  isOwnItem = false,
  onMessageClick,
  onViewProfile,
  className = ''
}: SellerCardProps) {

  const getSellerName = () => {
    if (isAnonymous) return 'Anonymous Seller';
    return seller.fullName || seller.name || 'Unknown Seller';
  };

  const getSellerInitial = () => {
    if (isAnonymous) return '🕶️';
    const name = getSellerName();
    return name.charAt(0).toUpperCase();
  };

  const isVerified = seller.isVerified || seller.verified;

  const handleViewProfile = () => {
    if (onViewProfile && !isAnonymous && !isOwnItem) {
      onViewProfile();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`bg-gray-50 rounded-xl p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
          <User size={18} />
          <span>Seller</span>
        </h3>
        
        {!isOwnItem && !isAnonymous && onViewProfile && (
          <motion.button
            onClick={handleViewProfile}
            className="text-sm text-[#006666] hover:text-[#005555] font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Profile
          </motion.button>
        )}
      </div>

      {/* Seller Info */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <motion.div 
          className="w-12 h-12 bg-[#006666] rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {getSellerInitial()}
        </motion.div>
        
        {/* Details */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">
              {getSellerName()}
            </span>
            
            {!isAnonymous && isVerified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 500 }}
              >
                <CheckCircle size={16} className="text-[#006666]" />
              </motion.div>
            )}
            
            {isAnonymous && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
              >
                🕶️ Private
              </motion.span>
            )}
          </div>
          
          {!isAnonymous && (
            <div className="space-y-1">
              {/* Program and Year */}
              {(seller.program || seller.year) && (
                <div className="text-sm text-gray-600">
                  {seller.program} {seller.year && `• ${seller.year}`}
                </div>
              )}
              
              {/* Rating and Response Time */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {seller.rating && (
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span>{seller.rating.toFixed(1)}</span>
                  </div>
                )}
                
                {seller.responseTime && (
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>Responds in {seller.responseTime}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Message Button */}
        {!isOwnItem && (
          <motion.button
            onClick={onMessageClick}
            className="bg-[#006666] hover:bg-[#005555] text-white p-2 rounded-full transition-colors shadow-md"
            aria-label="Send message to seller"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={18} />
          </motion.button>
        )}
      </div>

      {/* Anonymous Seller Info */}
      {isAnonymous && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
        >
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 mt-0.5">ℹ️</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Private Listing</p>
              <p className="text-xs">This seller has chosen to remain anonymous. You can still contact them through our secure messaging system.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Own Item Notice */}
      {isOwnItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100"
        >
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">This is your listing</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            You can edit or manage this item from your profile
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
