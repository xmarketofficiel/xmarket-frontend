"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Flag, CheckCircle, Star, Calendar, Activity } from "lucide-react";
import { useUser } from "../../../contexts/UserContext";
import { useToast } from "../../../contexts/ToastContext";
import { api } from "../../../lib/apiEndpoints";
import ItemCard from "../../../components/ItemCard";

interface UserProfileData {
  user: {
    id: string | number;
    fullName: string;
    email: string;
    whatsappNumber?: string;
    role: string;
    status: string;
    isVerified: boolean;
    profileImageUrl?: string;
    averageRating?: number;
    totalRatings?: number;
    createdAt: string;
  };
  stats: {
    totalSold: number;
    totalBought: number;
    totalRevenue: number;
    totalSpent: number;
    joinedDate: string;
    lastActivity: string;
  };
  soldItems: any[];
  boughtItems: any[];
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useUser();
  const { addToast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'stats'>('listings');

  const userId = params?.id as string;

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await api.users.getUserProfile(userId);
        setUserProfile(response.data as UserProfileData);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        addToast('Failed to load user profile', 'error');
      }
      setLoading(false);
    };

    loadUserProfile();
  }, [userId, addToast]);

  const handleStartConversation = async () => {
    if (!currentUser || !userProfile) {
      addToast('Please log in to start a conversation', 'error');
      return;
    }

    try {
      // Navigate to messages with user ID
      router.push(`/messages?user=${userId}`);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      addToast('Failed to start conversation', 'error');
    }
  };

  const handleReportUser = () => {
    if (!currentUser) {
      addToast('Please log in to report users', 'error');
      return;
    }
    
    // In a real implementation, this would open a report modal
    addToast('Report functionality will be implemented soon', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666] mx-auto mb-2"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-[#006666] text-white px-6 py-2 rounded-lg hover:bg-[#005555] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id.toString() === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">User Profile</h1>
          </div>
          
          {!isOwnProfile && currentUser && (
            <div className="flex space-x-2">
              <button
                onClick={handleStartConversation}
                className="p-2 bg-[#006666] text-white rounded-full hover:bg-[#005555] transition-colors"
              >
                <MessageCircle size={18} />
              </button>
              <button
                onClick={handleReportUser}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Flag size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative">
            {userProfile.user.profileImageUrl ? (
              <img
                src={userProfile.user.profileImageUrl}
                alt={userProfile.user.fullName || 'User'}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-[#006666] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {(userProfile.user.fullName || userProfile.user.email || '?').charAt(0)}
              </div>
            )}
            {userProfile.user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                <CheckCircle size={20} className="text-[#006666]" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{userProfile.user.fullName || 'Anonymous User'}</h2>
              {userProfile.user.isVerified && (
                <CheckCircle size={18} className="text-[#006666]" />
              )}
            </div>
            
            {/* Rating display */}
            {userProfile.user.averageRating && userProfile.user.totalRatings && Number(userProfile.user.totalRatings) > 0 && (
              <div className="flex items-center space-x-1 mb-2">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {Number(userProfile.user.averageRating).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({userProfile.user.totalRatings} reviews)
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {userProfile.soldItems.length}
                </span>{" "}
                listings
              </span>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">
                  {userProfile.stats.totalSold}
                </span>{" "}
                sold
              </span>
            </div>
          </div>
        </div>

        {/* Member info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Member since {new Date(userProfile.stats.joinedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity size={14} />
              <span>Last active {new Date(userProfile.stats.lastActivity).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'listings'
                ? 'border-[#006666] text-[#006666]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Listings ({userProfile.soldItems.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-[#006666] text-[#006666]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'listings' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Listings</h3>
            {userProfile.soldItems.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="text-gray-400 text-4xl mb-3">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-500">
                  {isOwnProfile ? "You haven't posted any items yet." : "This user hasn't posted any items yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userProfile.soldItems.map((item) => (
                  <div key={item.id} className="relative">
                    <ItemCard item={item} />
                    {item.isSold && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        SOLD
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Items Sold */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Items Sold</p>
                    <p className="text-2xl font-bold text-gray-900">{userProfile.stats.totalSold}</p>
                  </div>
                </div>
              </div>

              {/* Items Listed */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{userProfile.soldItems.filter(item => !item.isSold).length}</p>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              {(isOwnProfile || userProfile.stats.totalRevenue > 0) && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <span className="text-2xl">💵</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${userProfile.stats.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rating */}
              {userProfile.user.averageRating && userProfile.user.totalRatings && Number(userProfile.user.totalRatings) > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Star size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Number(userProfile.user.averageRating).toFixed(1)} ⭐
                      </p>
                      <p className="text-xs text-gray-500">{userProfile.user.totalRatings} reviews</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Timeline (Placeholder) */}
            <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="text-center py-8 text-gray-500">
                <Activity size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Activity timeline coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}
