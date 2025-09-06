'use client';

import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { api } from '../lib/apiEndpoints';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (itemId: string) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  clearFavorites: () => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { user } = useUser();
  const { addToast } = useToast();

  // Load favorites on mount and when user changes
  useEffect(() => {
    if (user) {
      // Load from backend for authenticated users
      loadFavoritesFromBackend();
    } else {
      // Load from localStorage for non-authenticated users
      loadFavoritesFromLocalStorage();
    }
  }, [user]);

  const loadFavoritesFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('um6p-marketplace-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  };

  const loadFavoritesFromBackend = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.items.getFavorites();
      const favoriteIds = response.data.items.map(item => String(item.id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Failed to load favorites from backend:', error);
      // Fallback to localStorage
      loadFavoritesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('um6p-marketplace-favorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addToFavorites = async (itemId: string) => {
    if (user) {
      // Use backend API for authenticated users
      try {
        setLoading(true);
        const response = await api.items.toggleFavorite(itemId);
        if (response.data.isFavorite) {
          setFavorites(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
          addToast('Added to favorites!', 'success');
        }
      } catch (error: any) {
        console.error('Failed to add favorite via API:', error);
        
        // Handle specific error cases
        if (error?.message?.includes('Cannot favorite your own item')) {
          addToast('You cannot favorite your own items', 'error');
          return; // Don't add to local storage
        } else if (error?.message?.includes('Please log in')) {
          addToast('Please log in to favorite items', 'error');
          return;
        } else if (error?.message?.includes('Item not found')) {
          addToast('This item is no longer available', 'error');
          return;
        } else {
          addToast('Unable to add to favorites. Saved locally instead.', 'info');
          // Fallback to local storage for network errors only
          setFavorites(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Use localStorage for non-authenticated users
      setFavorites(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
    }
  };

  const removeFromFavorites = async (itemId: string) => {
    if (user) {
      // Use backend API for authenticated users
      try {
        setLoading(true);
        const response = await api.items.toggleFavorite(itemId);
        if (!response.data.isFavorite) {
          setFavorites(prev => prev.filter(id => id !== itemId));
          addToast('Removed from favorites', 'info');
        }
      } catch (error: any) {
        console.error('Failed to remove favorite via API:', error);
        
        // Handle specific error cases
        if (error?.message?.includes('Item not found')) {
          // Item no longer exists, remove from local favorites anyway
          setFavorites(prev => prev.filter(id => id !== itemId));
          addToast('Item was already removed', 'info');
        } else if (error?.message?.includes('Please log in')) {
          addToast('Please log in to manage favorites', 'error');
        } else {
          addToast('Unable to sync with server. Removed locally.', 'info');
          // Fallback to local storage for network errors
          setFavorites(prev => prev.filter(id => id !== itemId));
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Use localStorage for non-authenticated users
      setFavorites(prev => prev.filter(id => id !== itemId));
      addToast('Removed from favorites', 'info');
    }
  };

  const isFavorite = (itemId: string) => {
    return favorites.includes(itemId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    if (!user) {
      localStorage.removeItem('um6p-marketplace-favorites');
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites,
      loading,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}