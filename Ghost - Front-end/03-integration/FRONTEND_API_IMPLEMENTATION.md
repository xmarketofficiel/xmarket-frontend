# Frontend API Implementation Guide

This file contains all the specific code changes needed to connect the frontend with the CampusSuperApp backend.

## 1. Environment Configuration

### Update .env.local
```bash
# Backend Connection
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3001/uploads

# Cookie Configuration  
NEXT_PUBLIC_COOKIE_DOMAIN=localhost
NEXT_PUBLIC_COOKIE_SECURE=false

# Frontend Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
PWA_ENABLED=false
```

## 2. API Client Configuration Update

### Update lib/api.ts
```typescript
// Add to ApiClient class for cookie support
class ApiClient {
  // ... existing code ...

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Remove manual Authorization header - cookies handle this
    // if (this.authToken) {
    //   defaultHeaders.Authorization = `Bearer ${this.authToken}`;
    // }

    const requestOptions: RequestInit = {
      ...options,
      credentials: 'include', // Include cookies in requests
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // ... rest of existing makeRequest code ...
  }

  // Remove manual token methods since cookies handle auth
  // setAuthToken(token: string | null) { ... }
  // getAuthToken(): string | null { ... }
}

// Update base URL
const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  retries: 3,
});
```

## 3. Authentication API Updates

### Update lib/apiEndpoints.ts - authApi section
```typescript
// Replace existing authApi with:
export const authApi = {
  // OTP-based Registration Flow
  sendOtp: (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/send-otp', { email }),

  verifyOtp: (email: string, otp: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/verify-otp', { email, otp }),

  completeRegistration: (data: CompleteRegistrationData): Promise<ApiResponse<{ 
    message: string; 
    user: User 
  }>> =>
    apiClient.post('/auth/complete-registration', data),

  // Updated Login (cookies-based)
  login: (credentials: LoginCredentials): Promise<ApiResponse<{ 
    message: string; 
    user: User 
  }>> =>
    apiClient.post('/auth/login', credentials),

  // Updated Logout (cookies-based)
  logout: (): Promise<ApiResponse<{ message: string }>> => 
    apiClient.post('/auth/logout'),

  // Updated Token Refresh (cookies-based)
  refreshToken: (): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/refresh'),

  // Password Reset Flow
  forgotPassword: (email: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (
    email: string, 
    otp: string, 
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post('/auth/reset-password', { email, otp, newPassword }),

  // Get Current User (use users profile endpoint)
  getCurrentUser: (): Promise<ApiResponse<User>> => 
    apiClient.get('/users/profile'),
};

// Add new interface for complete registration
export interface CompleteRegistrationData {
  email: string;
  otp: string;
  name: string;
  password: string;
  program: string;
  year: string;
}
```

## 4. Items API Updates

