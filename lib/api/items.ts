/**
 * Items API endpoints
 * Split from apiEndpoints.ts for better code splitting and performance
 */

import apiClient, { ApiResponse } from "../api";
import { Item } from "../../types";

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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

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

  // Optimized Image Upload (Backend endpoint: POST /uploads/upload-optimized)
  uploadOptimizedImage: (
    image: File
  ): Promise<ApiResponse<{
    cloudinaryUrl: string;
    spacesUrls: {
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
    };
    metadata: {
      originalSize: number;
      optimizedSizes: {
        thumbnail: number;
        small: number;
        medium: number;
        large: number;
      };
      spaceSaved: number;
      spaceSavedPercentage: number;
    };
  }>> => {
    const formData = new FormData();
    formData.append("file", image);
    return apiClient.uploadFile(`/uploads/upload-optimized`, formData);
  },

  // Generate Presigned URL for Direct Upload (Backend endpoint: POST /uploads/generate-presigned-url)
  generatePresignedUrl: (
    filename: string,
    contentType: string,
    category: 'avatar' | 'item' | 'service',
    itemId?: number
  ): Promise<ApiResponse<{
    presignedUrl: string;
    publicUrl: string;
    key: string;
    expiresIn: number;
    uploadInstructions: {
      method: string;
      headers: { [key: string]: string };
    };
    organization: {
      folder: string;
      structure: string;
    };
  }>> => 
    apiClient.post(`/uploads/generate-presigned-url`, {
      filename,
      contentType,
      category,
      itemId
    }),

  // Generate Batch Presigned URLs (Backend endpoint: POST /uploads/generate-batch-presigned-urls)
  generateBatchPresignedUrls: (
    filenames: string[],
    contentType: string,
    itemId: number
  ): Promise<ApiResponse<{
    count: number;
    urls: Array<{
      presignedUrl: string;
      publicUrl: string;
      key: string;
    }>;
    expiresIn: number;
    uploadInstructions: {
      method: string;
      note: string;
    };
    organization: {
      folder: string;
      structure: string;
    };
  }>> =>
    apiClient.post(`/uploads/generate-batch-presigned-urls`, {
      filenames,
      contentType,
      itemId
    }),

  // Direct Upload to Presigned URL
  uploadToPresignedUrl: async (
    presignedUrl: string,
    file: File,
    contentType: string
  ): Promise<Response> => {
    return fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: file
    });
  },

  // Get Best Image URL for Size (Backend endpoint: GET /uploads/best-image-url-size)
  getBestImageUrl: (
    imageId: string,
    preferredSize: 'thumbnail' | 'small' | 'medium' | 'large'
  ): Promise<ApiResponse<{ url: string; size: string }>> =>
    apiClient.get(`/uploads/best-image-url-size`, { imageId, preferredSize }),

  // Delete Image (Backend endpoint: DELETE /images/:imageId)
  deleteItemImage: (
    imageId: string
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/images/${imageId}`),

  // Categories (Backend endpoint: GET /categories)
  getCategories: (): Promise<
    ApiResponse<Array<{id: string; name: string; icon?: string; description?: string}>>
  > => apiClient.get("/categories"),

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
      if (process.env.NODE_ENV === 'development') {
        console.error("Favorites toggle failed:", error);
      }
      
      // Handle specific error types
      if (error?.response?.status === 400) {
        throw new Error('Cannot favorite your own item or invalid request');
      } else if (error?.response?.status === 404) {
        throw new Error('Item not found or has been removed');
      } else if (error?.response?.status === 401) {
        throw new Error('Please log in to favorite items');
      } else {
        throw new Error('Unable to update favorite status. Please try again.');
      }
    }
  },

  removeFavorite: async (
    itemId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.delete(`/items/${itemId}/favorite`);
      return {
        data: { message: 'Removed from favorites' },
        status: 200,
        message: 'Removed from favorites'
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Remove favorite failed:", error);
      }
      throw new Error('Unable to remove from favorites. Please try again.');
    }
  },

  checkFavorite: async (
    itemId: string
  ): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    try {
      // Input validation
      const sanitizedItemId = itemId?.toString()?.trim();
      if (!sanitizedItemId || isNaN(Number(sanitizedItemId)) || Number(sanitizedItemId) <= 0) {
        return {
          data: { isFavorite: false },
          status: 400,
          message: 'Invalid item ID'
        };
      }

      // Proper endpoint for checking favorite status using item_favorites table
      const response = await apiClient.get(`/items/${sanitizedItemId}/favorite`);
      const data = response.data as { isFavorite: boolean };
      
      // Validate response and default to false if not properly structured
      const isFavorite = typeof data?.isFavorite === 'boolean' ? data.isFavorite : false;

      return {
        data: { isFavorite },
        status: 200,
        message: 'Favorite status retrieved'
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Check favorite failed:", error);
      }
      
      // Always return false for favorite status on error
      // This prevents UI from breaking and defaults to safe state
      return {
        data: { isFavorite: false },
        status: 200,
        message: 'Favorite status defaulted to false due to error'
      };
    }
  },

  getFavorites: async (
    params: {
      page?: number;
      limit?: number;
      sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
    } = {}
  ): Promise<ApiResponse<{
    items: Item[];
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>> => {
    try {
      // Clean parameters for API call
      const cleanParams = {
        page: params.page || 1,
        limit: params.limit || 12,
        sort: params.sort || 'newest'
      };

      // Use the proper favorites endpoint that works with item_favorites table
      const response = await apiClient.get('/items/favorites', cleanParams);

      // Backend returns { success: true, data: [...items], pagination: {...} }
      // We need to transform it to match the expected frontend format
      const backendData = response.data;
      
      if (!backendData.success || !backendData.data) {
        throw new Error('Invalid response format from server');
      }

      const items = backendData.data as Item[];
      const pagination = backendData.pagination || {};
      
      const data = {
        items: items,
        total: pagination.total || 0,
        page: pagination.page || 1,
        totalPages: pagination.pages || 0,
        hasNextPage: pagination.page < pagination.pages,
        hasPreviousPage: pagination.page > 1
      };

      return {
        data,
        status: 200,
        message: 'Favorites loaded successfully'
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to load favorites:", error);
      }
      
      // Handle specific error types
      let errorMessage = "Unable to load favorites at this time";
      
      if (error?.response?.status === 401) {
        errorMessage = "Please log in to view your favorites";
      } else if (error?.response?.status === 404) {
        errorMessage = "No favorites found";
      }

      throw new Error(errorMessage);
    }
  },

  // Purchasing & Interaction
  confirmPurchase: (id: string, confirmed: boolean, notes?: string): Promise<ApiResponse<any>> =>
    apiClient.post(`/items/purchases/${id}/confirm`, { confirmed, notes }),

  confirmSale: (id: string, confirmed: boolean, notes?: string): Promise<ApiResponse<any>> =>
    apiClient.post(`/items/purchases/${id}/seller-confirm`, { confirmed, notes }),

  reportItem: async (itemId: string, reason: string, description?: string): Promise<ApiResponse<void>> => {
    try {
      // Input validation and sanitization
      const sanitizedItemId = itemId?.toString()?.trim();
      if (!sanitizedItemId || isNaN(Number(sanitizedItemId)) || Number(sanitizedItemId) <= 0) {
        throw new Error('Invalid item ID provided');
      }

      if (!reason || reason.trim().length === 0) {
        throw new Error('Report reason is required');
      }

      if (reason.trim().length > 500) {
        throw new Error('Report reason must be less than 500 characters');
      }

      if (description && description.trim().length > 1000) {
        throw new Error('Report description must be less than 1000 characters');
      }

      // Send reason and description as separate fields
      const requestBody: { reason: string; description?: string } = { 
        reason: reason.trim() 
      };
      
      if (description && description.trim()) {
        requestBody.description = description.trim();
      }

      const response = await apiClient.post(`/items/${sanitizedItemId}/report`, requestBody);

      return {
        data: undefined,
        status: 200,
        message: "Item reported successfully. We'll review your report.",
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Item report failed:", error);
      }
      
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
      if (process.env.NODE_ENV === 'development') {
        console.error("Express interest failed:", error);
      }
      
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

      // Generic error for unknown cases
      throw new Error('Unable to express interest. Please try again.');
    }
  },

  getPendingSales: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get('/items/sales/pending');
      return {
        data: (response.data || []) as any[],
        status: 200,
        message: 'Pending sales loaded successfully'
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Get pending sales failed:", error);
      }
      
      if (error?.response?.status === 401) {
        throw new Error('Please log in to view pending sales');
      } else if (error?.response?.status === 404) {
        // No pending sales found is not an error
        return {
          data: [],
          status: 200,
          message: 'No pending sales found'
        };
      }
      
      throw new Error('Unable to load pending sales. Please try again.');
    }
  },

  // Additional Purchase Management Methods
  getPendingConfirmations: async (): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    try {
      const response = await apiClient.get("/items/purchases/pending-confirmations");
      
      return {
        data: (response.data || []) as any,
        status: response.status,
        message: response.message || 'Pending confirmations loaded successfully'
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Get pending confirmations failed:", error);
      }
      
      if (error?.response?.status === 401) {
        throw new Error('Please log in to view pending confirmations');
      } else if (error?.response?.status === 404) {
        // No pending confirmations found is not an error
        return {
          data: [] as any,
          status: 200,
          message: 'No pending confirmations found'
        };
      }
      
      throw new Error('Unable to load pending confirmations. Please try again.');
    }
  },

  getMyPurchases: async (status?: string): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get("/items/purchases/my-purchases", params);
      
      return {
        data: (response.data || []) as any,
        status: response.status,
        message: response.message || 'Purchases loaded successfully'
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Get my purchases failed:", error);
      }
      
      if (error?.response?.status === 401) {
        throw new Error('Please log in to view your purchases');
      } else if (error?.response?.status === 404) {
        // No purchases found is not an error
        return {
          data: [] as any,
          status: 200,
          message: 'No purchases found'
        };
      }
      
      throw new Error('Unable to load your purchases. Please try again.');
    }
  }
};