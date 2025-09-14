'use client';

import { ArrowLeft, Heart, Flag, Share, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { ANIMATION_SYSTEM } from '../../../../lib/design-system';
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
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000, 
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
      className={`design-card sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100/50 px-4 py-3 flex items-center justify-between z-50 shadow-sm hover:shadow-md transition-all ${className}`}
      style={{
        transitionDuration: ANIMATION_SYSTEM.durationString.normal,
        transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
      }}
    >
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="design-card p-2 -ml-2 hover:bg-gray-100/80 rounded-full transition-all border border-transparent hover:border-gray-200/50"
        style={{
          transitionDuration: ANIMATION_SYSTEM.durationString.normal,
          transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
        }}
        aria-label="Go back"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
      >
        <ArrowLeft size={20} className="text-gray-700 transition-colors" 
                   style={{
                     transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                     transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                   }} />
      </motion.button>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {/* Share Button */}
        <motion.button
          onClick={onShareClick}
          className="design-card p-2 hover:bg-gray-100/80 rounded-full transition-all border border-transparent hover:border-gray-200/50"
          style={{
            transitionDuration: ANIMATION_SYSTEM.durationString.normal,
            transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
          }}
          aria-label="Share item"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
        >
          <Share size={18} className="text-gray-600 hover:text-[#009F9C] transition-colors"
                 style={{
                   transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                   transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                 }} />
        </motion.button>

        {/* Favorite Button - Hidden for user's own items */}
        {!isOwnItem && (
          <motion.button
            onClick={handleFavoriteClick}
            disabled={isLoading.favorite}
            className={`design-card p-2 hover:bg-gray-100/80 rounded-full transition-all border border-transparent hover:border-gray-200/50 ${
              isLoading.favorite ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              transitionDuration: ANIMATION_SYSTEM.durationString.normal,
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            whileHover={{ scale: isLoading.favorite ? 1 : 1.05 }}
            whileTap={{ scale: isLoading.favorite ? 1 : 0.95 }}
            transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
          >
            {isLoading.favorite ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#009F9C] rounded-full animate-spin" />
            ) : (
              <Heart
                size={18}
                className={`transition-all ${
                  isFavorited 
                    ? 'fill-red-500 text-red-500 scale-110' 
                    : 'text-gray-600 hover:text-red-400'
                }`}
                style={{
                  transitionDuration: ANIMATION_SYSTEM.durationString.normal,
                  transitionTimingFunction: ANIMATION_SYSTEM.easing.bounce
                }}
              />
            )}
          </motion.button>
        )}
        
        {/* Report Button - Hidden for user's own items */}
        {!isOwnItem && (
          <motion.button
            onClick={onReportClick}
            className="design-card p-2 hover:bg-gray-100/80 rounded-full transition-all border border-transparent hover:border-gray-200/50"
            style={{
              transitionDuration: ANIMATION_SYSTEM.durationString.normal,
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
            }}
            aria-label="Report listing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
          >
            <Flag size={18} className="text-gray-600 hover:text-red-500 transition-colors"
                  style={{
                    transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                    transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                  }} />
          </motion.button>
        )}

        {/* More Options for Own Items */}
        {isOwnItem && (
          <motion.button
            onClick={() => {
              // Handle more options for own items (edit, delete, etc.)
              // TODO: Implement edit/delete functionality
            }}
            className="design-card p-2 hover:bg-gray-100/80 rounded-full transition-all border border-transparent hover:border-gray-200/50"
            style={{
              transitionDuration: ANIMATION_SYSTEM.durationString.normal,
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
            }}
            aria-label="More options"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: ANIMATION_SYSTEM.duration.fast / 1000 }}
          >
            <MoreHorizontal size={18} className="text-gray-600 hover:text-[#009F9C] transition-colors"
                             style={{
                               transitionDuration: ANIMATION_SYSTEM.durationString.fast,
                               transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                             }} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
