/**
 * Updated API endpoints for CampusSuperApp backend integration
 * This file contains the correct mapping for all backend endpoints
 */

import apiClient, { ApiResponse } from "./api";
import { Item, User, Conversation, Message } from "../types";

// ===== AUTHENTICATION INTERFACES =====
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CompleteRegistrationData {
  email: string;
  fullName: string;
  whatsappNumber: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  // Note: Tokens are in HTTP-only cookies, not response body
}

// ===== ITEMS INTERFACES =====
export interface CreateItemData {
  title: string;
  description: string;
  price: number;
  quantity?: number;
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  anonymous?: boolean;
  // Note: photos uploaded separately via /items/:id/images
}

export interface SearchParams {
  search?: string; // Backend uses 'search' not 'query'
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// ===== SERVICES INTERFACES (NEW) =====
export interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  location?: string;
}

export interface SearchServicesParams {
  category?: ServiceCategory;
  search?: string;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface CreateRatingData {
  rating: number; // 1-5
  comment?: string;
}

export enum ServiceCategory {
  CLEANER = "cleaner",
  TUTOR = "tutor",
  DELIVERY = "delivery",
  MAINTENANCE = "maintenance",
  PET_CARE = "pet_care",
  OTHER = "other",
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  location?: string;
  userId: number;
  averageRating?: number;
  totalRatings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  userId: number;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
}

// ===== INTERESTS INTERFACES (NEW) =====
export interface CreateInterestData {
  itemId: number;
  message?: string;
}

export interface Interest {
  id: number;
  message?: string;
  userId: number;
  itemId: number;
  createdAt: string;
  updatedAt: string;
}

// ===== PAGINATION INTERFACE =====
export interface NotificationResponse {
  success: boolean;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ===== AUTHENTICATION API =====
export const authApi = {
  // OTP-based Registration Flow
  sendOtp: (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post("/auth/send-otp", { email }),

  verifyOtp: (
    email: string,
    otp: string
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post("/auth/verify-otp", { email, otp }),

  completeRegistration: (
    data: CompleteRegistrationData
  ): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post("/auth/complete-registration", data),

  // Cookie-based Authentication
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post("/auth/login", credentials);
    // Using HTTP-only cookies - no need to manage tokens in client
    return response as ApiResponse<AuthResponse>;
  },

  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post("/auth/logout");
    // HTTP-only cookies are cleared by server on logout
    return response as ApiResponse<{ message: string }>;
  },

  refreshToken: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post("/auth/refresh"),

  // Password Reset Flow
  forgotPassword: (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post("/auth/forgot-password", { email }),

  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post("/auth/reset-password", { email, otp, newPassword }),

  // Get Current User
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get("/users/profile");
      // No need to set auth token - using HTTP-only cookies
      return response as ApiResponse<User>;
    } catch (error) {
      // No need to clear auth token - HTTP-only cookies handle this
      throw error;
    }
  },
};

// ===== ITEMS API =====
export const itemsApi = {
  getItems: (
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    apiClient.get("/items", params),

  getItem: (id: string): Promise<ApiResponse<Item>> =>
    apiClient.get(`/items/${id}`),

  createItem: (data: CreateItemData): Promise<ApiResponse<Item>> =>
    apiClient.post("/items", data),

  updateItem: (
    id: string,
    data: Partial<CreateItemData>
  ): Promise<ApiResponse<Item>> => apiClient.patch(`/items/${id}`, data), // Backend uses PATCH

  deleteItem: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/items/${id}`),

  // Image Upload (Backend endpoint: POST /items/:id/images)
  uploadItemImages: (
    itemId: string,
    images: File[]
  ): Promise<ApiResponse<{ message: string; urls?: string[] }>> => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    return apiClient.uploadFile(`/items/${itemId}/images`, formData);
  },

  // Delete Image (Backend endpoint: DELETE /images/:imageId)
  deleteItemImage: (
    imageId: string
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/images/${imageId}`),

  // Categories (Backend endpoint: GET /items/categories)
  getCategories: (): Promise<
    ApiResponse<Array<{id: string; name: string; icon?: string; description?: string}>>
  > => apiClient.get("/items/categories"),

  // Favorites functionality using the proper item_favorites table
  toggleFavorite: async (
    itemId: string
  ): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    try {
      // Input validation and sanitization
      const sanitizedItemId = itemId?.toString()?.trim();
      if (!sanitizedItemId || isNaN(Number(sanitizedItemId)) || Number(sanitizedItemId) <= 0) {
        throw new Error('Invalid item ID provided');
      }

      // Use the proper favorites endpoint that works with item_favorites table
      const response = await apiClient.post(`/items/${sanitizedItemId}/favorite`);
      const data = response.data as { isFavorite: boolean };
      
      // Validate response structure
      if (typeof data.isFavorite !== 'boolean') {
        throw new Error('Invalid response format from server');
      }

      return {
        data: { isFavorite: data.isFavorite },
        status: 200,
        message: data.isFavorite ? "Added to favorites" : "Removed from favorites",
      };
    } catch (error: any) {
      console.error("Favorites toggle failed:", error);
      
      // Handle specific error types
      if (error?.response?.status === 400) {
        throw new Error('Cannot favorite your own item or invalid request');
      } else if (error?.response?.status === 404) {
        throw new Error('Item not found or has been removed');
      } else if (error?.response?.status === 401) {
        throw new Error('Please log in to favorite items');
      } else if (error?.response?.status >= 500) {
        throw new Error('Server error. Please try again later');
      }
      
      // Generic error for unknown cases
      throw new Error('Unable to update favorite status. Please try again.');
    }
  },

