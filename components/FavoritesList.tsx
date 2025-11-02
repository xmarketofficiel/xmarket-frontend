'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-xl border border-gray-200">
        <div className="text-gray-400 mb-6">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">No favorites yet</h3>
        <p className="text-gray-600 mb-6 max-w-md">Start browsing the marketplace and save items you like by tapping the heart icon!</p>
        <Link 
          href="/" 
          className="bg-[#009F9C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#007A77] transition-colors"
        >
          Browse Items
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-6 pb-20">
      {favoriteItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}