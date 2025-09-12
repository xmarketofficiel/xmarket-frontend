'use client';

import { ArrowLeft, Heart, Flag, Share, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { ACTION_BUTTONS } from '../constants';

interface ItemHeaderProps {
  onBack: () => void;
  onFavoriteClick: () => void;
  onShareClick: () => void;
  onReportClick: () => void;
  isFavorited: boolean;
  isOwnItem: boolean;
  isLoading?: {
    favorite?: boolean;
  };
  className?: string;
}

export default function ItemHeader({
  onBack,
  onFavoriteClick,
  onShareClick,
  onReportClick,
  isFavorited,
  isOwnItem,
  isLoading = {},
  className = ''
}: ItemHeaderProps) {

  const handleFavoriteClick = () => {
    if (isLoading.favorite) return;
    onFavoriteClick();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between z-50 ${className}`}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Go back"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} className="text-gray-700" />
      </motion.button>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {/* Share Button */}
        <motion.button
          onClick={onShareClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Share item"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share size={18} className="text-gray-600" />
        </motion.button>

        {/* Favorite Button - Hidden for user's own items */}
        {!isOwnItem && (
          <motion.button
            onClick={handleFavoriteClick}
            disabled={isLoading.favorite}
            className={`p-2 hover:bg-gray-100 rounded-full transition-all duration-200 ${
              isLoading.favorite ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            whileHover={{ scale: isLoading.favorite ? 1 : 1.05 }}
            whileTap={{ scale: isLoading.favorite ? 1 : 0.95 }}
          >
            {isLoading.favorite ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#009F9C] rounded-full animate-spin" />
            ) : (
              <Heart
                size={18}
                className={`transition-all duration-200 ${
                  isFavorited 
                    ? 'fill-red-500 text-red-500 scale-110' 
                    : 'text-gray-600 hover:text-red-400'
                }`}
              />
            )}
          </motion.button>
        )}
        
        {/* Report Button - Hidden for user's own items */}
        {!isOwnItem && (
          <motion.button
            onClick={onReportClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Report listing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Flag size={18} className="text-gray-600 hover:text-red-500 transition-colors" />
          </motion.button>
        )}

        {/* More Options for Own Items */}
        {isOwnItem && (
          <motion.button
            onClick={() => {
              // Handle more options for own items (edit, delete, etc.)
              console.log('More options for own item');
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="More options"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreHorizontal size={18} className="text-gray-600" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
