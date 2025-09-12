"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "../../../contexts/UserContext";
import { useToast } from "../../../contexts/ToastContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import ProfileContent from "./ProfileContent";
import ProfileQuickActions from "./ProfileQuickActions";
import { useProfile } from "./useProfile";
import { PROFILE_CONSTANTS } from "./constants";
import type { ProfileItem } from "./types";

interface OptimizedProfilePageProps {
  userId?: string;
}

const OptimizedProfilePage: React.FC<OptimizedProfilePageProps> = ({
  userId,
}) => {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { addToast } = useToast();

  const {
    profileData,
    loading,
    error,
    activeTab,
    refreshProfile,
    setActiveTab,
    loadMoreItems,
    updateProfile,
    deleteItem,
    saveItem,
    unsaveItem,
  } = useProfile(userId);

  const isOwner = !userId || userId === currentUser?.id;

  // Handle user not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your profile.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Handle profile not found
  if (!loading && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profile not found
          </h2>
          <p className="text-gray-600 mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/marketplace")}
            className="px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
          >
            Browse Marketplace
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Event handlers
  const handleEditProfile = () => {
    router.push("/settings/profile");
  };

  const handleMessageUser = () => {
    // Implement messaging functionality
    addToast("Messaging feature coming soon!", "info");
  };

  const handleQuickAction = (actionId: string) => {
    console.log("Quick action:", actionId);
    // Actions are handled by the component's navigation
  };

  const handleItemClick = (item: ProfileItem) => {
    router.push(`/item/${item.id}`);
  };

  const handleItemAction = async (action: string, item: ProfileItem) => {
    try {
      switch (action) {
        case "edit":
          router.push(`/item/${item.id}/edit`);
          break;
        case "delete":
          if (window.confirm("Are you sure you want to delete this item?")) {
            await deleteItem(item.id);
          }
          break;
        case "save":
          await saveItem(item.id);
          break;
        case "unsave":
          await unsaveItem(item.id);
          break;
        default:
          console.log("Unknown action:", action);
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleLoadMore = async () => {
    await loadMoreItems(activeTab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeader
            user={profileData?.user || currentUser}
            isOwner={isOwner}
            onEditProfile={handleEditProfile}
            onMessageUser={handleMessageUser}
            loading={loading}
          />

          {/* Profile Stats */}
          <ProfileStats
            stats={
              profileData?.stats || {
                activeListingsCount: 0,
                soldItemsCount: 0,
                purchaseHistoryCount: 0,
                savedItemsCount: 0,
                pendingSalesCount: 0,
                viewedItemsCount: 0,
                notificationsCount: 0,
                totalEarnings: 0,
                totalSpent: 0,
                averageRating: 0,
                responseTime: 0,
                successfulTransactions: 0,
                profileViews: 0,
                totalViews: 0,
                conversionRate: 0,
              }
            }
            loading={loading}
          />

          {/* Quick Actions for Owner */}
          {isOwner && (
            <ProfileQuickActions
              onAction={handleQuickAction}
              loading={loading}
            />
          )}

          {/* Profile Navigation Tabs */}
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stats={
              profileData?.stats || {
                activeListingsCount: 0,
                soldItemsCount: 0,
                purchaseHistoryCount: 0,
                savedItemsCount: 0,
                pendingSalesCount: 0,
                viewedItemsCount: 0,
                notificationsCount: 0,
                totalEarnings: 0,
                totalSpent: 0,
                averageRating: 0,
                responseTime: 0,
                successfulTransactions: 0,
                profileViews: 0,
                totalViews: 0,
                conversionRate: 0,
              }
            }
            loading={loading}
          />

          {/* Profile Content */}
          <ProfileContent
            activeTab={activeTab}
            items={profileData?.items[activeTab] || []}
            loading={loading}
            error={error}
            onLoadMore={handleLoadMore}
            hasMore={profileData?.pagination[activeTab]?.hasMore || false}
            onItemClick={handleItemClick}
            onItemAction={handleItemAction}
          />
        </div>
      </div>
    </div>
  );
};

export default OptimizedProfilePage;
