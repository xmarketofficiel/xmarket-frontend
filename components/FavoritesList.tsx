'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useUser } from '../contexts/UserContext';
import { api } from '../lib/apiEndpoints';
import ItemCard from './ItemCard';
import SkeletonCard from './SkeletonCard';
import { Item } from '../types';

export default function FavoritesList() {
  const { favorites } = useFavorites();
  const { user } = useUser();
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user's favorite items from backend
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      
      if (!user) {
        // For non-authenticated users, load items based on localStorage favorites
        if (favorites.length === 0) {
          setFavoriteItems([]);
          setLoading(false);
          return;
        }

        try {
          const itemPromises = favorites.map(async (itemId: string) => {
            try {
              const response = await api.items.getItem(itemId);
              return response.data;
            } catch (error) {
              console.error('Failed to load item:', itemId);
              return null;
            }
          });
          
          const items = await Promise.all(itemPromises);
          const validItems = items.filter(item => item !== null) as Item[];
          setFavoriteItems(validItems);
        } catch (error) {
          console.error('Failed to load favorite items:', error);
          setFavoriteItems([]);
        }
      } else {
        // For authenticated users, use backend favorites API
        try {
          const response = await api.items.getFavorites();
          setFavoriteItems(response.data.items || []);
        } catch (error) {
          console.error('Failed to load favorites from backend:', error);
          // Fallback to localStorage-based loading
          if (favorites.length > 0) {
            const itemPromises = favorites.map(async (itemId: string) => {
              try {
                const response = await api.items.getItem(itemId);
                return response.data;
              } catch (error) {
                return null;
              }
            });
            const items = await Promise.all(itemPromises);
            const validItems = items.filter(item => item !== null) as Item[];
            setFavoriteItems(validItems);
          } else {
            setFavoriteItems([]);
          }
        }
      }
      
      setLoading(false);
    };

    loadFavorites();
  }, [user, favorites]);

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-gray-400 mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-600">Start browsing and save items you like!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}