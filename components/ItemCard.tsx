"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, CheckCircle, MoreVertical, Flag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Item } from "../types";
import { useFavorites } from "../contexts/FavoritesContext";
import { useUser } from "../contexts/UserContext";
import { getItemImageUrl, PLACEHOLDER_IMAGE } from "../lib/imageUtils";
import { ANIMATION_SYSTEM } from "../lib/design-system";
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
        <div 
          className="design-card bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 overflow-hidden hover:scale-[1.02]"
          style={{
            transition: `all ${ANIMATION_SYSTEM.duration.normal}ms ${ANIMATION_SYSTEM.easing.easeOut}`
          }}
        >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={getItemImageUrl(item)}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105"
            style={{
              transition: `transform ${ANIMATION_SYSTEM.duration.normal}ms ${ANIMATION_SYSTEM.easing.easeInOut}`
            }}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e: any) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />

          {/* Price Overlay */}
          <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-semibold backdrop-blur-sm">
            {typeof item.price === 'string' 
              ? `${parseFloat(item.price)} DH`
              : `${item.price} DH`
            }
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {/* For user's own items - Show edit button */}
            {isOwnItem ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleMoreClick}
                  className="p-2 rounded-full bg-black/80 text-white hover:bg-blue-600 transition-all backdrop-blur-sm"
                  style={{
                    transition: `all ${ANIMATION_SYSTEM.duration.fast}ms ${ANIMATION_SYSTEM.easing.easeInOut}`
                  }}
                  aria-label="Edit item"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown Menu for own items */}
                {showDropdown && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20"
                    style={{
                      animation: `${ANIMATION_SYSTEM.duration.fast}ms ${ANIMATION_SYSTEM.easing.easeOut} both`
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDropdown(false);
                        window.location.href = `/item/${item.id}/edit`;
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit Item
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Favorite Button - For other users' items */}
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                    isItemFavorite 
                      ? 'bg-red-500 text-white scale-110' 
                      : 'bg-black/80 text-white hover:bg-red-500'
                  }`}
                  style={{
                    transition: `all ${ANIMATION_SYSTEM.duration.fast}ms ${ANIMATION_SYSTEM.easing.easeInOut}`
                  }}
                  aria-label={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    size={16} 
                    fill={isItemFavorite ? 'currentColor' : 'none'} 
                  />
                </button>

                {/* More Actions Menu - For other users' items */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleMoreClick}
                    className="p-2 rounded-full bg-black/80 text-white hover:bg-gray-600 transition-all backdrop-blur-sm"
                    style={{
                      transition: `all ${ANIMATION_SYSTEM.duration.fast}ms ${ANIMATION_SYSTEM.easing.easeInOut}`
                    }}
                    aria-label="More options"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20"
                      style={{
                        animation: `${ANIMATION_SYSTEM.duration.fast}ms ${ANIMATION_SYSTEM.easing.easeOut} both`
                      }}
                    >
                      <button
                        onClick={handleReportClick}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Flag size={14} className="text-red-500" />
                        Report Item
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sold Badge */}
          {item.isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                <CheckCircle size={18} />
                <span className="text-sm font-semibold">SOLD</span>
              </div>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="p-4 space-y-3">
          <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">
            {item.title}
          </h3>
          
          {/* Category Badge */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
              {typeof item.category === 'object' ? (
                <>
                  <span className="mr-1.5">{item.category.icon}</span>
                  {item.category.name}
                </>
              ) : (
                item.category
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              {item.condition}
            </span>
            
            <div className="flex items-center space-x-1.5 text-xs">
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
                  className="text-gray-600 hover:text-[#009F9C] font-medium transition-colors truncate"
                  style={{
                    transition: `color ${ANIMATION_SYSTEM.duration.fast}ms ${ANIMATION_SYSTEM.easing.easeInOut}`
                  }}
                >
                  {item.seller.fullName.split(" ")[0]}
                </button>
              )}
              {item.anonymous && (
                <span className="text-gray-500 italic font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                  🕶️ Anonymous
                </span>
              )}
              {!item.anonymous && (item.seller?.isVerified || item.seller?.verified) && (
                <CheckCircle size={14} className="text-[#009F9C]" />
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
