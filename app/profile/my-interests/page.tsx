'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { useUser } from '../../../contexts/UserContext';
import { api } from '../../../lib/apiEndpoints';
import { Item } from '../../../types';

export default function SavedItemsPage() {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { user } = useUser();

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.items.getFavorites();
      
      // The API now returns properly formatted data
      const favoriteItems = response.data.items || [];
      
      setFavorites(favoriteItems);
    } catch (error: any) {
      console.error('Failed to fetch favorites:', error);
      addToast('Failed to load favorites', 'error');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);



  const handleRemoveFavorite = async (itemId: string | number) => {
    try {
      await api.items.removeFavorite(String(itemId));
      setFavorites(prev => prev.filter(item => item.id !== itemId));
      addToast('Item removed from saved items', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to remove item', 'error');
    }
  };

  const handleViewItem = (itemId: string | number) => {
    window.location.href = `/item/${itemId}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to view your saved items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
                <p className="text-gray-600">Items you've saved for later</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Items Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666]"></div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Heart size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Items Yet</h3>
              <p className="text-gray-600 mb-4">
                Start exploring items and click the heart icon to save them for later!
              </p>
              <button
                onClick={() => window.location.href = '/marketplace'}
                className="bg-[#006666] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#005555] transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
              {favorites.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Item Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    {(item.images?.[0]?.imageUrl || item.photos?.[0]) ? (
                      <Image
                        src={item.images?.[0]?.imageUrl || item.photos?.[0] || ''}
                        alt={item.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => handleRemoveFavorite(item.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
                  </div>

                  {/* Item Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-[#006666] font-bold mb-2">{item.price} DH</p>
                    <p className="text-sm text-gray-600 mb-3 capitalize">{item.condition || 'N/A'}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewItem(item.id)}
                        className="flex-1 px-3 py-2 text-sm font-medium bg-[#006666] text-white rounded-lg hover:bg-[#005555] transition-colors"
                      >
                        View Item
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Saved: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

