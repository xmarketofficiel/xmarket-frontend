"use client";

import { useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Share2, Flag, MessageCircle } from "lucide-react";
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

export default function ItemDetail({
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
        openWhatsApp();

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



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" style={{ minHeight: '-webkit-fill-available' }}>
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Mobile only */}
      <div className="lg:hidden relative z-10">
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
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block relative z-10">
        {/* Desktop Header - Enhanced with glassmorphism */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              className="group flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md"
            >
              <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">Back to listings</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFavoriteClick}
                disabled={state.loading.favorite}
                className={`p-3.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                  isItemFavorite
                    ? 'bg-gradient-to-br from-red-50 to-pink-50 text-red-600 shadow-md shadow-red-100'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200 hover:shadow-md'
                }`}
              >
                <Heart size={20} className={`${isItemFavorite ? 'fill-current animate-pulse' : ''} transition-all`} />
              </button>
              <button
                onClick={handleShareClick}
                className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md shadow-blue-100"
              >
                <Share2 size={20} />
              </button>
              {!isOwnItem && (
                <button
                  onClick={handleReportClick}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 text-orange-600 hover:from-orange-100 hover:to-amber-100 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-md shadow-orange-100"
                >
                  <Flag size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Main Content - Enhanced with animations */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* Left Column - Gallery - Full size like Facebook Marketplace */}
            <div className="animate-fade-in">
              <ItemGallery
                images={photos}
                title={item.title}
                isFeatured={item.featured}
                onImageClick={handleImageClick}
              />
            </div>

            {/* Right Column - Description & Seller Info */}
            <div className="animate-fade-in-delay">
              <div className="sticky top-24 space-y-4">
                {/* Item Info - Description */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <ItemInfo item={item} />
                </div>
                
                {/* Seller Card - Hidden for own items */}
                {!isOwnItem && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <SellerCard
                      seller={item.seller}
                      isAnonymous={item.anonymous}
                      isOwnItem={!!isOwnItem}
                      onMessageClick={openWhatsApp}
                      onViewProfile={handleViewProfile}
                    />
                  </div>
                )}
                
                {/* Quick Actions Card with premium design */}
                {!isOwnItem && (
                  <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl p-[1px] hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
                    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <span className="text-white text-xl">⚡</span>
                        </div>
                        <h3 className="ml-3 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Quick Actions
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          { icon: '🔒', text: 'Safe and secure messaging' },
                          { icon: '✓', text: 'Verified seller information' },
                          { icon: '⚡', text: 'Fast response time' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start group/item">
                            <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-sm group-hover/item:scale-110 transition-transform">
                              {item.icon}
                            </div>
                            <span className="ml-3 text-sm text-gray-700 font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust Badge - Hidden for own items */}
                {!isOwnItem && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 shadow-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-xs font-bold text-emerald-700">Verified Listing</p>
                        <p className="text-xs text-emerald-600">Safe to browse</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Enhanced with premium design */}
      <div className="lg:hidden relative z-0">
        {/* Photo Gallery with premium styling */}
        <div className="bg-white shadow-lg">
          <ItemGallery
            images={photos}
            title={item.title}
            isFeatured={item.featured}
            onImageClick={handleImageClick}
          />
        </div>

        {/* Content Container */}
        <div className="pb-32 bg-gradient-to-b from-gray-50 to-white">
          {/* Item Information with enhanced card */}
          <div className="bg-white shadow-lg relative">
            <ItemInfo item={item} />
          </div>

          {/* Seller Card with premium styling - Hidden for own items */}
          {!isOwnItem && (
            <div className="px-4 md:px-6 mt-6">
              <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 relative z-0">
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <SellerCard
                    seller={item.seller}
                    isAnonymous={item.anonymous}
                    isOwnItem={!!isOwnItem}
                    onMessageClick={openWhatsApp}
                    onViewProfile={handleViewProfile}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Safety Tips Card - Mobile with premium gradient */}
          {!isOwnItem && (
            <div className="px-4 md:px-6 mt-4">
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-[1px] overflow-hidden">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-sm">💡</span>
                    </div>
                    <h3 className="ml-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Safety Tips
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      'Meet in a safe, public location',
                      'Check the item before payment',
                      'Never share personal banking details'
                    ].map((tip, index) => (
                      <li key={index} className="flex items-start text-xs text-gray-700">
                        <div className="w-5 h-5 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-500 font-bold mr-2 flex-shrink-0">
                          ✓
                        </div>
                        <span className="font-medium pt-0.5">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Trust Badge - Mobile - Hidden for own items */}
          {!isOwnItem && (
            <div className="px-4 md:px-6 mt-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 shadow-md">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <span className="text-white">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-emerald-700">Verified Listing</p>
                    <p className="text-xs text-emerald-600">Safe to browse and purchase</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Action Buttons */}
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
      </div>

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
