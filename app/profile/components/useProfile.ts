"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../../contexts/UserContext";
import { useToast } from "../../../contexts/ToastContext";
import { api } from "../../../lib/apiEndpoints";
import { PROFILE_CONSTANTS } from "./constants";
import type {
  ExtendedUser,
  ProfileData,
  ProfileTab,
  ProfileItem,
  ProfileEditForm,
  UseProfileReturn,
  ProfileError,
  ProfileLoadingState,
} from "./types";

export const useProfile = (userId?: string): UseProfileReturn => {
  const { user: currentUser, refreshUser } = useUser();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<ProfileLoadingState>({
    profile: true,
    items: false,
    stats: false,
    activities: false,
    notifications: false,
    actions: {},
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("my-items");

  const isOwner = !userId || userId === currentUser?.id;
  // For now, fallback to user 1 for testing. In production, this should redirect to login
  const targetUserId = userId || currentUser?.id || 1;

  // Analytics tracking
  const trackAnalytics = useCallback(
    (event: string, metadata?: any) => {
      if (typeof window !== "undefined") {
        // Track analytics event
        
      }
    },
    [targetUserId]
  );

  // Error handling
  const handleError = useCallback(
    (error: any, context: string) => {
      console.error(`Profile error in ${context}:`, error);

      let errorMessage = "An unexpected error occurred";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 404) {
        errorMessage = "Profile not found";
      } else if (error.status === 403) {
        errorMessage = "Access denied";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Please try again later";
      }

      setError(errorMessage);
      addToast(errorMessage, "error");
      trackAnalytics("profile_error", { context, error: errorMessage });
    },
    [addToast, trackAnalytics]
  );

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!targetUserId) return;

    setLoading((prev) => ({ ...prev, profile: true }));
    setError(null);

    try {
      // Load user profile with stats
      let userResponse;
      try {
        userResponse = await api.users.getUserProfile(String(targetUserId));
      } catch (profileError: any) {
        console.warn('getUserProfile failed, falling back to getUser:', profileError);
        // Fallback to basic user data if getUserProfile fails
        userResponse = await api.users.getUser(String(targetUserId));
      }

      if (userResponse.data) {
        const userData = (userResponse.data as any).user || userResponse.data;
        const statsData = (userResponse.data as any).stats || {};
        // Don't pre-populate items - let loadTabItems handle fetching active items

        const newProfileData: ProfileData = {
          user: {
            ...userData,
            averageRating: typeof userData.averageRating === 'string' 
              ? parseFloat(userData.averageRating) 
              : userData.averageRating || 0,
          } as ExtendedUser,
          stats: {
            activeListingsCount: (statsData as any).activeListingsCount || 0,
            soldItemsCount:
              (statsData as any).soldItemsCount || statsData.totalSold || 0,
            purchaseHistoryCount:
              (statsData as any).purchaseHistoryCount || statsData.totalBought || 0,
            savedItemsCount: (statsData as any).savedItemsCount || 0,
            pendingSalesCount: (statsData as any).pendingSalesCount || 0,
            viewedItemsCount: (statsData as any).viewedItemsCount || 0,
            notificationsCount: (statsData as any).notificationsCount || 0,
            totalEarnings:
              (statsData as any).totalEarnings || statsData.totalRevenue || 0,
            totalSpent: statsData.totalSpent || 0,
            averageRating: (statsData as any).averageRating || 0,
            responseTime: (statsData as any).responseTime || 0,
            successfulTransactions: (statsData as any).successfulTransactions || 0,
            profileViews: (statsData as any).profileViews || 0,
            totalViews: (statsData as any).totalViews || 0,
            conversionRate: (statsData as any).conversionRate || 0,
          },
          recentActivity: [],
          notifications: [],
          items: {},  // Start with empty items - will be loaded by loadTabItems
          pagination: {},  // Start with empty pagination
        };

        setProfileData(newProfileData);
        trackAnalytics("profile_loaded", { userId: targetUserId });
      }
    } catch (error) {
      handleError(error, "loadProfile");
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  }, [targetUserId, handleError, trackAnalytics]);

  // Load items for specific tab
  const loadTabItems = useCallback(
    async (tab: ProfileTab, page = 1) => {
      if (!targetUserId || !profileData) return;

      setLoading((prev) => ({ ...prev, items: true }));

      try {
        let response: any;
        const params = {
          page,
          limit: PROFILE_CONSTANTS.PAGINATION.ITEMS_PER_PAGE,
        };

        switch (tab) {
          case "my-items":
            response = await api.users.getUserItems(
              String(targetUserId),
              params
            );
            break;
          case "my-interests":
            // Use getFavorites instead of getSavedItems
            response = await api.items.getFavorites(params);
            break;
          case "pending-sales":
            response = await api.items.getPendingSales();
            break;
          case "purchase-history":
            // Mock response for purchase history (not implemented yet)
            response = {
              data: { items: [], total: 0, hasMore: false },
              status: 200,
            };
            break;
          case "sold-items":
            // Mock response for sold items (not implemented yet)
            response = {
              data: { items: [], total: 0, hasMore: false },
              status: 200,
            };
            break;
          case "viewed-items":
            // Mock response for viewed items (not implemented yet)
            response = {
              data: { items: [], total: 0, hasMore: false },
              status: 200,
            };
            break;
          case "notifications":
            response = await api.notifications.getNotifications(params);
            break;
          default:
            return;
        }

        if (response.data) {
          setProfileData((prev) => {
            if (!prev) return prev;

            // Handle different response structures for different tabs
            // Handle the new wrapped response format: {success: true, data: {...}}
            const responseData = response.data?.data || response.data || {};
            let itemsData;
            if (tab === 'my-items') {
              // getUserItems returns array directly or wrapped
              itemsData = Array.isArray(responseData) ? responseData : (responseData.items || responseData || []);
            } else {
              // Other endpoints might return {items: [...]} or {notifications: [...]}
              itemsData = responseData.items || responseData.notifications || [];
            }

            const newItems =
              page === 1
                ? itemsData
                : [
                    ...(prev.items[tab as keyof typeof prev.items] || []),
                    ...itemsData,
                  ];

            return {
              ...prev,
              items: {
                ...prev.items,
                [tab]: newItems,
              },
              pagination: {
                ...prev.pagination,
                [tab]: response.data.pagination || {
                  currentPage: page,
                  totalPages: Math.ceil(
                    (response.data.total || 0) /
                      PROFILE_CONSTANTS.PAGINATION.ITEMS_PER_PAGE
                  ),
                  totalItems: response.data.total || 0,
                  hasMore: response.data.hasMore || false,
                },
              },
            };
          });
          
          trackAnalytics("profile_tab_loaded", {
            tab,
            page,
            itemCount: tab === 'my-items' ? (response.data?.length || 0) : (response.data.items?.length || 0),
          });
        }
      } catch (error) {
        handleError(error, `loadTabItems:${tab}`);
      } finally {
        setLoading((prev) => ({ ...prev, items: false }));
      }
    },
    [targetUserId, profileData, handleError, trackAnalytics]
  );

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    await loadProfile();
    if (activeTab) {
      await loadTabItems(activeTab);
    }
  }, [loadProfile, loadTabItems, activeTab]);

  // Change active tab
  const handleSetActiveTab = useCallback(
    (tab: ProfileTab) => {
      setActiveTab(tab);
      trackAnalytics("profile_tab_changed", { tab });

      // Load items for new tab if not already loaded
      if (profileData && !profileData.items[tab as keyof typeof profileData.items]) {
        loadTabItems(tab);
      }
    },
    [profileData, loadTabItems, trackAnalytics]
  );

  // Load more items for current tab
  const loadMoreItems = useCallback(
    async (tab: ProfileTab) => {
      if (!profileData?.pagination[tab as keyof typeof profileData.pagination]) return;

      const pagination = profileData.pagination[tab as keyof typeof profileData.pagination];
      if (!pagination?.hasMore) return;

      await loadTabItems(tab, pagination.currentPage + 1);
    },
    [profileData, loadTabItems]
  );

  // Update profile
  const updateProfile = useCallback(
    async (data: Partial<ProfileEditForm>) => {
      if (!isOwner) {
        addToast("You can only edit your own profile", "error");
        return;
      }

      setLoading((prev) => ({
        ...prev,
        actions: { ...prev.actions, updateProfile: true },
      }));

      try {
        const response = await api.users.updateProfile(data);

        if (response.data) {
          await refreshUser();
          await loadProfile();
          addToast("Profile updated successfully", "success");
          trackAnalytics("profile_updated", {
            updatedFields: Object.keys(data),
          });
        }
      } catch (error) {
        handleError(error, "updateProfile");
      } finally {
        setLoading((prev) => ({
          ...prev,
          actions: { ...prev.actions, updateProfile: false },
        }));
      }
    },
    [isOwner, addToast, refreshUser, loadProfile, handleError, trackAnalytics]
  );

  // Delete item
  const deleteItem = useCallback(
    async (itemId: string) => {
      if (!isOwner) {
        addToast("You can only delete your own items", "error");
        return;
      }

      setLoading((prev) => ({
        ...prev,
        actions: { ...prev.actions, [`delete-${itemId}`]: true },
      }));

      try {
        await api.items.deleteItem(itemId);

        // Remove item from all tabs
        setProfileData((prev) => {
          if (!prev) return prev;

          const updatedItems = { ...prev.items };
          Object.keys(updatedItems).forEach((tabKey) => {
            const tab = tabKey as ProfileTab;
            const tabItems = updatedItems[tab as keyof typeof updatedItems];
            if (tabItems) {
              (updatedItems as any)[tab] = tabItems.filter((item: any) => item.id !== itemId);
            }
          });

          return {
            ...prev,
            items: updatedItems,
            stats: {
              ...prev.stats,
              activeListingsCount: Math.max(
                0,
                prev.stats.activeListingsCount - 1
              ),
            },
          };
        });

        addToast("Item deleted successfully", "success");
        trackAnalytics("item_deleted", { itemId });
      } catch (error) {
        handleError(error, "deleteItem");
      } finally {
        setLoading((prev) => ({
          ...prev,
          actions: { ...prev.actions, [`delete-${itemId}`]: false },
        }));
      }
    },
    [isOwner, addToast, handleError, trackAnalytics]
  );

  // Save item
  const saveItem = useCallback(
    async (itemId: string) => {
      setLoading((prev) => ({
        ...prev,
        actions: { ...prev.actions, [`save-${itemId}`]: true },
      }));

      try {
        await api.items.toggleFavorite(itemId);

        // Update saved items count
        setProfileData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            stats: {
              ...prev.stats,
              savedItemsCount: prev.stats.savedItemsCount + 1,
            },
          };
        });

        addToast("Item saved successfully", "success");
        trackAnalytics("item_saved", { itemId });
      } catch (error) {
        handleError(error, "saveItem");
      } finally {
        setLoading((prev) => ({
          ...prev,
          actions: { ...prev.actions, [`save-${itemId}`]: false },
        }));
      }
    },
    [handleError, trackAnalytics, addToast]
  );

  // Unsave item
  const unsaveItem = useCallback(
    async (itemId: string) => {
      setLoading((prev) => ({
        ...prev,
        actions: { ...prev.actions, [`unsave-${itemId}`]: true },
      }));

      try {
        await api.items.toggleFavorite(itemId);

        // Remove from saved items and update count
        setProfileData((prev) => {
          if (!prev) return prev;

          const updatedSavedItems =
            prev.items["my-interests"]?.filter((item) => item.id !== itemId) ||
            [];

          return {
            ...prev,
            items: {
              ...prev.items,
              "my-interests": updatedSavedItems,
            },
            stats: {
              ...prev.stats,
              savedItemsCount: Math.max(0, prev.stats.savedItemsCount - 1),
            },
          };
        });

        addToast("Item removed from saved items", "success");
        trackAnalytics("item_unsaved", { itemId });
      } catch (error) {
        handleError(error, "unsaveItem");
      } finally {
        setLoading((prev) => ({
          ...prev,
          actions: { ...prev.actions, [`unsave-${itemId}`]: false },
        }));
      }
    },
    [handleError, trackAnalytics, addToast]
  );

  // Load profile on mount and when user changes
  useEffect(() => {
    if (targetUserId) {
      loadProfile();
    }
  }, [targetUserId, loadProfile]);

  // Force load items for default tab when profile is first loaded
  useEffect(() => {
    if (profileData && !profileData.items['my-items']) {
      loadTabItems('my-items');
    }
  }, [profileData, loadTabItems]);

  // Load items for active tab when it changes
  useEffect(() => {
    if (profileData && activeTab && !profileData.items[activeTab as keyof typeof profileData.items]) {
      loadTabItems(activeTab);
    }
  }, [profileData, activeTab, loadTabItems]);

  return {
    profileData,
    loading: loading.profile || loading.items,
    error,
    activeTab,
    refreshProfile,
    setActiveTab: handleSetActiveTab,
    loadMoreItems,
    updateProfile,
    deleteItem,
    saveItem,
    unsaveItem,
  };
};
