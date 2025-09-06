"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, CheckCircle, MoreVertical, Flag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Item } from "../types";
import { useFavorites } from "../contexts/FavoritesContext";
import { useUser } from "../contexts/UserContext";
import { getItemImageUrl, PLACEHOLDER_IMAGE } from "../lib/imageUtils";
import ReportModal from "./ReportModal";

interface ItemCardProps {
  item: Item;
  onToggleFavorite?: (itemId: string) => void;
  priority?: boolean;
}

export default function ItemCard({ item, onToggleFavorite, priority = false }: ItemCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isItemFavorite = isFavorite(String(item.id));
  
  // Check if this is the user's own item
  const isOwnItem = user && (
    String(user.id) === String(item.sellerId) || 
    String(user.id) === String(item.seller?.id)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isItemFavorite) {
        await removeFromFavorites(String(item.id));
      } else {
        await addToFavorites(String(item.id));
      }
      
      // Call optional callback
      onToggleFavorite?.(String(item.id));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    setShowReportModal(true);
  };

  return (
    <>
      <Link href={`/item/${item.id}`} className="block group">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:scale-[1.02]">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={getItemImageUrl(item)}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e: any) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />

          {/* Price Overlay */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-semibold">
            {typeof item.price === 'string' 
              ? `${parseFloat(item.price)} DH`
              : `${item.price} DH`
            }
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {/* Favorite Button - Hidden for user's own items */}
            {!isOwnItem && (
              <button
                onClick={handleFavoriteClick}
                className={`p-1.5 rounded-full transition-colors ${
                  isItemFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-black/70 text-white hover:bg-red-500'
                }`}
                aria-label={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  size={16} 
                  fill={isItemFavorite ? 'currentColor' : 'none'} 
                />
              </button>
            )}

            {/* More Actions Menu - Hidden for user's own items */}
            {!isOwnItem && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleMoreClick}
                  className="p-1.5 rounded-full bg-black/70 text-white hover:bg-gray-600 transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={handleReportClick}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Flag size={14} className="text-red-500" />
                      Report Item
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sold Badge */}
          {item.isSold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                <CheckCircle size={16} />
                <span className="text-sm font-semibold">SOLD</span>
              </div>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
            {item.title}
          </h3>
          
          {/* Category Badge */}
          <div className="mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {typeof item.category === 'object' ? (
                <>
                  <span className="mr-1">{item.category.icon}</span>
                  {item.category.name}
                </>
              ) : (
                item.category
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {item.condition}
            </span>
            
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              {!item.anonymous && item.seller?.fullName && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const sellerId = item.seller?.id || item.sellerId;
                    if (sellerId) {
                      window.location.href = `/user/${sellerId}`;
                    }
                  }}
                  className="truncate hover:text-[#006666] transition-colors"
                >
                  {item.seller.fullName.split(" ")[0]}
                </button>
              )}
              {item.anonymous && (
                <span className="text-gray-500 italic font-semibold bg-gray-100 px-2 py-1 rounded">
                  🕶️ Anonymous Seller
                </span>
              )}
              {!item.anonymous && (item.seller?.isVerified || item.seller?.verified) && (
                <CheckCircle size={12} className="text-[#006666]" />
              )}
            </div>
          </div>
        </div>
      </div>
      </Link>

      {/* Report Modal - Moved outside Link to prevent event bubbling */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        itemId={String(item.id)}
        itemTitle={item.title}
      />
    </>
  );
}