  checkFavorite: async (
    itemId: string
  ): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    try {
      // Input validation and sanitization
      const sanitizedItemId = itemId?.toString()?.trim();
      if (!sanitizedItemId || isNaN(Number(sanitizedItemId)) || Number(sanitizedItemId) <= 0) {
        return {
          data: { isFavorite: false },
          status: 200,
          message: "Invalid item ID - defaulting to not favorited",
        };
      }

      const response = await apiClient.get(`/items/${sanitizedItemId}/favorite`);
      const data = response.data as { isFavorite: boolean };
      
      // Validate response structure
      if (typeof data.isFavorite !== 'boolean') {
        return {
          data: { isFavorite: false },
          status: 200,
          message: "Invalid response format - defaulting to not favorited",
        };
      }

      return {
        data: { isFavorite: data.isFavorite },
        status: 200,
        message: "Favorite status retrieved successfully",
      };
    } catch (error: any) {
      console.error("Check favorite failed:", error);
      
      // Always return false for favorite status on error
      // This prevents UI from breaking and defaults to safe state
      return {
        data: { isFavorite: false },
        status: 200,
        message: "Unable to check favorite status - defaulting to not favorited",
      };
    }
  },

  getFavorites: async (
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    try {
      // Only pass parameters if they are provided
      const queryParams: Record<string, string> = {};
      
      if (params.page !== undefined && params.page > 0) {
        queryParams.page = Math.max(1, Math.floor(params.page)).toString();
      }
      
      if (params.limit !== undefined && params.limit > 0) {
        queryParams.limit = Math.min(100, Math.max(1, Math.floor(params.limit))).toString();
      }

      // Use the proper favorites endpoint - only pass params if we have any
      const response = await apiClient.get("/items/favorites", Object.keys(queryParams).length > 0 ? queryParams : undefined);
      const data: any = response.data;
      
      // Validate response structure
      if (!data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from server');
      }

      return {
        data: {
          items: data.data || [],
          total: data.pagination?.total || 0,
          page: data.pagination?.page || (params.page || 1),
          limit: data.pagination?.limit || (params.limit || 20),
          hasMore: (data.pagination?.page || 0) < (data.pagination?.pages || 0)
        },
        status: 200,
        message: "Favorites loaded successfully",
      };
    } catch (error: any) {
      console.error("Failed to load favorites:", error);
      
      // Handle specific error types
      let errorMessage = "Unable to load favorites at this time";
      if (error?.response?.status === 401) {
        errorMessage = "Please log in to view your favorites";
      } else if (error?.response?.status >= 500) {
        errorMessage = "Server error. Please try again later";
      }

      return {
        data: { 
          items: [], 
          total: 0, 
          page: params.page || 1, 
          limit: params.limit || 20, 
          hasMore: false 
        },
        status: error?.response?.status || 500,
        message: errorMessage,
      };
    }
  },

  reportItem: async (itemId: string, reason: string): Promise<ApiResponse<void>> => {
    try {
      // Input validation and sanitization
      const sanitizedItemId = itemId?.toString()?.trim();
      if (!sanitizedItemId || isNaN(Number(sanitizedItemId)) || Number(sanitizedItemId) <= 0) {
        throw new Error('Invalid item ID provided');
      }

      if (!reason || reason.trim().length === 0) {
        throw new Error('Report reason is required');
      }

      if (reason.trim().length > 1000) {
        throw new Error('Report reason must be less than 1000 characters');
      }

      // Use the proper report endpoint
      const response = await apiClient.post(`/items/${sanitizedItemId}/report`, { 
        reason: reason.trim() 
      });

      return {
        data: undefined,
        status: 200,
        message: "Item reported successfully. We'll review your report.",
      };
    } catch (error: any) {
      console.error("Item report failed:", error);
      
      // Handle specific error types
      if (error?.response?.status === 400) {
        throw new Error('Invalid request. Please check your input.');
      } else if (error?.response?.status === 403) {
        throw new Error('You have already reported this item');
      } else if (error?.response?.status === 404) {
        throw new Error('Item not found or has been removed');
      } else if (error?.response?.status === 401) {
        throw new Error('Please log in to report items');
      } else if (error?.response?.status >= 500) {
        throw new Error('Server error. Please try again later');
      }
      
      // Generic error for unknown cases
      throw new Error('Unable to submit report. Please try again.');
    }
  },

  // Express interest in purchasing an item
  expressInterest: async (itemId: string, notes?: string): Promise<ApiResponse<any>> => {
    // Input validation and sanitization
    if (!itemId) {
      throw new Error('Item ID is required');
    }

    const sanitizedItemId = itemId.toString().trim();
    
    // Validate item ID format
    if (!/^\d+$/.test(sanitizedItemId)) {
      throw new Error('Invalid item ID format');
    }

    const sanitizedNotes = notes ? notes.trim().substring(0, 500) : '';

    try {
      const response = await apiClient.post(`/items/${sanitizedItemId}/interest`, { 
        notes: sanitizedNotes 
      });

      return {
        data: response.data,
        status: 201,
        message: "Interest expressed successfully",
      };
    } catch (error: any) {
      console.error("Express interest failed:", error);
      
      // For duplicate interest errors, don't re-throw, just pass through with better message
      if ((error.name === 'ValidationError' && error.status === 400) || 
          error.message?.includes('already expressed interest')) {
        // Create a new error but preserve the error type info
        const duplicateError = new Error('You have already shown interest in this item');
        duplicateError.name = 'DuplicateInterestError';
        (duplicateError as any).status = 400;
        (duplicateError as any).originalError = error;
        throw duplicateError;
      }
      
      // For other validation errors, provide specific messages
      if (error.name === 'ValidationError' || error.status === 400) {
        if (error.message?.includes('your own items')) {
          throw new Error('You cannot purchase your own items');
        } else if (error.message?.includes('already been sold')) {
          throw new Error('This item has already been sold');
        }
        throw new Error('Invalid request. Please check your input.');
      }
      
      // Handle other error types
      if (error.status === 404) {
        throw new Error('Item not found or has been removed');
      } else if (error.status === 401) {
        throw new Error('Please log in to express interest');
      } else if (error.status >= 500) {
        throw new Error('Server error. Please try again later');
      }
      
      // Re-throw the original error if we can't handle it specifically
      throw error;
    }
  },

  // Confirm or decline purchase
  confirmPurchase: async (purchaseId: string, confirmed: boolean, notes?: string): Promise<ApiResponse<any>> => {
    if (!purchaseId) {
      throw new Error('Purchase ID is required');
    }

    const sanitizedPurchaseId = purchaseId.toString().trim();
    
    if (!/^\d+$/.test(sanitizedPurchaseId)) {
      throw new Error('Invalid purchase ID format');
    }

    const sanitizedNotes = notes ? notes.trim().substring(0, 500) : '';

    try {
      const response = await apiClient.post(`/items/purchases/${sanitizedPurchaseId}/confirm`, {
        confirmed,
        notes: sanitizedNotes
      });

      return {
        data: response.data,
        status: 200,
        message: confirmed ? "Purchase confirmed successfully" : "Purchase declined",
      };
    } catch (error: any) {
      console.error("Confirm purchase failed:", error);
      
      if (error?.response?.status === 400) {
        throw new Error('Invalid request or purchase already processed');
      } else if (error?.response?.status === 403) {
        throw new Error('You are not authorized to modify this purchase');
      } else if (error?.response?.status === 404) {
        throw new Error('Purchase record not found');
      } else if (error?.response?.status === 401) {
        throw new Error('Please log in to confirm purchase');
      } else if (error?.response?.status >= 500) {
        throw new Error('Server error. Please try again later');
      }
      
      throw new Error('Unable to process purchase confirmation. Please try again.');
    }
  },

  // Seller confirms or rejects buyer purchase
  sellerConfirmPurchase: async (purchaseId: string, confirmed: boolean, notes?: string): Promise<ApiResponse<any>> => {
    if (!purchaseId) {
      throw new Error('Purchase ID is required');
    }

    const sanitizedPurchaseId = purchaseId.toString().trim();
    
    if (!/^\d+$/.test(sanitizedPurchaseId)) {
      throw new Error('Invalid purchase ID format');
    }

    const sanitizedNotes = notes ? notes.trim().substring(0, 500) : '';

    try {
      const response = await apiClient.post(`/items/purchases/${sanitizedPurchaseId}/seller-confirm`, {
        confirmed,
        notes: sanitizedNotes
      });

      return {
        data: response.data,
        status: 200,
        message: confirmed ? "Sale confirmed successfully!" : "Purchase request declined",
      };
    } catch (error: any) {
      console.error("Seller confirm purchase failed:", error);
      
      if (error?.response?.status === 400) {
        throw new Error('Purchase is not waiting for your confirmation');
      } else if (error?.response?.status === 403) {
        throw new Error('You are not authorized to confirm this purchase');
      } else if (error?.response?.status === 404) {
        throw new Error('Purchase record not found');
      } else if (error?.response?.status === 401) {
        throw new Error('Please log in to confirm purchase');
      } else if (error?.response?.status >= 500) {
        throw new Error('Server error. Please try again later');
      }
      
      throw new Error('Unable to process confirmation. Please try again.');
    }
  },

  // Get user's purchase history
  getMyPurchases: async (status?: string): Promise<ApiResponse<any[]>> => {
    try {
      const queryParams: Record<string, string> = {};
      if (status) {
        queryParams.status = status;
      }

      const response = await apiClient.get('/items/purchases/my-purchases', queryParams);
      const responseData = response.data as any;

      return {
        data: Array.isArray(responseData) ? responseData : (responseData?.data || []),
        status: 200,
        message: "Purchase history retrieved successfully",
      };
    } catch (error: any) {
      console.error("Get purchases failed:", error);
      
      if (error?.response?.status === 401) {
        throw new Error('Please log in to view purchase history');
      } else if (error?.response?.status >= 500) {
        throw new Error('Server error. Please try again later');
      }
      
      throw new Error('Unable to load purchase history. Please try again.');
    }
  },

  // Get pending purchase confirmations
  getPendingConfirmations: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get('/items/purchases/pending-confirmations');
      const responseData = response.data as any;

      return {
        data: Array.isArray(responseData) ? responseData : (responseData?.data || []),
        status: 200,
        message: "Pending confirmations retrieved successfully",
      };
    } catch (error: any) {
      console.error("Get pending confirmations failed:", error);
      
      if (error?.response?.status === 401) {
        throw new Error('Please log in to view pending confirmations');
      } else if (error?.response?.status >= 500) {
        throw new Error('Server error. Please try again later');
      }
      
      throw new Error('Unable to load pending confirmations. Please try again.');
    }
  },

  // Get purchase by ID
  getPurchaseById: async (purchaseId: string): Promise<ApiResponse<any>> => {
    if (!purchaseId) {
      throw new Error('Purchase ID is required');
    }

    const sanitizedPurchaseId = purchaseId.toString().trim();
    
    if (!/^\d+$/.test(sanitizedPurchaseId)) {
      throw new Error('Invalid purchase ID format');
    }

    try {
      return await apiClient.get(`/items/purchases/${sanitizedPurchaseId}`);
    } catch (error: any) {
      console.error("Get purchase failed:", error);
      
      if (error?.response?.status === 403) {
        throw new Error('You are not authorized to view this purchase');
      } else if (error?.response?.status === 404) {
        throw new Error('Purchase not found');
      } else if (error?.response?.status === 401) {
        throw new Error('Please log in to view purchase details');
      }
      
      throw new Error('Unable to load purchase details. Please try again.');
    }
  },

  // Get pending sales for seller
  getPendingSales: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get('/items/sales/pending');
      // Backend returns {success: true, data: [...]} so extract the data array
      const responseData = response.data as any;
      const salesData = responseData?.data || responseData || [];
      
      return {
        data: Array.isArray(salesData) ? salesData : [],
        status: response.status,
        message: responseData?.message || "Pending sales retrieved successfully",
      };
    } catch (error: any) {
      console.error("Get pending sales failed:", error);
      
      if (error?.response?.status === 401) {
        throw new Error('Please log in to view pending sales');
      }
      
      throw new Error('Unable to load pending sales. Please try again.');
    }
  },

};

