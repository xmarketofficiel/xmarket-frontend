'use client';

import { ArrowLeft, Heart, Flag, Share, MoreHorizontal } from 'lucide-react';

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
    <div 
      className={`sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50 shadow-sm transition-shadow duration-300 ${className}`}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-all duration-200 border border-transparent hover:border-gray-200"
        aria-label="Go back"
      >
        <ArrowLeft size={20} className="text-gray-700 transition-colors duration-200" />
      </button>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {/* Share Button */}
        <button
          onClick={onShareClick}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
          aria-label="Share item"
        >
          <Share size={18} className="text-gray-600 hover:text-[#009F9C] transition-colors duration-200" />
        </button>

        {/* Favorite Button - Hidden for user's own items */}
        {!isOwnItem && (
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading.favorite}
            className={`p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 ${
              isLoading.favorite ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isLoading.favorite ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#009F9C] rounded-full animate-spin" />
            ) : (
              <Heart
                size={18}
                className={`transition-all duration-200 ${
                  isFavorited 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600 hover:text-red-400'
                }`}
              />
            )}
          </button>
        )}
        
        {/* Report Button - Hidden for user's own items */}
        {!isOwnItem && (
          <button
            onClick={onReportClick}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
            aria-label="Report listing"
          >
            <Flag size={18} className="text-gray-600 hover:text-red-500 transition-colors duration-200" />
          </button>
        )}

        {/* More Options for Own Items */}
        {isOwnItem && (
          <button
            onClick={() => {
              // Handle more options for own items (edit, delete, etc.)
              // TODO: Implement edit/delete functionality
            }}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
            aria-label="More options"
          >
            <MoreHorizontal size={18} className="text-gray-600 hover:text-[#009F9C] transition-colors duration-200" />
          </button>
        )}
      </div>
    </div>
  );
}