### Update lib/apiEndpoints.ts - itemsApi section
```typescript
// Update existing itemsApi:
export const itemsApi = {
  getItems: (params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    apiClient.get('/items', params),

  getItem: (id: string): Promise<ApiResponse<Item>> =>
    apiClient.get(`/items/${id}`),

  createItem: (data: CreateItemData): Promise<ApiResponse<Item>> => {
    // Remove photos from main data since they're uploaded separately
    const { photos, ...itemData } = data;
    return apiClient.post('/items', itemData);
  },

  updateItem: (id: string, data: Partial<CreateItemData>): Promise<ApiResponse<Item>> => {
    const { photos, ...itemData } = data;
    return apiClient.patch(`/items/${id}`, itemData); // Backend uses PATCH
  },

  deleteItem: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/items/${id}`),

  // Updated image upload to match backend
  uploadItemImages: (
    itemId: string,
    images: File[]
  ): Promise<ApiResponse<{ urls: string[] }>> => {
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    return apiClient.uploadFile(`/items/${itemId}/images`, formData);
  },

  // New: Delete specific image
  deleteItemImage: (imageId: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/images/${imageId}`),

  // Updated categories endpoint
  getCategories: (): Promise<ApiResponse<Array<{ id: string; name: string }>>> =>
    apiClient.get('/items/categories'),

  // Favorites - These need backend implementation
  // TODO: Backend needs to implement these endpoints
  toggleFavorite: (itemId: string): Promise<ApiResponse<{ isFavorite: boolean }>> => {
    console.warn('Favorites not implemented in backend yet');
    return Promise.resolve({ 
      data: { isFavorite: true }, 
      status: 200, 
      message: 'Mock response' 
    });
  },

  getFavorites: (): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    console.warn('Favorites not implemented in backend yet');
    return Promise.resolve({ 
      data: { items: [], total: 0, page: 1, limit: 10, hasMore: false }, 
      status: 200, 
      message: 'Mock response' 
    });
  },

  // Reporting - Needs backend implementation
  reportItem: (itemId: string, reason: string): Promise<ApiResponse<void>> => {
    console.warn('Item reporting not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },
};

// Update CreateItemData interface to match backend
export interface CreateItemData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair'; // Backend enum
  photos?: File[]; // Optional since uploaded separately
}
```

## 5. Users API Updates  

### Update lib/apiEndpoints.ts - usersApi section
```typescript
// Update existing usersApi:
export const usersApi = {
  // Current user profile
  getProfile: (): Promise<ApiResponse<User>> =>
    apiClient.get('/users/profile'),

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
    apiClient.patch('/users/profile', data), // Backend uses PATCH

  // Updated avatar upload endpoint
  uploadAvatar: (file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.uploadFile('/users/upload-avatar', formData);
  },

  // Get other user (if needed)
  getUser: (id: string): Promise<ApiResponse<User>> => {
    console.warn('Get user by ID not fully implemented in backend');
    return apiClient.get(`/users/${id}`);
  },

  getUserItems: (userId: string, params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    apiClient.get(`/users/${userId}/items`, params),

  getUserInterests: (userId: string): Promise<ApiResponse<any[]>> =>
    apiClient.get(`/users/${userId}/interests`),

  // Social features - Need backend implementation
  // TODO: Backend needs to implement these endpoints
  followUser: (userId: string): Promise<ApiResponse<{ isFollowing: boolean }>> => {
    console.warn('Follow user not implemented in backend yet');
    return Promise.resolve({ 
      data: { isFollowing: true }, 
      status: 200, 
      message: 'Mock response' 
    });
  },

  blockUser: (userId: string): Promise<ApiResponse<void>> => {
    console.warn('Block user not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },

  reportUser: (userId: string, reason: string): Promise<ApiResponse<void>> => {
    console.warn('Report user not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },
};
```

## 6. New Services API

### Add to lib/apiEndpoints.ts
```typescript
// Add new servicesApi:
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
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateRatingData {
  rating: number; // 1-5
  comment?: string;
}

export enum ServiceCategory {
  CLEANER = 'cleaner',
  TUTOR = 'tutor', 
  DELIVERY = 'delivery',
  MAINTENANCE = 'maintenance',
  PET_CARE = 'pet_care',
  OTHER = 'other'
}

export const servicesApi = {
  getServices: (params: SearchServicesParams = {}): Promise<ApiResponse<PaginatedResponse<Service>>> =>
    apiClient.get('/services', params),
  
  getService: (id: string): Promise<ApiResponse<Service>> =>
    apiClient.get(`/services/${id}`),
  
  createService: (data: CreateServiceData): Promise<ApiResponse<Service>> =>
    apiClient.post('/services', data),
    
  updateService: (id: string, data: Partial<CreateServiceData>): Promise<ApiResponse<Service>> =>
    apiClient.patch(`/services/${id}`, data),
    
  deleteService: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/services/${id}`),
  
  // Service Ratings
  addRating: (serviceId: string, rating: CreateRatingData): Promise<ApiResponse<Rating>> =>
    apiClient.post(`/services/${serviceId}/ratings`, rating),
    
  getServiceRatings: (
    serviceId: string, 
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<Rating>>> =>
    apiClient.get(`/services/${serviceId}/ratings`, params),
};

// Add Service and Rating types
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
```

## 7. New Interests API (Replaces Favorites)

### Add to lib/apiEndpoints.ts
```typescript
// Add new interestsApi:
export interface CreateInterestData {
  itemId: number;
  message?: string;
}

