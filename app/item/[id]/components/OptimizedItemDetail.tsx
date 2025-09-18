"use client";

import { useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../../../contexts/UserContext";
import { useFavorites } from "../../../../contexts/FavoritesContext";
import { useToast } from "../../../../contexts/ToastContext";
import { api } from "../../../../lib/apiEndpoints";
import { Item } from "../../../../types";

// Component imports
import ItemHeader from "./ItemHeader";
import ItemGallery from "./ItemGallery";
import ItemInfo from "./ItemInfo";
import SellerCard from "./SellerCard";
import ItemActions from "./ItemActions";
import ShareModal from "./ShareModal";
import LoadingSpinner from "./LoadingSpinner";
import ReportModal from "../../../../components/ReportModal";
import PurchaseConfirmationModal from "../../../../components/PurchaseConfirmationModal";

// Hooks and utilities
import { useItemDetail } from "../hooks/useItemDetail";
import { STATUS_MESSAGES, ANALYTICS_EVENTS } from "../constants";

interface OptimizedItemDetailProps {
  item: Item;
}

export default function OptimizedItemDetail({
  item,
}: OptimizedItemDetailProps) {
  const router = useRouter();
  const { user } = useUser();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToast } = useToast();

  // Custom hook for managing state
  const { state, actions } = useItemDetail({
    initialItem: item,
    onToast: addToast,
  });

  // Derived state
  const isItemFavorite = isFavorite(String(item.id));
  const isOwnItem =
    user &&
    (String(user.id) === String(item.sellerId) ||
      String(user.id) === String(item.seller?.id));

  // Process photos from multiple possible formats
  const photos = React.useMemo(() => {
    const processedPhotos = (
      item.photos ||
      item.images
        ?.map((img) => {
          const url = img.imageUrl;
          if (url && !url.includes("undefined") && url.startsWith("/")) {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');
            return `${baseUrl}${url}`;
          }
          return url;
        })
        .filter((url) => url && url.trim() !== '' && !url.includes('undefined')) ||
      []
    );
    
    // Remove duplicates and ensure unique array
    return Array.from(new Set(processedPhotos.filter(Boolean)));
  }, [item.photos, item.images]);

  // Analytics tracking
  useEffect(() => {
    // Track item view
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", ANALYTICS_EVENTS.ITEM_VIEWED, {
        item_id: item.id,
        item_title: item.title,
        item_category:
          typeof item.category === "object"
            ? item.category.name
            : item.category,
        item_price: item.price,
      });
    }
  }, [item]);

  // Event handlers
  const handleBack = () => {
    router.back();
  };

  const handleFavoriteClick = async () => {
    try {
      if (isItemFavorite) {
        await removeFromFavorites(String(item.id));
        addToast(STATUS_MESSAGES.success.unfavorite, "info");
      } else {
        await addToFavorites(String(item.id));
        addToast(STATUS_MESSAGES.success.favorite, "success");
      }

      // Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", ANALYTICS_EVENTS.FAVORITE_TOGGLED, {
          item_id: item.id,
          action: isItemFavorite ? "remove" : "add",
        });
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      addToast(STATUS_MESSAGES.error.favorite, "error");
    }
  };

  const handleInterestClick = () => {
    if (!user) {
      addToast(STATUS_MESSAGES.error.unauthorized, "error");
      return;
    }

    if (isOwnItem) {
      addToast(STATUS_MESSAGES.error.ownItem, "error");
      return;
    }

    // Show the purchase confirmation modal
    actions.openModal("purchase");
  };

  const handlePurchaseConfirmed = async () => {
    try {
      // Call the backend API to express interest
      const response = await api.items.expressInterest(
        String(item.id), 
        "I am interested in purchasing this item!"
      );

      if (response.data) {
        addToast(
          "Interest expressed! You will receive a confirmation request in your profile.",
          "success",
          5000
        );

        // Open WhatsApp automatically after expressing interest
        setTimeout(() => {
          openWhatsApp();
        }, 1000);

        // Analytics
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", ANALYTICS_EVENTS.INTEREST_ADDED, {
            item_id: item.id,
          });
        }
      }
    } catch (error: any) {
      console.error('Error expressing interest:', error);
      addToast(
        error.message || "Failed to express interest. Please try again.",
        "error"
      );
    }
  };

  const openWhatsApp = () => {
    if (!item.seller?.whatsappNumber) {
      addToast("Seller has no WhatsApp number available", "error");
      return;
    }

    const message = encodeURIComponent(
      `Hi! I'm interested in your item: ${item.title} (${item.price} DH)`
    );
    const whatsappNumber = item.seller.whatsappNumber.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    // Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", ANALYTICS_EVENTS.MESSAGE_INITIATED, {
        item_id: item.id,
        platform: "whatsapp",
      });
    }
  };

  const handleShareClick = () => {
    actions.openModal("share");
  };

  const handleReportClick = () => {
    actions.openModal("report");
  };

  const handleImageClick = (index: number) => {
    actions.openModal("imageViewer", index);
  };

  const handleViewProfile = () => {
    const sellerId = item.seller?.id || item.sellerId;
    if (sellerId) {
      router.push(`/user/${sellerId}`);
    }
  };

  // Loading state
  if (state.loading.item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text={STATUS_MESSAGES.loading.item} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ItemHeader
        onBack={handleBack}
        onFavoriteClick={handleFavoriteClick}
        onShareClick={handleShareClick}
        onReportClick={handleReportClick}
        isFavorited={isItemFavorite}
        isOwnItem={!!isOwnItem}
        isLoading={{
          favorite: state.loading.favorite,
        }}
      />

      {/* Photo Gallery */}
      <ItemGallery
        images={photos}
        title={item.title}
        isFeatured={item.featured}
        onImageClick={handleImageClick}
      />

      {/* Content Container */}
      <div className="pb-32">
        {/* Item Information */}
        <div className="bg-white">
          <ItemInfo item={item} />
        </div>

        {/* Seller Card */}
        <div className="px-4 md:px-6 mt-4">
          <SellerCard
            seller={item.seller}
            isAnonymous={item.anonymous}
            isOwnItem={!!isOwnItem}
            onMessageClick={openWhatsApp}
            onViewProfile={handleViewProfile}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <ItemActions
        isOwnItem={!!isOwnItem}
        isFavorited={isItemFavorite}
        onInterestClick={handleInterestClick}
        onFavoriteClick={handleFavoriteClick}
        onShareClick={handleShareClick}
        onMessageClick={openWhatsApp}
        isLoading={{
          interest: state.loading.interest,
          favorite: state.loading.favorite,
        }}
      />

      {/* Modals */}
      <ShareModal
        isOpen={state.modals.share}
        onClose={() => actions.closeModal("share")}
        item={item}
      />

      <ReportModal
        isOpen={state.modals.report}
        onClose={() => actions.closeModal("report")}
        itemId={String(item.id)}
        itemTitle={item.title}
      />

      <PurchaseConfirmationModal
        isOpen={state.modals.purchase}
        onClose={() => actions.closeModal("purchase")}
        item={{
          id: String(item.id),
          title: item.title,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          seller: {
            fullName: item.seller?.fullName || item.seller?.name || 'Unknown Seller',
            whatsappNumber: item.seller?.whatsappNumber
          }
        }}
        onConfirmed={handlePurchaseConfirmed}
      />
    </div>
  );
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}
