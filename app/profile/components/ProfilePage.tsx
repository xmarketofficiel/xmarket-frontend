"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../../contexts/UserContext";
import { useToast } from "../../../contexts/ToastContext";
import { 
  User, 
  Edit3, 
  MapPin, 
  ShoppingBag, 
  Package, 
  Globe, 
  Bell, 
  MessageCircle, 
  HelpCircle, 
  Shield, 
  FileText, 
  ChevronRight,
  ArrowLeft,
  Heart,
  Clock,
  CheckCircle,
  Eye,
  Camera,
  LogOut
} from 'lucide-react';
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileContent from "./ProfileContent";
import { ExtendedUser } from "./types";
import { useProfile } from "./useProfile";
import { PROFILE_CONSTANTS } from "./constants";
import type { ProfileItem, ProfileTab } from "./types";

interface OptimizedProfilePageProps {
  userId?: string;
}

const OptimizedProfilePage: React.FC<OptimizedProfilePageProps> = ({
  userId,
}) => {
  const router = useRouter();
  const { user: currentUser, logout } = useUser();
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

  // State for navigation between profile main and sub-pages
  const [currentView, setCurrentView] = useState<'main' | ProfileTab>('main');

  const isOwner = !userId || userId === currentUser?.id;

  // Menu items for profile navigation
  const menuItems = [
    {
      id: 'my-items',
      title: 'My Listings',
      description: 'Manage your active items',
      icon: Package,
      count: profileData?.stats?.activeListingsCount || 0
    },
    {
      id: 'my-interests', 
      title: 'Saved Items',
      description: 'Items you\'ve saved for later',
      icon: Heart,
      count: profileData?.stats?.savedItemsCount || 0
    },
    {
      id: 'purchase-history',
      title: 'Order History', 
      description: 'View your past orders',
      icon: ShoppingBag,
      count: profileData?.stats?.purchaseHistoryCount || 0
    },
    {
      id: 'sold-items',
      title: 'Sold Items',
      description: 'Items you\'ve sold',
      icon: CheckCircle, 
      count: profileData?.stats?.soldItemsCount || 0
    },
    {
      id: 'pending-sales',
      title: 'Pending Sales',
      description: 'Sales awaiting completion',
      icon: Clock,
      count: profileData?.stats?.pendingSalesCount || 0
    },
    {
      id: 'viewed-items',
      title: 'Recently Viewed',
      description: 'Items you\'ve recently viewed', 
      icon: Eye,
      count: profileData?.stats?.viewedItemsCount || 0
    }
  ];

  // Settings menu items
  const settingsItems = [
    {
      id: 'address-book',
      title: 'Address Book',
      description: 'Manage your saved addresses',
      icon: MapPin
    },
    {
      id: 'language',
      title: 'Language', 
      description: 'English',
      icon: Globe
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification settings',
      icon: Bell
    }
  ];

  // Support menu items  
  const supportItems = [
    {
      id: 'contact-us',
      title: 'Contact Us',
      icon: MessageCircle
    },
    {
      id: 'get-help',
      title: 'Get Help',
      icon: HelpCircle
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      icon: Shield
    },
    {
      id: 'terms-conditions',
      title: 'Terms & Conditions', 
      icon: FileText
    },
    {
      id: 'logout',
      title: 'Log Out',
      icon: LogOut,
      isAction: true
    }
  ];

  // Handle user not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your profile.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Handle profile not found
  if (!loading && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profile not found
          </h2>
          <p className="text-gray-600 mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/marketplace")}
            className="px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-lg hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
          >
            Browse Marketplace
          </button>
        </div>
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

  const handleMenuItemClick = (itemId: string) => {
    // Handle logout specifically
    if (itemId === 'logout') {
      handleLogout();
      return;
    }
    
    // Route to separate pages for profile sections
    if (['purchase-history', 'sold-items', 'pending-sales'].includes(itemId)) {
      router.push(`/profile/${itemId}`);
      return;
    }
    
    // Available functionality that stays in current page (nested views)
    if (['my-items', 'my-interests'].includes(itemId)) {
      setActiveTab(itemId as ProfileTab);
      setCurrentView(itemId as ProfileTab);
    } else {
      // Coming soon items - these will be disabled with badges
      // Don't show toast, the button will be disabled
      return;
    }
  };

  // Define which items are coming soon
  const isComingSoon = (itemId: string) => {
    return ['viewed-items', 'privacy-settings', 'language', 'notifications', 'contact-us', 'get-help', 'privacy-policy', 'terms-conditions', 'address-book'].includes(itemId);
  };

  const handleBackToProfile = () => {
    setCurrentView('main');
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          
          addToast('Photo upload functionality coming soon!', 'info');
        } catch (error) {
          addToast('Failed to upload photo. Please try again.', 'error');
        }
      }
    };
    input.click();
  };

  const handleLogout = () => {
    // Call the logout function from user context
    logout?.();
    addToast('Logged out successfully', 'success');
    router.push('/');
  };

  const getViewTitle = (view: ProfileTab) => {
    const item = menuItems.find(item => item.id === view);
    return item?.title || 'Profile';
  };

  // Show loading state
  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render sub-page view
  if (currentView !== 'main') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with back button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToProfile}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {getViewTitle(currentView as ProfileTab)}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          <ProfileContent
            activeTab={currentView as ProfileTab}
            items={profileData?.items[currentView as ProfileTab] || []}
            loading={loading}
            error={error}
            onLoadMore={handleLoadMore}
            hasMore={profileData?.pagination[currentView as ProfileTab]?.hasMore || false}
            onItemClick={handleItemClick}
            onItemAction={handleItemAction}
          />
        </div>
      </div>
    );
  }

  // Main profile view
  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Profile Info Card - Simple Design */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-4">
              {/* Profile Image with Camera Icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                  {profileData?.user?.profileImageUrl || currentUser?.profileImageUrl ? (
                    <img
                      src={profileData?.user?.profileImageUrl || currentUser?.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>
                {isOwner && (
                  <button
                    onClick={handlePhotoUpload}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#009F9C] hover:bg-[#007A77] text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                    title="Upload photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {profileData?.user?.fullName || currentUser?.fullName}
                </h2>
                <p className="text-sm text-gray-500">
                  {profileData?.user?.email || currentUser?.email}
              </p>
            </div>
            {isOwner && (
              <button
                onClick={handleEditProfile}
                className="p-2 text-gray-400 hover:text-[#009F9C] transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Menu Items */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = isComingSoon(item.id);
            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && handleMenuItemClick(item.id)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-between p-4 transition-colors relative ${
                  isDisabled 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDisabled ? 'bg-gray-100' : 'bg-[#009F9C]/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isDisabled ? 'text-gray-400' : 'text-[#009F9C]'
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isDisabled && (
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {item.count > 0 && !isDisabled && (
                    <span className="px-2 py-1 text-xs font-medium bg-[#009F9C]/10 text-[#009F9C] rounded-full">
                      {item.count}
                    </span>
                  )}
                  {!isDisabled && <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200 mb-6">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = isComingSoon(item.id);
            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && handleMenuItemClick(item.id)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-between p-4 transition-colors ${
                  isDisabled 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDisabled ? 'bg-gray-100' : 'bg-[#009F9C]/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isDisabled ? 'text-gray-400' : 'text-[#009F9C]'
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isDisabled && (
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {!isDisabled && <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
          {supportItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = isComingSoon(item.id);
            const isLogout = item.id === 'logout';
            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && handleMenuItemClick(item.id)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-between p-4 transition-colors ${
                  isDisabled 
                    ? 'opacity-60 cursor-not-allowed' 
                    : isLogout
                    ? 'hover:bg-red-50 cursor-pointer'
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDisabled 
                      ? 'bg-gray-100' 
                      : isLogout
                      ? 'bg-red-50'
                      : 'bg-[#009F9C]/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isDisabled 
                        ? 'text-gray-400' 
                        : isLogout
                        ? 'text-red-500'
                        : 'text-[#009F9C]'
                    }`} />
                  </div>
                  <div className="text-left">
                    <div className={`font-semibold ${
                      isLogout ? 'text-red-600' : 'text-gray-900'
                    }`}>{item.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isDisabled && (
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {!isDisabled && <ChevronRight className={`w-5 h-5 ${
                    isLogout ? 'text-red-400' : 'text-gray-400'
                  }`} />}
                </div>
              </button>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedProfilePage;
