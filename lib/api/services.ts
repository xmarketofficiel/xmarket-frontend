/**
 * Services API endpoints
 */

import apiClient, { ApiResponse } from "../api";

// ===== SERVICES INTERFACES =====
export interface CreateServiceData {
  title: string;
  description: string;
  price: number;
  serviceCategoryId: string; // UUID
  type: 'time-based' | 'ongoing';
  departureTime?: string; // ISO string for time-based services
  location?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  priceTo?: number;
  serviceCategoryId: string;
  type: 'time-based' | 'ongoing';
  availability: 'instant' | 'scheduled';
  duration?: string;
  departureTime?: string;
  distance?: string;
  location?: string;
  imageUrl?: string;
  featured: boolean;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: any;
  serviceCategory?: any;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  backgroundImage?: string;
  type: 'time-based' | 'ongoing' | 'both';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchServicesParams {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ===== SERVICES API =====
export const servicesApi = {
  // Get all services with pagination and filters
  getServices: (
    params: SearchServicesParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Service>>> =>
    apiClient.get("/services", params),

  // Get single service by ID
  getService: (id: string): Promise<ApiResponse<Service>> =>
    apiClient.get(`/services/${id}`),

  // Create new service
  createService: (data: CreateServiceData): Promise<ApiResponse<Service>> =>
    apiClient.post("/services", data),

  // Update service
  updateService: (
    id: string,
    data: Partial<CreateServiceData>
  ): Promise<ApiResponse<Service>> => 
    apiClient.patch(`/services/${id}`, data),

  // Delete service (soft delete)
  deleteService: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/services/${id}`),

  // Get service categories
  getServiceCategories: (): Promise<ApiResponse<ServiceCategory[]>> =>
    apiClient.get("/service-categories"),

  // Add rating to service
  addRating: (
    serviceId: string,
    rating: number,
    comment?: string
  ): Promise<ApiResponse<any>> =>
    apiClient.post(`/services/${serviceId}/ratings`, { rating, comment }),

  // Get service ratings
  getServiceRatings: (
    serviceId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<any>>> =>
    apiClient.get(`/services/${serviceId}/ratings`, { page, limit }),
};
