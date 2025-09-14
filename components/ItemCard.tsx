"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  CheckCircle,
  MoreVertical,
  Flag,
  MapPin,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Item } from "../types";
import { useFavorites } from "../contexts/FavoritesContext";
import { useUser } from "../contexts/UserContext";
import ReportModal from "./ReportModal";
import { CATEGORY_CONFIG } from "../app/marketplace/constants";

interface ItemCardProps {
  item: Item;
  onToggleFavorite?: (itemId: string) => void;
  priority?: boolean;
  layout?: "mobile" | "desktop";
}

// Utility function to get category display name and protect against UIDs
const getCategoryDisplayName = (category: any): string => {
  if (!category) return "Other";

  // If category is a string
  if (typeof category === "string") {
    // Check if it's a UUID-like string (common UID pattern)
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(category)) {
      return "Other"; // Return default if it's a UID
    }

    // Check if it exists in CATEGORY_CONFIG
    const config = CATEGORY_CONFIG[category.toLowerCase() as keyof typeof CATEGORY_CONFIG];
    if (config) {
      return config.name;
    }

    // Capitalize first letter if it's a valid category name
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  // If category is an object with name property
  if (typeof category === "object" && category.name) {
    return category.name;
  }

  // Fallback
  return "Other";
};

// Utility function to get category icon
const getCategoryIcon = (category: any): string => {
  if (!category) return "📦";

  let categoryKey = "";
  if (typeof category === "string") {
    categoryKey = category.toLowerCase();
  } else if (typeof category === "object" && category.name) {
    categoryKey = category.name.toLowerCase();
  }

  const config = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG];
  return config?.icon || "📦";
};

interface ItemCardProps {
  item: Item;
  onToggleFavorite?: (itemId: string) => void;
  priority?: boolean;
  layout?: "mobile" | "desktop";
}

export default function ItemCard({
  item,
  onToggleFavorite,
  priority = false,
  layout = "desktop",
}: ItemCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useUser();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFavorited = isFavorite(String(item.id));

  // Check if this is the user's own item
  const isOwnItem =
    user &&
    (String(user.id) === String(item.sellerId) ||
      String(user.id) === String(item.seller?.id));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isFavorited) {
        await removeFromFavorites(String(item.id));
      } else {
        await addToFavorites(String(item.id));
      }

      onToggleFavorite?.(String(item.id));
    } catch (error) {
      console.error("Error toggling favorite:", error);
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

  const handleCardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    
    try {
      await router.push(`/item/${item.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  const getSellerName = () => {
    if (item.anonymous) return "Anonymous";
    return item.seller?.fullName?.split(" ")[0] || "Unknown";
  };

  const getImageUrl = () => {
    if (item.images && item.images.length > 0) {
      const firstImage = item.images[0];
      // Handle different image URL properties
      if (typeof firstImage === "string") {
        return firstImage;
      }
      if (typeof firstImage === "object" && firstImage !== null) {
        return (
          firstImage.imageUrl ||
          firstImage.cloudinaryUrl ||
          firstImage.spacesUrl ||
          firstImage.url
        );
      }
    }

    // Fallback to photos array if images doesn't work
    if (item.photos && item.photos.length > 0) {
      return item.photos[0];
    }

    return null;
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="block group cursor-pointer"
      >
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden ${
          isNavigating ? 'opacity-75 pointer-events-none' : ''
        }`}>
          {/* Loading overlay */}
          {isNavigating && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#009F9C] rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            </div>
          )}
          {/* Image Section */}
          <div className="relative aspect-square bg-gray-100">
            {getImageUrl() ? (
              <img
                src={getImageUrl()!}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg width="32" height="32" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Favorite Button - Enhanced with better visual feedback */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 border border-white/20"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
                }`} 
              />
            </button>

            {/* Sold Badge */}
            {item.isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 text-sm font-semibold shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>SOLD</span>
                </div>
              </div>
            )}

            {/* Category Badge - Enhanced with better contrast */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 shadow-md border border-white/20">
                <span>{getCategoryIcon(item.category)}</span>
                <span>{getCategoryDisplayName(item.category)}</span>
              </span>
            </div>

            {/* Price Badge - New feature for quick price visibility */}
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center px-2.5 py-1.5 bg-[#009F9C]/95 backdrop-blur-sm rounded-lg text-xs font-bold text-white shadow-md">
                {item.price} DH
              </span>
            </div>
          </div>

          {/* Content Section - Enhanced spacing and typography */}
          <div className="p-4 space-y-3">
            {/* Title with better line height */}
            <h3 className="font-semibold text-gray-900 text-base line-clamp-2 leading-snug group-hover:text-[#009F9C] transition-colors">
              {item.title}
            </h3>

            {/* Price and Condition - Reduced since price is on image */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Condition:</span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                  {item.condition}
                </span>
              </div>
            </div>

            {/* Seller Info - Enhanced layout */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                  <User className="w-3 h-3 text-gray-500" />
                </div>
                <span className="font-medium">{getSellerName()}</span>
                {!item.anonymous && item.seller?.isVerified && (
                  <CheckCircle className="w-4 h-4 ml-1 text-blue-500" />
                )}
              </div>
              
              {/* More Actions */}
              {!isOwnItem && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleMoreClick}
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      <button
                        onClick={handleReportClick}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Flag className="w-3 h-3 text-red-500" />
                        Report
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location - Enhanced with better icon */}
            <div className="flex items-center text-sm text-gray-500 pt-1 border-t border-gray-100">
              <MapPin className="w-4 h-4 mr-1 text-[#009F9C]" />
              <span>Campus</span>
            </div>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        itemId={String(item.id)}
        itemTitle={item.title}
      />
    </>
  );
}
