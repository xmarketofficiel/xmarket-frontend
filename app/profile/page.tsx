"use client";

import { useState, useEffect } from "react";
import { Settings, LogOut, CheckCircle, Edit3, Bell } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useToast } from "../../contexts/ToastContext";
import { api } from "../../lib/apiEndpoints";
import ItemCard from "../../components/ItemCard";
import { Item } from "../../types";

export default function ProfilePage() {
  const { user, logout } = useUser();
  const { favorites } = useFavorites();
  const { addToast } = useToast();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingSalesCount, setPendingSalesCount] = useState(0);

  // Load user's items and favorites from backend
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Load user's own items
        const itemsResponse = await api.users.getUserItems(user.id.toString());
        setUserItems(itemsResponse.data || []);

        // Load favorite items
        if (favorites.length > 0) {
          if (user) {
            // For authenticated users, try backend first
            try {
              const favoritesResponse = await api.items.getFavorites();
              setFavoriteItems(favoritesResponse.data.items || []);
            } catch (error) {
              console.error('Failed to load favorites from backend, using fallback:', error);
              // Fallback to loading individual items
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
            }
          } else {
            // For non-authenticated users, load items based on localStorage
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
          }
        } else {
          setFavoriteItems([]);
        }

        // Load pending sales count for notifications
        try {
          // Use the same API as the pending sales page for consistency
          const response = await api.items.getPendingSales();
          const pendingSales = response.data || [];
          setPendingSalesCount(Array.isArray(pendingSales) ? pendingSales.length : 0);
        } catch (error: any) {
          // Only log notification errors if it's not an auth issue
          if (error?.status !== 401) {
            console.error('Failed to load pending sales:', error);
          }
          setPendingSalesCount(0);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        setUserItems([]);
        setFavoriteItems([]);
      }
      
      setLoading(false);
    };

    loadUserData();
  }, [user, favorites]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666] mx-auto mb-2"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      addToast("Logging out...", "info");
      await logout();
      // Don't add toast after logout since we'll be redirected
    } catch (error) {
      addToast("Logout failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <button
            onClick={() => (window.location.href = "/settings")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.fullName || 'User'}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-[#006666] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>
            )}
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                <CheckCircle size={20} className="text-[#006666]" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{user.fullName || 'Anonymous User'}</h2>
              <button 
                onClick={() => (window.location.href = "/settings/profile")}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Edit Profile"
              >
                <Edit3 size={16} className="text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <p className="text-sm text-gray-500">
              {user.whatsappNumber && `WhatsApp: ${user.whatsappNumber}`}
            </p>

            {/* Stats */}
            <div className="flex items-center space-x-4 mt-3 text-sm">
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {userItems.length}
                </span>{" "}
                listings
              </span>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {favoriteItems.length}
                </span>{" "}
                saved
              </span>
              {user.averageRating && user.totalRatings && Number(user.totalRatings) > 0 && (
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {Number(user.averageRating).toFixed(1)}⭐
                  </span>{" "}
                  ({user.totalRatings} reviews)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Additional User Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Member since {new Date(user.createdAt || '').toLocaleDateString()}</span>
            {user.isVerified && (
              <span className="flex items-center text-[#006666]">
                <CheckCircle size={16} className="mr-1" />
                Verified Account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-4 space-y-6">
        {/* My Listings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            My Listings
          </h3>
          {userItems.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-500 mb-2">
                You haven&apos;t posted any items yet
              </p>
              <button
                onClick={() => (window.location.href = "/add")}
                className="text-[#006666] font-medium hover:text-[#005555] transition-colors"
              >
                Post your first item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {userItems.slice(0, 4).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {userItems.length > 4 && (
            <button className="w-full mt-3 py-2 text-[#006666] font-medium hover:text-[#005555] transition-colors">
              View all listings ({userItems.length})
            </button>
          )}
        </section>

        {/* My Interests & Purchases */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            My Interests & Purchases
          </h3>
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-gray-700 mb-4">
              Track items you're interested in and manage your sales
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/profile/my-interests")}
                className="bg-[#006666] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#005555] transition-colors"
              >
                View My Interests
              </button>
              <button
                onClick={() => (window.location.href = "/profile/pending-sales")}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors relative"
              >
                <div className="flex items-center gap-2">
                  <Bell size={16} />
                  Pending Sales
                  {pendingSalesCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {pendingSalesCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Saved Items */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Recently Saved
          </h3>
          {favoriteItems.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-500 mb-2">No saved items yet</p>
              <button
                onClick={() => (window.location.href = "/")}
                className="text-[#006666] font-medium hover:text-[#005555] transition-colors"
              >
                Start browsing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {favoriteItems.slice(0, 4).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {favoriteItems.length > 4 && (
            <button
              onClick={() => (window.location.href = "/favorites")}
              className="w-full mt-3 py-2 text-[#006666] font-medium hover:text-[#005555] transition-colors"
            >
              View all saved items ({favoriteItems.length})
            </button>
          )}
        </section>

        {/* Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Settings</h3>
          <div className="bg-white rounded-xl divide-y divide-gray-100">
            <button 
              onClick={() => (window.location.href = "/settings/profile")}
              className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
            >
              <Settings size={20} className="text-[#009F9C]" />
              <span className="flex-1 text-left font-medium text-gray-900">
                Account Settings
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-red-600"
            >
              <LogOut size={20} />
              <span className="flex-1 text-left font-medium">Logout</span>
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}