// ===== USERS API =====
export const usersApi = {
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
  ): Promise<ApiResponse<{ isFollowing: boolean }>> => {
    console.warn("Follow user not implemented in backend yet");
    return Promise.resolve({
      data: { isFollowing: true },
      status: 200,
      message: "Mock response",
    });
  },

  blockUser: (userId: string): Promise<ApiResponse<void>> => {
    console.warn("Block user not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  reportUser: (userId: string, reason: string): Promise<ApiResponse<void>> => {
    console.warn("Report user not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  // Admin endpoints for user management
  getAllUsers: (): Promise<ApiResponse<User[]>> => {
    console.warn("Admin getAllUsers not implemented in backend yet");
    return Promise.resolve({
      data: [],
      status: 200,
      message: "Mock response",
    });
  },

  verifyUser: (userId: string, verify: boolean): Promise<ApiResponse<void>> => {
    console.warn("Admin verifyUser not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  deleteUser: (userId: string): Promise<ApiResponse<void>> => {
    console.warn("Admin deleteUser not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  banUser: (userId: string, reason?: string): Promise<ApiResponse<void>> => {
    console.warn("Admin banUser not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  // Admin endpoints for conversations/messages
  getAllConversations: (): Promise<ApiResponse<any[]>> => {
    console.warn("Admin getAllConversations not implemented in backend yet");
    const mockConversations = [
      {
        id: '1',
        participants: ['user1', 'user2'],
        participantNames: ['John Doe', 'Jane Smith'],
        lastMessage: 'Is this still available?',
        lastMessageTime: '2024-01-15T10:30:00Z',
        messageCount: 5,
        status: 'active'
      }
    ];
    return Promise.resolve({
      data: mockConversations,
      status: 200,
      message: "Mock response",
    });
  },

  getConversationMessages: (conversationId: string): Promise<ApiResponse<any[]>> => {
    console.warn("Admin getConversationMessages not implemented in backend yet");
    const mockMessages = [
      {
        id: '1',
        senderId: 'user1',
        senderName: 'John Doe',
        content: 'Hi, is this available?',
        timestamp: '2024-01-15T10:00:00Z'
      }
    ];
    return Promise.resolve({
      data: mockMessages,
      status: 200,
      message: "Mock response",
    });
  },

  // Admin endpoints for system settings
  getSystemSettings: (): Promise<ApiResponse<any>> => {
    console.warn("Admin getSystemSettings not implemented in backend yet");
    return Promise.resolve({
      data: {
        general: { siteName: 'XMarket', maintenanceMode: false },
        security: { maxLoginAttempts: 5, sessionTimeout: 24 },
        marketplace: { requireItemApproval: false, maxImagesPerItem: 5 }
      },
      status: 200,
      message: "Mock response",
    });
  },

  updateSystemSettings: (settings: any): Promise<ApiResponse<void>> => {
    console.warn("Admin updateSystemSettings not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Settings updated successfully",
    });
  },
};

// ===== SERVICES API (NEW) =====
export const servicesApi = {
  getServices: (
    params: SearchServicesParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Service>>> =>
    apiClient.get("/services", params),

  getService: (id: string): Promise<ApiResponse<Service>> =>
    apiClient.get(`/services/${id}`),

  createService: (data: CreateServiceData): Promise<ApiResponse<Service>> =>
    apiClient.post("/services", data),

  updateService: (
    id: string,
    data: Partial<CreateServiceData>
  ): Promise<ApiResponse<Service>> => apiClient.patch(`/services/${id}`, data),

  deleteService: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/services/${id}`),

  // Service Ratings
  addRating: (
    serviceId: string,
    rating: CreateRatingData
  ): Promise<ApiResponse<Rating>> =>
    apiClient.post(`/services/${serviceId}/ratings`, rating),

  getServiceRatings: (
    serviceId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<Rating>>> =>
    apiClient.get(`/services/${serviceId}/ratings`, params),
};

// ===== INTERESTS API (NEW) =====
export const interestsApi = {
  showInterest: (data: CreateInterestData): Promise<ApiResponse<Interest>> =>
    apiClient.post("/interests", data),

  getItemInterests: (itemId: number): Promise<ApiResponse<Interest[]>> =>
    apiClient.get(`/interests/item/${itemId}`),

  getUserInterests: (userId: number): Promise<ApiResponse<Interest[]>> =>
    apiClient.get(`/interests/user/${userId}`),

  removeInterest: (id: number): Promise<ApiResponse<void>> =>
    apiClient.delete(`/interests/${id}`),
};

// ===== UPLOAD API (NEW) =====
export const uploadsApi = {
  uploadSingle: (
    file: File
  ): Promise<
    ApiResponse<{
      message: string;
      filename: string;
      originalName: string;
      size: number;
      url: string;
    }>
  > => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.uploadFile("/uploads/single", formData);
  },

  uploadMultiple: (
    files: File[]
  ): Promise<
    ApiResponse<{
      message: string;
      files: Array<{
        filename: string;
        originalName: string;
        size: number;
        url: string;
      }>;
    }>
  > => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiClient.uploadFile("/uploads/multiple", formData);
  },
};

// ===== MOCK APIS FOR MISSING BACKEND FEATURES =====

// Messages API (Backend not implemented)
export const messagesApi = {
  getConversations: (): Promise<ApiResponse<Conversation[]>> => {
    // Note: Messages system not implemented in backend yet
    return Promise.resolve({ data: [], status: 200, message: "Mock response" });
  },

  getConversation: (
    conversationId: string
  ): Promise<ApiResponse<Conversation>> => {
    // Note: Messages system not implemented in backend yet
    return Promise.resolve({
      data: {
        id: conversationId,
        participants: [],
        messages: [],
        updatedAt: new Date().toISOString(),
      } as any,
      status: 200,
      message: "Mock response",
    });
  },

  getMessages: (
    conversationId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<Message>>> => {
    // Note: Messages system not implemented in backend yet
    return Promise.resolve({
      data: { items: [], total: 0, page: 1, limit: 10, hasMore: false },
      status: 200,
      message: "Mock response",
    });
  },

  sendMessage: (
    conversationId: string,
    content: string
  ): Promise<ApiResponse<Message>> => {
    // Note: Messages system not implemented in backend yet
    return Promise.resolve({
      data: {
        id: "1",
        content,
        senderId: "1",
        conversationId,
        createdAt: new Date().toISOString(),
      } as any,
      status: 200,
      message: "Mock response",
    });
  },

  createConversation: (
    participantId: string,
    itemId?: string
  ): Promise<ApiResponse<Conversation>> => {
    // Note: Messages system not implemented in backend yet
    return Promise.resolve({
      data: {
        id: "1",
        participants: [],
        messages: [],
        updatedAt: new Date().toISOString(),
      } as any,
      status: 200,
      message: "Mock response",
    });
  },

  markAsRead: (conversationId: string): Promise<ApiResponse<void>> => {
    // Note: Messages system not implemented in backend yet
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  deleteConversation: (conversationId: string): Promise<ApiResponse<void>> => {
    // Note: Messages system not implemented in backend yet
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },
};

// Search API (Backend partially implemented)
export const searchApi = {
  searchItems: (
    query: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    // Use regular items search with 'search' parameter
    apiClient.get("/items", { search: query, ...params }),

  getSearchSuggestions: (query: string): Promise<ApiResponse<string[]>> => {
    console.warn("Search suggestions not implemented in backend yet");
    return Promise.resolve({ data: [], status: 200, message: "Mock response" });
  },

  getPopularSearches: (): Promise<ApiResponse<string[]>> => {
    console.warn("Popular searches not implemented in backend yet");
    return Promise.resolve({ data: [], status: 200, message: "Mock response" });
  },

  saveSearch: (query: string): Promise<ApiResponse<void>> => {
    console.warn("Search history not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  getSearchHistory: (): Promise<ApiResponse<string[]>> => {
    console.warn("Search history not implemented in backend yet");
    return Promise.resolve({ data: [], status: 200, message: "Mock response" });
  },

  clearSearchHistory: (): Promise<ApiResponse<void>> => {
    console.warn("Search history not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },
};

// Categories API (Backend implemented via /items/categories)
export const categoriesApi = {
  getCategories: (): Promise<
    ApiResponse<Array<{id: string; name: string; icon?: string; description?: string}>>
  > => apiClient.get("/items/categories"),

  getCategoryItems: (
    categoryId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    apiClient.get("/items", { category: categoryId, ...params }),
};

// Notifications API
export const notificationsApi = {
  getNotifications: (
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<{ data: any[], pagination: any }>> => {
    // Always provide default values
    const page = params.page || 1;
    const limit = params.limit || 20;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    const url = `/notifications?${queryParams.toString()}`;
    return apiClient.get(url);
  },

  getUnreadCount: (): Promise<ApiResponse<{ count: number }>> => {
    return apiClient.get('/notifications/unread-count');
  },

  markAsRead: (notificationId: string): Promise<ApiResponse<void>> => {
    return apiClient.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: (): Promise<ApiResponse<void>> => {
    return apiClient.patch('/notifications/mark-all-read');
  },

  deleteNotification: (notificationId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  updateSettings: (
    settings: Record<string, boolean>
  ): Promise<ApiResponse<void>> => {
    return apiClient.patch('/notifications/settings', settings);
  },

  getSettings: (): Promise<ApiResponse<Record<string, boolean>>> => {
    return apiClient.get('/notifications/settings');
  },
};

// ===== JOIN REQUESTS API =====
export const joinRequestsApi = {
  // Create a new join request
  create: (data: {
    fullName: string;
    email: string;
    whatsappNumber: string;
  }): Promise<ApiResponse<any>> =>
    apiClient.post("/join-requests", data),

  // Get all join requests (Admin only)
  getAll: (): Promise<ApiResponse<any[]>> =>
    apiClient.get("/join-requests"),

  // Get pending join requests (Admin only)
  getPending: (): Promise<ApiResponse<any[]>> =>
    apiClient.get("/join-requests/pending"),

  // Get join request statistics (Admin only)
  getStats: (): Promise<ApiResponse<any>> =>
    apiClient.get("/join-requests/stats"),

  // Update join request status (Admin only)
  updateStatus: (id: number, status: string): Promise<ApiResponse<any>> =>
    apiClient.patch(`/join-requests/${id}`, { status }),
};

// ===== EXPORT ALL APIS =====
export const api = {
  auth: authApi,
  items: itemsApi,
  users: usersApi,
  services: servicesApi, // NEW: Services marketplace
  interests: interestsApi, // NEW: Interest tracking (replaces favorites)
  uploads: uploadsApi, // NEW: Generic file uploads
  messages: messagesApi, // MOCK: Until backend implements
  search: searchApi, // PARTIAL: Basic search works, advanced features mocked
  categories: categoriesApi, // UPDATED: Uses /items/categories
  notifications: notificationsApi,
  joinRequests: joinRequestsApi, // NEW: Join requests for access control
};

export default api;
