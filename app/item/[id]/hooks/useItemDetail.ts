'use client';

import { useState, useCallback } from 'react';
import { ItemDetailState, ItemDetailActions, UserInteraction } from '../types';
import { STATUS_MESSAGES } from '../constants';

interface UseItemDetailProps {
  initialItem?: any;
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function useItemDetail({ initialItem, onToast }: UseItemDetailProps) {
  const [state, setState] = useState<ItemDetailState>({
    item: initialItem || null,
    userInteraction: {
      isFavorited: false,
      hasShownInterest: false,
      canMessage: true,
      canEdit: false,
      canReport: true
    },
    loading: {
      item: false,
      interest: false,
      favorite: false,
      report: false
    },
    modals: {
      share: false,
      report: false,
      imageViewer: false,
      imageViewerIndex: 0
    },
    error: null
  });

  const updateState = useCallback((updates: Partial<ItemDetailState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateLoading = useCallback((key: keyof ItemDetailState['loading'], value: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: value }
    }));
  }, []);

  const updateModals = useCallback((modal: keyof ItemDetailState['modals'], value: boolean | number) => {
    setState(prev => ({
      ...prev,
      modals: { ...prev.modals, [modal]: value }
    }));
  }, []);

  const actions: ItemDetailActions = {
    loadItem: async (itemId: string) => {
      updateLoading('item', true);
      try {
        // This would typically be an API call
        // const response = await api.items.getById(itemId);
        // updateState({ item: response.data, userInteraction: response.userInteraction });
        onToast?.(STATUS_MESSAGES.success.interest, 'success');
      } catch (error: any) {
        updateState({ error: error.message || STATUS_MESSAGES.error.loadFailed });
        onToast?.(error.message || STATUS_MESSAGES.error.loadFailed, 'error');
      } finally {
        updateLoading('item', false);
      }
    },

    toggleFavorite: async () => {
      updateLoading('favorite', true);
      try {
        const newFavoriteState = !state.userInteraction.isFavorited;
        
        // API call would go here
        // await api.items.toggleFavorite(state.item?.id);
        
        setState(prev => ({
          ...prev,
          userInteraction: {
            ...prev.userInteraction,
            isFavorited: newFavoriteState
          }
        }));
        
        const message = newFavoriteState 
          ? STATUS_MESSAGES.success.favorite 
          : STATUS_MESSAGES.success.unfavorite;
        onToast?.(message, 'success');
      } catch (error: any) {
        onToast?.(error.message || STATUS_MESSAGES.error.favorite, 'error');
      } finally {
        updateLoading('favorite', false);
      }
    },

    addInterest: async (data) => {
      updateLoading('interest', true);
      try {
        // API call would go here
        // await api.items.expressInterest(state.item?.id, data);
        
        setState(prev => ({
          ...prev,
          userInteraction: {
            ...prev.userInteraction,
            hasShownInterest: true
          }
        }));
        
        onToast?.(STATUS_MESSAGES.success.interest, 'success');
      } catch (error: any) {
        onToast?.(error.message || STATUS_MESSAGES.error.interest, 'error');
      } finally {
        updateLoading('interest', false);
      }
    },

    submitReport: async (data) => {
      updateLoading('report', true);
      try {
        // API call would go here
        // await api.items.report(state.item?.id, data);
        
        onToast?.(STATUS_MESSAGES.success.report, 'success');
        updateModals('report', false);
      } catch (error: any) {
        onToast?.(error.message || STATUS_MESSAGES.error.report, 'error');
      } finally {
        updateLoading('report', false);
      }
    },

    shareItem: async (platform: string) => {
      try {
        if (platform === 'copy-link') {
          await navigator.clipboard.writeText(window.location.href);
          onToast?.(STATUS_MESSAGES.success.share, 'success');
        }
        // Handle other platforms as needed
      } catch (error: any) {
        onToast?.('Failed to share item', 'error');
      }
    },

    openModal: (modal: keyof ItemDetailState['modals'], data?: any) => {
      if (modal === 'imageViewer' && typeof data === 'number') {
        setState(prev => ({
          ...prev,
          modals: {
            ...prev.modals,
            imageViewer: true,
            imageViewerIndex: data
          }
        }));
      } else {
        updateModals(modal, true);
      }
    },

    closeModal: (modal: keyof ItemDetailState['modals']) => {
      updateModals(modal, false);
    },

    clearError: () => {
      updateState({ error: null });
    }
  };

  return {
    state,
    actions
  };
}
