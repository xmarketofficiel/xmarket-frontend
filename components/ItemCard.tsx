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

    // Use instant navigation without loading state for better UX
    try {
      router.push(`/item/${item.id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const getSellerName = () => {
    if (item.anonymous) return "Anonymous";
    return item.seller?.fullName?.split(" ")[0] || "Unknown";
  };

  const getImageUrl = () => {
    // Use the new size-aware function (small size for card thumbnails)
    const imageUrl = getItemImageUrlWithSize(item, "small");
    return imageUrl;
  };

  return (
    <>
      <div onClick={handleCardClick} className="block group cursor-pointer">
        <div className="rounded-xl overflow-hidden">
          {/* Image Section - Fixed aspect ratio for grid layout */}
          <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
            {getImageUrl() ? (
              <Image
                src={getImageUrl()!}
                alt={item.title}
                fill
                className="object-cover"
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
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-700 rounded-md shadow-sm">
                {item.condition}
              </span>
            </div>

            {/* Favorite Button - Top left (only show for other users' items) */}
            {!isOwnItem && (
              <button
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all duration-200"
                aria-label={
                  isFavorited ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorited ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
                />
              </button>
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

          {/* Content Section - Simplified */}
          <div className="py-2 px-1 space-y-0.2">
            {/* Price - Facebook Marketplace style: Price first and prominent */}
            <div className="text-lg font-bold text-[#009F9C]">
              {item.price} DH
            </div>

            {/* Title - Below price, smaller */}
            <h3 className="font-normal text-gray-900 text-sm line-clamp-2 leading-tight">
              {item.title}
            </h3>
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
