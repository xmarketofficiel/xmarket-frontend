/**
 * Users API endpoints
 * Split from apiEndpoints.ts for better code splitting and performance
 */

import apiClient, { ApiResponse } from "../api";
import { User, Item } from "../../types";

// Import types from items API for consistency
interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ===== USERS API =====
export interface CommunityProfile {
  user: {
    id: number;
    fullName: string;
    userRole: 'student' | 'staff';
    department?: string;
    isVerified: boolean;
    profileImageUrl?: string;
    createdAt: string;
    whatsappNumber?: string;
  };
  stats: { activeListingsCount: number };
  items: Array<{
    id: number;
    title: string;
    price: string | number;
    category: string;
    condition: string;
    createdAt: string;
    photos: string[];
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean };
}

export const usersApi = {
  getCommunityProfile: (id: string, page = 1): Promise<ApiResponse<CommunityProfile>> =>
    apiClient.get(`/users/${id}/community`, { page }),
  // Profile Management
  getProfile: (): Promise<ApiResponse<User>> => apiClient.get("/users/profile"),

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
    apiClient.patch("/users/profile", data), // Backend uses PATCH

  // Change Password
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> =>
    apiClient.patch("/users/change-password", data),

  // Avatar Upload (Backend endpoint: POST /users/upload-avatar)
  uploadAvatar: (file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.uploadFile("/users/upload-avatar", formData);
  },

  // User Data
  getUserItems: (
    userId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<any>> =>
    apiClient.get(`/users/${userId}/items`, params),

  getUserInterests: (userId: string): Promise<ApiResponse<any[]>> =>
    apiClient.get(`/users/${userId}/interests`),

  // Get user public profile
  getUser: (id: string): Promise<ApiResponse<User>> => 
    apiClient.get(`/users/${id}`),

  // Get detailed user profile (public version with comprehensive data)
  getUserProfile: (id: string): Promise<ApiResponse<{
    user: User;
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
  }>> => {
    // Use the new public profile endpoint we created
    return apiClient.get(`/users/${id}`);
  },

  followUser: (
    userId: string
  ): Promise<ApiResponse<{ isFollowing: boolean }>> =>
    apiClient.post(`/users/${userId}/follow`),

  blockUser: (userId: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
    apiClient.post(`/users/${userId}/block`),

  reportUser: (userId: string, reason: string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
    apiClient.post(`/users/${userId}/report`, { reason }),

  // Security & Account Management
  getLoginSessions: (): Promise<ApiResponse<any[]>> => {
    // Mock implementation - replace with actual API call when backend is ready
    return Promise.resolve({
      data: [
        {
          id: "session1",
          deviceName: "Chrome on Windows",
          deviceType: "desktop",
          location: "New York, US",
          lastActive: "2 minutes ago",
          current: true,
          ipAddress: "192.168.1.1"
        },
        {
          id: "session2", 
          deviceName: "Safari on iPhone",
          deviceType: "mobile",
          location: "New York, US", 
          lastActive: "1 hour ago",
          current: false,
          ipAddress: "192.168.1.2"
        }
      ],
      status: 200,
      message: "Mock response",
    });
  },

  getSecuritySettings: (): Promise<ApiResponse<any>> => {
    // Mock implementation - replace with actual API call when backend is ready
    return Promise.resolve({
      data: {
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: 30,
        requirePasswordForSensitive: true,
      },
      status: 200,
      message: "Mock response",
    });
  },

  updateSecuritySettings: (settings: any): Promise<ApiResponse<any>> => {
    // Mock implementation - replace with actual API call when backend is ready
    return Promise.resolve({
      data: settings,
      status: 200,
      message: "Mock response",
    });
  },

  revokeSession: (sessionId: string): Promise<ApiResponse<void>> => {
    // Mock implementation - replace with actual API call when backend is ready
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  deleteAccount: (): Promise<ApiResponse<{ message: string }>> => {
    // Mock implementation - replace with actual API call when backend is ready
    return Promise.resolve({
      data: { message: "Account deleted successfully" },
      status: 200,
      message: "Account deleted successfully",
    });
  },

  exportUserData: (): Promise<ApiResponse<{ downloadUrl: string }>> => {
    // Mock implementation - replace with actual API call when backend is ready
    return Promise.resolve({
      data: { downloadUrl: "https://example.com/user-data-export.zip" },
      status: 200,
      message: "User data export ready",
    });
  },


};
