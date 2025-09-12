'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { api } from '../../../lib/apiEndpoints';
import { PROFILE_CONSTANTS } from './constants';
import type {
  ProfileData,
  ProfileTab,
  ProfileItem,
  ProfileEditForm,
  UseProfileReturn,
  ProfileError,
  ProfileLoadingState
} from './types';

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
    actions: {}
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('my-items');

  const isOwner = !userId || userId === currentUser?.id;
  const targetUserId = userId || currentUser?.id;

  // Analytics tracking
  const trackAnalytics = useCallback((event: string, metadata?: any) => {
    if (typeof window !== 'undefined') {
      // Track analytics event
      console.log('Profile Analytics:', { event, userId: targetUserId, ...metadata });
    }
  }, [targetUserId]);

  // Error handling
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Profile error in ${context}:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 404) {
      errorMessage = 'Profile not found';
    } else if (error.status === 403) {
      errorMessage = 'Access denied';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later';
    }
    
    setError(errorMessage);
    addToast(errorMessage, 'error');
    trackAnalytics('profile_error', { context, error: errorMessage });
  }, [addToast, trackAnalytics]);

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!targetUserId) return;

    setLoading(prev => ({ ...prev, profile: true }));
    setError(null);

    try {
      // Load user profile
      const userResponse = await api.users.getProfile(targetUserId);
      const statsResponse = await api.users.getStats(targetUserId);
      
      if (userResponse.data && statsResponse.data) {
        const newProfileData: ProfileData = {
          user: {
            ...userResponse.data,
            ...statsResponse.data.userStats
          },
          stats: statsResponse.data,
          recentActivity: [],
          notifications: [],
          items: {},
          pagination: {}
        };

        setProfileData(newProfileData);
        trackAnalytics('profile_loaded', { userId: targetUserId });
      }
    } catch (error) {
      handleError(error, 'loadProfile');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, [targetUserId, handleError, trackAnalytics]);

  // Load items for specific tab
  const loadTabItems = useCallback(async (tab: ProfileTab, page = 1) => {
    if (!targetUserId || !profileData) return;

    setLoading(prev => ({ ...prev, items: true }));

    try {
      let response;
      const params = { 
        page, 
        limit: PROFILE_CONSTANTS.PAGINATION.ITEMS_PER_PAGE 
      };

      switch (tab) {
        case 'my-items':
          response = await api.items.getUserItems(targetUserId, params);
          break;
        case 'my-interests':
          response = await api.users.getSavedItems(params);
          break;
        case 'pending-sales':
          response = await api.items.getPendingSales(params);
          break;
        case 'purchase-history':
          response = await api.users.getPurchaseHistory(params);
          break;
        case 'sold-items':
          response = await api.items.getSoldItems(params);
          break;
        case 'viewed-items':
          response = await api.users.getViewedItems(params);
          break;
        case 'notifications':
          response = await api.users.getNotifications(params);
          break;
        default:
          return;
      }

      if (response.data) {
        setProfileData(prev => {
          if (!prev) return prev;
          
          const newItems = page === 1 
            ? response.data.items || response.data.notifications || []
            : [...(prev.items[tab] || []), ...(response.data.items || response.data.notifications || [])];

          return {
            ...prev,
            items: {
              ...prev.items,
              [tab]: newItems
            },
            pagination: {
              ...prev.pagination,
              [tab]: response.data.pagination || {
                currentPage: page,
                totalPages: Math.ceil((response.data.total || 0) / PROFILE_CONSTANTS.PAGINATION.ITEMS_PER_PAGE),
                totalItems: response.data.total || 0,
                hasMore: response.data.hasMore || false
              }
            }
          };
        });

        trackAnalytics('profile_tab_loaded', { tab, page, itemCount: response.data.items?.length || 0 });
      }
    } catch (error) {
      handleError(error, `loadTabItems:${tab}`);
    } finally {
      setLoading(prev => ({ ...prev, items: false }));
    }
  }, [targetUserId, profileData, handleError, trackAnalytics]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    await loadProfile();
    if (activeTab) {
      await loadTabItems(activeTab);
    }
  }, [loadProfile, loadTabItems, activeTab]);

  // Change active tab
  const handleSetActiveTab = useCallback((tab: ProfileTab) => {
    setActiveTab(tab);
    trackAnalytics('profile_tab_changed', { tab });
    
    // Load items for new tab if not already loaded
    if (profileData && !profileData.items[tab]) {
      loadTabItems(tab);
    }
  }, [profileData, loadTabItems, trackAnalytics]);

  // Load more items for current tab
  const loadMoreItems = useCallback(async (tab: ProfileTab) => {
    if (!profileData?.pagination[tab]) return;
    
    const pagination = profileData.pagination[tab];
    if (!pagination?.hasMore) return;

    await loadTabItems(tab, pagination.currentPage + 1);
  }, [profileData, loadTabItems]);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<ProfileEditForm>) => {
    if (!isOwner) {
      addToast('You can only edit your own profile', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, actions: { ...prev.actions, updateProfile: true } }));

    try {
      const response = await api.users.updateProfile(data);
      
      if (response.data) {
        await refreshUser();
        await loadProfile();
        addToast('Profile updated successfully', 'success');
        trackAnalytics('profile_updated', { updatedFields: Object.keys(data) });
      }
    } catch (error) {
      handleError(error, 'updateProfile');
    } finally {
      setLoading(prev => ({ ...prev, actions: { ...prev.actions, updateProfile: false } }));
    }
  }, [isOwner, addToast, refreshUser, loadProfile, handleError, trackAnalytics]);

  // Delete item
  const deleteItem = useCallback(async (itemId: string) => {
    if (!isOwner) {
      addToast('You can only delete your own items', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, actions: { ...prev.actions, [`delete-${itemId}`]: true } }));

    try {
      await api.items.deleteItem(itemId);
      
      // Remove item from all tabs
      setProfileData(prev => {
        if (!prev) return prev;
        
        const updatedItems = { ...prev.items };
        Object.keys(updatedItems).forEach(tab => {
          if (updatedItems[tab as ProfileTab]) {
            updatedItems[tab as ProfileTab] = updatedItems[tab as ProfileTab]!.filter(
              item => item.id !== itemId
            );
          }
        });

        return {
          ...prev,
          items: updatedItems,
          stats: {
            ...prev.stats,
            activeListingsCount: Math.max(0, prev.stats.activeListingsCount - 1)
          }
        };
      });

      addToast('Item deleted successfully', 'success');
      trackAnalytics('item_deleted', { itemId });
    } catch (error) {
      handleError(error, 'deleteItem');
    } finally {
      setLoading(prev => ({ ...prev, actions: { ...prev.actions, [`delete-${itemId}`]: false } }));
    }
  }, [isOwner, addToast, handleError, trackAnalytics]);

  // Save item
  const saveItem = useCallback(async (itemId: string) => {
    setLoading(prev => ({ ...prev, actions: { ...prev.actions, [`save-${itemId}`]: true } }));

    try {
      await api.items.saveItem(itemId);
      
      // Update saved items count
      setProfileData(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          stats: {
            ...prev.stats,
            savedItemsCount: prev.stats.savedItemsCount + 1
          }
        };
      });

      addToast('Item saved successfully', 'success');
      trackAnalytics('item_saved', { itemId });
    } catch (error) {
      handleError(error, 'saveItem');
    } finally {
      setLoading(prev => ({ ...prev, actions: { ...prev.actions, [`save-${itemId}`]: false } }));
    }
  }, [handleError, trackAnalytics, addToast]);

  // Unsave item
  const unsaveItem = useCallback(async (itemId: string) => {
    setLoading(prev => ({ ...prev, actions: { ...prev.actions, [`unsave-${itemId}`]: true } }));

    try {
      await api.items.unsaveItem(itemId);
      
      // Remove from saved items and update count
      setProfileData(prev => {
        if (!prev) return prev;
        
        const updatedSavedItems = prev.items['my-interests']?.filter(
          item => item.id !== itemId
        ) || [];

        return {
          ...prev,
          items: {
            ...prev.items,
            'my-interests': updatedSavedItems
          },
          stats: {
            ...prev.stats,
            savedItemsCount: Math.max(0, prev.stats.savedItemsCount - 1)
          }
        };
      });

      addToast('Item removed from saved items', 'success');
      trackAnalytics('item_unsaved', { itemId });
    } catch (error) {
      handleError(error, 'unsaveItem');
    } finally {
      setLoading(prev => ({ ...prev, actions: { ...prev.actions, [`unsave-${itemId}`]: false } }));
    }
  }, [handleError, trackAnalytics, addToast]);

  // Load profile on mount and when user changes
  useEffect(() => {
    if (targetUserId) {
      loadProfile();
    }
  }, [targetUserId, loadProfile]);

  // Load items for active tab when it changes
  useEffect(() => {
    if (profileData && activeTab && !profileData.items[activeTab]) {
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
    unsaveItem
  };
};
