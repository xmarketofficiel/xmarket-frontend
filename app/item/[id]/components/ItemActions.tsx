'use client';

import { Share, ShoppingCart } from 'lucide-react';
import { ACTION_BUTTONS } from '../constants';

interface ItemActionsProps {
  isOwnItem: boolean;
  isFavorited: boolean;
  onInterestClick: () => void;
  onFavoriteClick: () => void;
  onShareClick: () => void;
  onMessageClick: () => void;
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
  onMessageClick,
  isLoading = {},
  className = ''
}: ItemActionsProps) {

  const handleInterestClick = () => {
    if (isLoading.interest) return;
    onMessageClick();
  };

  // Own item version - simple message bar
  if (isOwnItem) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 shadow-lg">
        <div className="flex items-center justify-center max-w-lg mx-auto h-full min-h-[4rem]">
          <div className="w-full py-3 px-6 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-600 font-medium flex items-center justify-center space-x-2">
              <ShoppingCart size={18} />
              <span>This is your item</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              You can edit or manage it from your profile
            </p>
          </div>
        </div>
      </nav>
    );
  }

  // Contact seller version - action buttons
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 shadow-lg">
      <div className="flex flex-col max-w-lg mx-auto min-h-[4rem] justify-center">
        {/* Action Buttons */}
        <div className="flex space-x-3 mb-2">
          {/* Contact Seller Button */}
          <button
            onClick={handleInterestClick}
            disabled={isLoading.interest}
            className={`flex-1 ${ACTION_BUTTONS.interested.bgColor} ${ACTION_BUTTONS.interested.hoverColor} ${ACTION_BUTTONS.interested.textColor} py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md ${
              isLoading.interest ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'
            }`}
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
          </button>

          {/* Share Button */}
          <button
            onClick={onShareClick}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${ACTION_BUTTONS.favorite.bgColor} ${ACTION_BUTTONS.favorite.textColor} ${ACTION_BUTTONS.favorite.hoverColor} border border-gray-200 hover:scale-[1.02] shadow-md`}
          >
            <Share size={18} />
            <span>Share</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Contact the seller directly via WhatsApp
          </p>
        </div>
      </div>
    </nav>
  );
}
