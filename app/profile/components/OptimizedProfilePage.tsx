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
import { ExtendedUser } from "./types";
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

  const handleQuickAction = async (actionId: string) => {
    // TODO: Implement quick actions
    addToast("Quick actions coming soon!", "info");
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
          // Unknown action - no operation
          break;
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleLoadMore = async () => {
    await loadMoreItems(activeTab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Profile */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            {/* Profile Header */}
            <ProfileHeader
              user={profileData?.user || currentUser as ExtendedUser}
              isOwner={isOwner}
              onEditProfile={handleEditProfile}
              onMessageUser={handleMessageUser}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Sidebar - Stats & Quick Actions */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            {/* Profile Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Your Statistics
              </h3>
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
                compact={true}
              />
            </motion.div>

            {/* Quick Actions for Owner */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
              >
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Quick Actions
                </h3>
                <ProfileQuickActions
                  onAction={handleQuickAction}
                  loading={loading}
                />
              </motion.div>
            )}

            {/* Marketplace Tips - Hidden on mobile for space */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Marketplace Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 font-medium">•</span>
                  Add high-quality photos to sell faster
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 font-medium">•</span>
                  Respond quickly to increase your rating
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 font-medium">•</span>
                  Be active to build trust with buyers
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Content Area - Items */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              {/* Profile Navigation Tabs */}
              <div className="border-b border-gray-200 px-4 lg:px-6 pt-4 lg:pt-6">
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
              </div>

              {/* Profile Content */}
              <div className="p-4 lg:p-6">
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedProfilePage;
