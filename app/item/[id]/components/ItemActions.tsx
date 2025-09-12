'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Heart, Share, ShoppingCart } from 'lucide-react';
import { ACTION_BUTTONS } from '../constants';

interface ItemActionsProps {
  isOwnItem: boolean;
  isFavorited: boolean;
  onInterestClick: () => void;
  onFavoriteClick: () => void;
  onShareClick: () => void;
  isLoading?: {
    interest?: boolean;
    favorite?: boolean;
  };
  className?: string;
}

export default function ItemActions({
  isOwnItem,
  isFavorited,
  onInterestClick,
  onFavoriteClick,
  onShareClick,
  isLoading = {},
  className = ''
}: ItemActionsProps) {

  const handleInterestClick = () => {
    if (isLoading.interest) return;
    onInterestClick();
  };

  const handleFavoriteClick = () => {
    if (isLoading.favorite) return;
    onFavoriteClick();
  };

  if (isOwnItem) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 ${className}`}
      >
        <div className="w-full py-4 px-6 bg-gray-50 rounded-xl text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-gray-600 font-medium flex items-center justify-center space-x-2">
              <ShoppingCart size={18} />
              <span>This is your item</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              You can edit or manage it from your profile
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg ${className}`}
    >
      <div className="max-w-md mx-auto space-y-3">
        {/* Primary Action - Interest Button */}
        <motion.button
          onClick={handleInterestClick}
          disabled={isLoading.interest}
          className={`w-full ${ACTION_BUTTONS.interested.bgColor} ${ACTION_BUTTONS.interested.hoverColor} ${ACTION_BUTTONS.interested.textColor} py-4 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md ${
            isLoading.interest ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
          whileHover={!isLoading.interest ? { scale: 1.02 } : {}}
          whileTap={!isLoading.interest ? { scale: 0.98 } : {}}
        >
          {isLoading.interest ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{ACTION_BUTTONS.interested.loadingLabel}</span>
            </>
          ) : (
            <>
              <span className="text-lg">{ACTION_BUTTONS.interested.icon}</span>
              <span>{ACTION_BUTTONS.interested.label}</span>
            </>
          )}
        </motion.button>
        
        {/* Secondary Actions */}
        <div className="flex space-x-3">
          {/* Favorite Button */}
          <motion.button
            onClick={handleFavoriteClick}
            disabled={isLoading.favorite}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              isFavorited
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : `${ACTION_BUTTONS.favorite.bgColor} ${ACTION_BUTTONS.favorite.textColor} ${ACTION_BUTTONS.favorite.hoverColor} border border-gray-200`
            } ${isLoading.favorite ? 'opacity-75 cursor-not-allowed' : ''}`}
            whileHover={!isLoading.favorite ? { scale: 1.02 } : {}}
            whileTap={!isLoading.favorite ? { scale: 0.98 } : {}}
          >
            {isLoading.favorite ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Heart 
                  size={18} 
                  className={`transition-all duration-200 ${
                    isFavorited ? 'fill-current text-red-500' : ''
                  }`} 
                />
                <span>{isFavorited ? 'Saved' : 'Save'}</span>
              </>
            )}
          </motion.button>

          {/* Share Button */}
          <motion.button
            onClick={onShareClick}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${ACTION_BUTTONS.favorite.bgColor} ${ACTION_BUTTONS.favorite.textColor} ${ACTION_BUTTONS.favorite.hoverColor} border border-gray-200`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share size={18} />
            <span>Share</span>
          </motion.button>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xs text-gray-500">
            Express interest to start chatting with the seller
          </p>
        </motion.div>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-safe-bottom" />
    </motion.div>
  );
}