export const interestsApi = {
  showInterest: (data: CreateInterestData): Promise<ApiResponse<Interest>> =>
    apiClient.post('/interests', data),
    
  getItemInterests: (itemId: number): Promise<ApiResponse<Interest[]>> =>
    apiClient.get(`/interests/item/${itemId}`),
    
  getUserInterests: (userId: number): Promise<ApiResponse<Interest[]>> =>
    apiClient.get(`/interests/user/${userId}`),
    
  removeInterest: (id: number): Promise<ApiResponse<void>> =>
    apiClient.delete(`/interests/${id}`),
};

// Add Interest type
export interface Interest {
  id: number;
  message?: string;
  userId: number;
  itemId: number;
  createdAt: string;
  updatedAt: string;
}
```

## 8. Generic Upload API

### Add to lib/apiEndpoints.ts
```typescript
// Add generic upload API:
export const uploadsApi = {
  uploadSingle: (file: File): Promise<ApiResponse<{
    message: string;
    filename: string;
    originalName: string;
    size: number;
    url: string;
  }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.uploadFile('/uploads/single', formData);
  },

  uploadMultiple: (files: File[]): Promise<ApiResponse<{
    message: string;
    files: Array<{
      filename: string;
      originalName: string;
      size: number;
      url: string;
    }>;
  }>> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return apiClient.uploadFile('/uploads/multiple', formData);
  },
};
```

## 9. Mock APIs for Missing Backend Features

### Add to lib/apiEndpoints.ts
```typescript
// Mock implementations for features not yet in backend:

