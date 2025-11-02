/**
 * Search and Uploads API endpoints
 * Split from apiEndpoints.ts for better code splitting and performance
 */

import apiClient, { ApiResponse } from "../api";
import { Item } from "../../types";

// Interfaces
export interface SearchParams {
  search?: string;
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

// ===== SEARCH API =====
export const searchApi = {
  searchItems: (
    query: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    // Use dedicated search endpoint
    apiClient.get("/search/items", { query, ...params }),

  getSearchSuggestions: (query: string): Promise<ApiResponse<string[]>> => {
    return apiClient.get("/search/suggestions", { query });
  },

  getPopularSearches: (): Promise<ApiResponse<string[]>> => {
    return apiClient.get("/search/popular");
  },

  saveSearch: (query: string): Promise<ApiResponse<void>> => {
    return apiClient.post("/search/history", { query });
  },

  getSearchHistory: (): Promise<ApiResponse<string[]>> => {
    return apiClient.get("/search/history");
  },

  clearSearchHistory: (): Promise<ApiResponse<void>> => {
    return apiClient.delete("/search/history");
  }
};

// ===== UPLOADS API =====
export const uploadsApi = {
  // Optimized Image Upload (Backend endpoint: POST /uploads/upload-optimized)
  uploadOptimizedImage: (
    image: File
  ): Promise<ApiResponse<{
    success: boolean;
    message: string;
    urls: {
      primary: string;
      fallback?: string;
    };
    cloudinary: {
      success: boolean;
      url: string;
      publicId: string;
    };
    spaces: {
      success: boolean;
      url?: string;
    };
    storage: {
      originalSize: number;
      uploaded: string;
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
};