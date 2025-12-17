"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getItemImageUrlWithSize } from '@/lib/imageUtils';
import { getSafeImageUrl, DEFAULT_IMAGE_PLACEHOLDER } from '@/lib/urlUtils';
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
  /** Called before navigating to item detail (for scroll restoration). Receives current scrollY. */
  onItemClick?: (scrollY: number) => void;
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
    const config =
      CATEGORY_CONFIG[category.toLowerCase() as keyof typeof CATEGORY_CONFIG];
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

export default function ItemCard({
  item,
  onToggleFavorite,
  priority = false,
  layout = "desktop",
  onItemClick,
}: ItemCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useUser();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
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

    // Capture scroll position IMMEDIATELY before anything else
    // Note: The app uses a scrollable <main> container, not window scroll
    const scrollContainer = document.querySelector('main.overflow-y-auto') || document.documentElement;
    const currentScrollY = scrollContainer.scrollTop || window.scrollY;
    console.log('🎯 [ItemCard] Captured scrollY:', currentScrollY, 'from:', scrollContainer.tagName);

    // Save scroll position before navigating (for scroll restoration on back)
    onItemClick?.(currentScrollY);

    // Use instant navigation without loading state for better UX
    try {
      router.push(`/item/${item.id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const getSellerName = () => {
    if (item.anonymous) return "Anonymous";
    return item.seller?.fullName || "Unknown";
  };

  const getImageUrl = () => {
    // Use the new size-aware function (small size for card thumbnails)
    const imageUrl = getItemImageUrlWithSize(item, "small");
    return imageUrl;
  };

  return (
    <>
      <div onClick={handleCardClick} className="block group cursor-pointer">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
          {/* Image Section - Fixed aspect ratio for grid layout */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            {getImageUrl() ? (
              <Image
                src={getImageUrl()!}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                placeholder="blur"
                blurDataURL={DEFAULT_IMAGE_PLACEHOLDER}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* Condition Badge - Top right */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 rounded-full">
                {item.condition}
              </span>
            </div>

            {/* Featured Badge - Top left */}
            {item.featured && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ⭐ Featured
              </div>
            )}

            {/* Sold Badge */}
            {item.isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-red-500 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>SOLD</span>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4">
            {/* Title and Price - Aligned on desktop, stacked on mobile */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1">
              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-teal-600 transition-colors md:flex-1 md:mr-2">
                {item.title}
              </h3>
              
              {/* Price */}
              <div className="text-2xl font-bold text-teal-600 md:flex-shrink-0">
                {item.price} <span className="text-sm font-normal text-gray-500">DH</span>
              </div>
            </div>
            
            {/* Footer - Location and Seller */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{item.location || 'UM6P'}</span>
              </div>
              <div className="font-medium text-gray-600 truncate max-w-[50%]">{getSellerName()}</div>
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
