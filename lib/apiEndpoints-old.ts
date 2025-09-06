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
  otp: string;
  name: string;
  password: string;
  program: string;
  year: string;
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
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
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
  itemId: number;
  userId: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== PAGINATION INTERFACE =====

// ===== PAGINATION INTERFACE =====
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
    const authData = response.data as any;
    return {
      ...response,
      data: {
        message: authData.message,
        user: transformUser(authData.user)
      }
    };
  },

  logout: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post("/auth/logout"),

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
    const response = await apiClient.get("/auth/me");
    return {
      ...response,
      data: transformUser(response.data)
    };
  },
};

// Transform backend user data to frontend format
const transformUser = (backendUser: any): User => ({
  id: backendUser.id.toString(),
  name: backendUser.fullName || backendUser.name || 'Anonymous User',
  program: backendUser.program || 'Unknown',
  year: backendUser.year || 'Unknown',
  verified: backendUser.isVerified || false,
  avatar: backendUser.profileImageUrl,
  anonymous: false
});

// Transform backend item data to frontend format
const transformItem = (backendItem: any): Item => ({
  id: backendItem.id.toString(),
  title: backendItem.title,
  description: backendItem.description,
  price: parseFloat(backendItem.price),
  category: {
    id: backendItem.category,
    name: 'Category', // Will be populated by category lookup
    icon: '📦'
  },
  photos: backendItem.images || [],
  sellerId: backendItem.sellerId.toString(),
  seller: {
    id: backendItem.seller.id.toString(),
    name: backendItem.seller.fullName,
    program: 'Unknown',
    year: 'Unknown',
    verified: backendItem.seller.isVerified,
    avatar: backendItem.seller.profileImageUrl,
    anonymous: false
  },
  createdAt: backendItem.createdAt,
  featured: false
});

// Items API
export const itemsApi = {
  getItems: async (
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    const response = await apiClient.get("/items", params) as ApiResponse<{items: any[], total: number}>;
    // Transform the items
    if (response.data && response.data.items) {
      const transformedItems = response.data.items.map(transformItem);
      return {
        data: {
          items: transformedItems,
          total: response.data.total,
          page: 1, // Default values since backend doesn't return these
          limit: 20,
          hasMore: false
        },
        status: response.status,
        message: response.message
      };
    }
    return response as ApiResponse<PaginatedResponse<Item>>;
  },

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
    ApiResponse<Array<{ id: string; name: string }>>
  > => apiClient.get("/items/categories"),

  // Mock endpoints - Backend not implemented yet
  toggleFavorite: (
    itemId: string
  ): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    console.warn(
      "Favorites not implemented in backend yet - use interests API"
    );
    return Promise.resolve({
      data: { isFavorite: true },
      status: 200,
      message: "Mock response - use interests API instead",
    });
  },

  getFavorites: (): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    console.warn(
      "Favorites not implemented in backend yet - use interests API"
    );
    return Promise.resolve({
      data: { items: [], total: 0, page: 1, limit: 10, hasMore: false },
      status: 200,
      message: "Mock response - use interests API instead",
    });
  },

  reportItem: (itemId: string, reason: string): Promise<ApiResponse<void>> => {
    console.warn("Item reporting not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },
};

// ===== USERS API =====
export const usersApi = {
  // Profile Management
  getProfile: (): Promise<ApiResponse<User>> => apiClient.get("/users/profile"),

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
    apiClient.patch("/users/profile", data), // Backend uses PATCH

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

  getUserInterests: (userId: number): Promise<ApiResponse<Interest[]>> =>
    apiClient.get(`/users/${userId}/interests`),

  // Mock endpoints - Backend not implemented yet
  getUser: (id: string): Promise<ApiResponse<User>> => {
    console.warn("Get user by ID not implemented in backend yet");
    return Promise.resolve({
      data: {} as User,
      status: 200,
      message: "Mock response",
    });
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

// ===== MESSAGES API (Backend implemented) =====
export const messagesApi = {
  getConversations: (): Promise<ApiResponse<Conversation[]>> =>
    apiClient.get("/messages/conversations"),

  getConversation: (
    conversationId: string
  ): Promise<ApiResponse<Conversation>> =>
    apiClient.get(`/messages/conversations/${conversationId}`),

  getMessages: (
    conversationId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<Message>>> =>
    apiClient.get(
      `/messages/conversations/${conversationId}/messages`,
      params
    ),

  sendMessage: (
    conversationId: string,
    content: string
  ): Promise<ApiResponse<Message>> =>
    apiClient.post(`/messages/conversations/${conversationId}/messages`, {
      content,
    }),

  createConversation: (
    participantId: string,
    itemId?: string
  ): Promise<ApiResponse<Conversation>> =>
    apiClient.post("/messages/conversations", { participantId, itemId }),

  markAsRead: (conversationId: string): Promise<ApiResponse<void>> =>
    apiClient.patch(`/messages/conversations/${conversationId}/read`),

  deleteConversation: (conversationId: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/messages/conversations/${conversationId}`),
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
    ApiResponse<Array<{ id: string; name: string; icon?: string }>>
  > => apiClient.get("/items/categories"),

  getCategoryItems: (
    categoryId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    apiClient.get("/items", { category: categoryId, ...params }),
};

// Notifications API (Backend not implemented)
export const notificationsApi = {
  getNotifications: (
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    console.warn("Notifications system not implemented in backend yet");
    return Promise.resolve({
      data: { items: [], total: 0, page: 1, limit: 10, hasMore: false },
      status: 200,
      message: "Mock response",
    });
  },

  markAsRead: (notificationId: string): Promise<ApiResponse<void>> => {
    console.warn("Notifications system not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  markAllAsRead: (): Promise<ApiResponse<void>> => {
    console.warn("Notifications system not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  updateSettings: (
    settings: Record<string, boolean>
  ): Promise<ApiResponse<void>> => {
    console.warn("Notifications system not implemented in backend yet");
    return Promise.resolve({
      data: undefined,
      status: 200,
      message: "Mock response",
    });
  },

  getSettings: (): Promise<ApiResponse<Record<string, boolean>>> => {
    console.warn("Notifications system not implemented in backend yet");
    return Promise.resolve({ data: {}, status: 200, message: "Mock response" });
  },
};

// ===== EXPORT ALL APIS =====
export const api = {
  auth: authApi,
  items: itemsApi,
  users: usersApi,
  services: servicesApi, // NEW: Services marketplace
  interests: interestsApi, // NEW: Interest tracking (replaces favorites)
  uploads: uploadsApi, // NEW: Generic file uploads
  messages: messagesApi, // IMPLEMENTED: Backend has full messages system
  search: searchApi, // PARTIAL: Basic search works, advanced features mocked
  categories: categoriesApi, // UPDATED: Uses /items/categories
  notifications: notificationsApi, // MOCK: Until backend implements
};

export default api;
