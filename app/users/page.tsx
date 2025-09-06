"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/apiEndpoints";

interface SimpleUser {
  id: string | number;
  fullName?: string;
  email: string;
  isVerified?: boolean;
  profileImageUrl?: string;
  role: string;
}

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // For now, we'll create some mock users since we don't have a public users list endpoint
        // In a real app, you'd have an endpoint like api.users.getPublicUsers()
        const mockUsers: SimpleUser[] = [
          {
            id: 1,
            fullName: "John Doe",
            email: "john@university.edu",
            isVerified: true,
            role: "user"
          },
          {
            id: 2,
            fullName: "Jane Smith",
            email: "jane@university.edu", 
            isVerified: false,
            role: "user"
          },
          {
            id: 3,
            fullName: "Admin User",
            email: "admin@university.edu",
            isVerified: true,
            role: "admin"
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666] mx-auto mb-2"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-[#006666]" />
            <h1 className="text-xl font-bold text-gray-900">Community Members</h1>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="p-4">
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => router.push(`/user/${user.id}`)}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.fullName || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#006666] rounded-full flex items-center justify-center text-white font-bold">
                      {(user.fullName || user.email || '?').charAt(0)}
                    </div>
                  )}
                  {user.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                      <CheckCircle size={14} className="text-[#006666]" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {user.fullName || 'Anonymous User'}
                    </h3>
                    {user.isVerified && (
                      <CheckCircle size={16} className="text-[#006666]" />
                    )}
                    {user.role === 'admin' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                {/* Arrow */}
                <div className="text-gray-400">
                  <ArrowLeft size={16} className="rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Demo Page</h4>
              <p className="text-sm text-blue-800">
                This is a demo page showing the user profile feature. In a real implementation, 
                this would show actual community members. Click on any user to view their profile 
                with their listings, statistics, and transaction history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