// Messages API (Backend not implemented)
export const messagesApi = {
  getConversations: (): Promise<ApiResponse<Conversation[]>> => {
    console.warn('Messages system not implemented in backend yet');
    return Promise.resolve({ data: [], status: 200, message: 'Mock response' });
  },

  getConversation: (conversationId: string): Promise<ApiResponse<Conversation>> => {
    console.warn('Messages system not implemented in backend yet');
    return Promise.resolve({ 
      data: { id: conversationId, participants: [], messages: [], updatedAt: new Date().toISOString() } as any, 
      status: 200, 
      message: 'Mock response' 
    });
  },

  getMessages: (conversationId: string, params: any = {}): Promise<ApiResponse<PaginatedResponse<Message>>> => {
    console.warn('Messages system not implemented in backend yet');
    return Promise.resolve({ 
      data: { items: [], total: 0, page: 1, limit: 10, hasMore: false }, 
      status: 200, 
      message: 'Mock response' 
    });
  },

  sendMessage: (conversationId: string, content: string): Promise<ApiResponse<Message>> => {
    console.warn('Messages system not implemented in backend yet');
    return Promise.resolve({ 
      data: { id: '1', content, senderId: '1', conversationId, createdAt: new Date().toISOString() } as any, 
      status: 200, 
      message: 'Mock response' 
    });
  },

  createConversation: (participantId: string, itemId?: string): Promise<ApiResponse<Conversation>> => {
    console.warn('Messages system not implemented in backend yet');
    return Promise.resolve({ 
      data: { id: '1', participants: [], messages: [], updatedAt: new Date().toISOString() } as any, 
      status: 200, 
      message: 'Mock response' 
    });
  },

  markAsRead: (conversationId: string): Promise<ApiResponse<void>> => {
    console.warn('Messages system not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },

  deleteConversation: (conversationId: string): Promise<ApiResponse<void>> => {
    console.warn('Messages system not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },
};

// Search API (Backend partially implemented)
export const searchApi = {
  searchItems: (query: string, params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    // Use regular items search for now
    apiClient.get('/items', { search: query, ...params }),

  getSearchSuggestions: (query: string): Promise<ApiResponse<string[]>> => {
    console.warn('Search suggestions not implemented in backend yet');
    return Promise.resolve({ data: [], status: 200, message: 'Mock response' });
  },

  getPopularSearches: (): Promise<ApiResponse<string[]>> => {
    console.warn('Popular searches not implemented in backend yet');
    return Promise.resolve({ data: [], status: 200, message: 'Mock response' });
  },

  saveSearch: (query: string): Promise<ApiResponse<void>> => {
    console.warn('Search history not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },

  getSearchHistory: (): Promise<ApiResponse<string[]>> => {
    console.warn('Search history not implemented in backend yet');
    return Promise.resolve({ data: [], status: 200, message: 'Mock response' });
  },

  clearSearchHistory: (): Promise<ApiResponse<void>> => {
    console.warn('Search history not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },
};

// Notifications API (Backend not implemented)
export const notificationsApi = {
  getNotifications: (params: any = {}): Promise<ApiResponse<PaginatedResponse<any>>> => {
    console.warn('Notifications system not implemented in backend yet');
    return Promise.resolve({ 
      data: { items: [], total: 0, page: 1, limit: 10, hasMore: false }, 
      status: 200, 
      message: 'Mock response' 
    });
  },

  markAsRead: (notificationId: string): Promise<ApiResponse<void>> => {
    console.warn('Notifications system not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },

  markAllAsRead: (): Promise<ApiResponse<void>> => {
    console.warn('Notifications system not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },

  updateSettings: (settings: Record<string, boolean>): Promise<ApiResponse<void>> => {
    console.warn('Notifications system not implemented in backend yet');
    return Promise.resolve({ data: undefined, status: 200, message: 'Mock response' });
  },

  getSettings: (): Promise<ApiResponse<Record<string, boolean>>> => {
    console.warn('Notifications system not implemented in backend yet');
    return Promise.resolve({ data: {}, status: 200, message: 'Mock response' });
  },
};

// Update categories API to use items endpoint
export const categoriesApi = {
  getCategories: (): Promise<ApiResponse<Array<{ id: string; name: string; icon?: string }>>> =>
    apiClient.get('/items/categories'),

  getCategoryItems: (
    categoryId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Item>>> =>
    apiClient.get('/items', { category: categoryId, ...params }),
};
```

## 10. Update Main API Export

### Update lib/apiEndpoints.ts - final export
```typescript
// Export all APIs including new ones
export const api = {
  auth: authApi,
  items: itemsApi,
  users: usersApi,
  services: servicesApi,    // New
  interests: interestsApi,  // New (replaces some of favorites)
  uploads: uploadsApi,      // New
  messages: messagesApi,    // Mock until backend implements
  search: searchApi,        // Partially mock
  categories: categoriesApi,
  notifications: notificationsApi, // Mock until backend implements
};

export default api;
```

## 11. Testing Implementation

### Create test file: lib/api-test.ts
```typescript
// Test file to verify API connections
import api from './apiEndpoints';

export async function testAPIConnection() {
  console.log('Testing API connection...');
  
  try {
    // Test items endpoint (public)
    const items = await api.items.getItems({ limit: 1 });
    console.log('✅ Items API working:', items.status);
    
    // Test categories endpoint (public) 
    const categories = await api.categories.getCategories();
    console.log('✅ Categories API working:', categories.status);
    
    // Test services endpoint (public)
    const services = await api.services.getServices({ limit: 1 });
    console.log('✅ Services API working:', services.status);
    
    console.log('🎉 Basic API connection successful!');
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
}

// Test authentication flow
export async function testAuthFlow() {
  console.log('Testing auth flow...');
  
  try {
    // Test OTP send
    const otpResult = await api.auth.sendOtp('test@university.edu');
    console.log('✅ OTP send working:', otpResult.status);
    
    // Note: Don't test actual OTP verification without real OTP
    console.log('⚠️  Complete OTP verification manually');
    
    return true;
  } catch (error) {
    console.error('❌ Auth flow test failed:', error);
    return false;
  }
}
```

## 12. Implementation Checklist

### Phase 1: Basic Connection ✅
- [ ] Update .env.local with backend URL
- [ ] Update API client for cookies and credentials
- [ ] Test basic API connection

### Phase 2: Core APIs ✅  
- [ ] Update authentication endpoints
- [ ] Update items endpoints
- [ ] Update user endpoints
- [ ] Test login/logout flow

### Phase 3: New Features 🔄
- [ ] Implement services API integration
- [ ] Implement interests API integration  
- [ ] Add generic upload API
- [ ] Test new features

### Phase 4: UI Updates 📋
- [ ] Update registration flow for OTP
- [ ] Add services marketplace UI
- [ ] Replace favorites with interests UI
- [ ] Update image upload flow

### Phase 5: Backend Extensions 📋
- [ ] Implement messaging system in backend
- [ ] Implement notifications in backend
- [ ] Implement social features in backend
- [ ] Add advanced search features

This guide provides all the specific code changes needed to connect your frontend with the CampusSuperApp backend. Start with Phase 1 and work through each phase systematically.
