# Backend API Mapping & Integration Guide

## Overview
This document provides a comprehensive mapping of the CampusSuperApp backend APIs and their integration with the XMarket frontend application.

**Backend Server**: NestJS Application
**Default Port**: 3001 (configurable via PORT environment variable)  
**Base URL**: `http://localhost:3001`
**API Documentation**: `http://localhost:3001/api` (Swagger)
**CORS**: Configured for `http://localhost:3000` (frontend)
**Authentication**: JWT tokens stored in HTTP-only cookies

## Authentication System

### Cookie-Based Authentication
The backend uses HTTP-only cookies for secure token management:
- `access_token`: 24 hours validity
- `refresh_token`: 7 days validity
- Cookies are set with `httpOnly`, `secure` (production), `sameSite: strict`

### Authentication Flow
1. **Registration**: OTP verification → Complete registration → Auto login with cookies
2. **Login**: Email/Password → JWT tokens in cookies
3. **Token Refresh**: Automatic using refresh token cookie
4. **Logout**: Clear cookies

## API Endpoints Mapping

### 1. Authentication APIs (`/auth`)

#### Current Frontend vs Backend Mapping:
```typescript
// Frontend: lib/apiEndpoints.ts - authApi
// Backend: auth/auth.controller.ts

// ✅ MAPPED - Registration Flow (OTP-based)
POST /auth/send-otp
POST /auth/verify-otp  
POST /auth/complete-registration

// ❌ NEEDS UPDATE - Login
Frontend: POST /auth/login
Backend:  POST /auth/login ✅
// Backend returns cookies, frontend needs cookie handling

// ❌ NEEDS UPDATE - Logout
Frontend: POST /auth/logout
Backend:  POST /auth/logout ✅

// ❌ NEEDS UPDATE - Token Refresh
Frontend: POST /auth/refresh
Backend:  POST /auth/refresh ✅
// Backend reads from cookies, not request body

// ❌ MISSING - Password Reset
Backend: POST /auth/forgot-password
Backend: POST /auth/reset-password

// ❌ MISSING - Current User
Backend: No dedicated endpoint (use users/profile)
```

### 2. Items APIs (`/items`)

#### Current Frontend vs Backend Mapping:
```typescript
// Frontend: lib/apiEndpoints.ts - itemsApi
// Backend: items/items.controller.ts

// ✅ PARTIALLY MAPPED
GET /items              // ✅ Both have search/pagination
GET /items/:id          // ✅ Both have
POST /items             // ✅ Both have
PATCH /items/:id        // ✅ Both have (frontend uses PUT)
DELETE /items/:id       // ✅ Both have

// ❌ DIFFERENT - Categories
Frontend: GET /categories (separate categoriesApi)
Backend:  GET /items/categories

// ❌ DIFFERENT - Image Upload
Frontend: POST /items/:id/photos (expects FormData)
Backend:  POST /items/:id/images (expects files array)

// ❌ MISSING IN FRONTEND - Image Management
Backend: DELETE /images/:imageId

// ❌ MISSING IN BACKEND - Favorites
Frontend: POST /items/:id/favorite
Frontend: GET /items/favorites

// ❌ MISSING IN BACKEND - Reporting
Frontend: POST /items/:id/report
```

### 3. Users APIs (`/users`)

#### Current Frontend vs Backend Mapping:
```typescript
// Frontend: lib/apiEndpoints.ts - usersApi
// Backend: users/users.controller.ts

// ✅ MAPPED
GET /users/profile      // ✅ Backend has
PATCH /users/profile    // ✅ Backend has (frontend uses PUT)

// ❌ DIFFERENT - Avatar Upload
Frontend: POST /users/avatar
Backend:  POST /users/upload-avatar

// ❌ PARTIAL - User Items
Frontend: GET /users/:id/items
Backend:  GET /users/:id/items ✅ (returns placeholder)

// ❌ MISSING IN BACKEND
Frontend: GET /users/:id
Frontend: POST /users/:id/follow
Frontend: POST /users/:id/block  
Frontend: POST /users/:id/report

// ❌ NEW IN BACKEND
Backend: GET /users/:id/interests
```

### 4. Services APIs (`/services`) - NEW SYSTEM

#### Backend Only (Not in Frontend):
```typescript
// Backend: services/services.controller.ts
// This is a NEW service marketplace system

POST /services          // Create service
GET /services           // Search services with pagination
GET /services/:id       // Get service details
PATCH /services/:id     // Update service
DELETE /services/:id    // Delete service (soft delete)

// Service Ratings
POST /services/:id/ratings     // Add rating
GET /services/:id/ratings      // Get service ratings
```

### 5. Interests APIs (`/interests`) - NEW SYSTEM

#### Backend Only (Not in Frontend):
```typescript
// Backend: interests/interests.controller.ts
// This replaces the favorites system with a more advanced interest tracking

POST /interests              // Show interest in item
GET /interests/item/:itemId  // Get interests for item
GET /interests/user/:userId  // Get user interests  
DELETE /interests/:id        // Remove interest
```

### 6. Upload APIs (`/uploads`)

#### Backend Only:
```typescript
// Backend: uploads/uploads.controller.ts
// Generic file upload system

POST /uploads/single     // Upload single file
POST /uploads/multiple   // Upload multiple files (max 6)
```

### 7. Missing Frontend APIs

#### Messages System - NOT IMPLEMENTED IN BACKEND
```typescript
// Frontend has complete messaging system:
// - messagesApi.getConversations()
// - messagesApi.sendMessage()
// - messagesApi.createConversation()
// Backend: NO IMPLEMENTATION
```

#### Search System - PARTIAL IN BACKEND
```typescript
// Frontend has dedicated search system:
// - searchApi.searchItems()
// - searchApi.getSearchSuggestions()
// - searchApi.getPopularSearches()
// Backend: Only basic item search via GET /items
```

#### Notifications System - NOT IMPLEMENTED IN BACKEND
```typescript
// Frontend has complete notification system:
// - notificationsApi.getNotifications()
// - notificationsApi.markAsRead()
// Backend: NO IMPLEMENTATION
```

## Data Structure Differences

### Authentication Response
```typescript
// Frontend expects:
interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Backend returns (with cookies):
{
  message: string;
  user: User;
  // Tokens are in HTTP-only cookies
}
```

### Item Structure
```typescript
// Backend CreateItemDto:
{
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  // Images handled separately via POST /items/:id/images
}

// Frontend CreateItemData:
{
  title: string;
  description: string;
  price: number;
  category: string;
  photos: File[];        // Different approach
  showIdentity: boolean; // Not in backend
}
```

### Service Structure (New)
```typescript
// Backend only:
interface CreateServiceDto {
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  location?: string;
}

enum ServiceCategory {
  CLEANER = 'cleaner',
  TUTOR = 'tutor',
  DELIVERY = 'delivery',
  MAINTENANCE = 'maintenance',
  PET_CARE = 'pet_care',
  OTHER = 'other'
}
```

## Required Frontend Updates

### 1. Update API Client Configuration
```typescript
// lib/api.ts - Update base URL and add cookie support
const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  retries: 3,
});

// Add cookie support for authentication
// Cookies are handled automatically by the browser
```

### 2. Update Authentication Endpoints
```typescript
// lib/apiEndpoints.ts - authApi updates needed:

// Add OTP-based registration flow:
sendOtp: (email: string) => apiClient.post('/auth/send-otp', { email }),
verifyOtp: (email: string, otp: string) => apiClient.post('/auth/verify-otp', { email, otp }),
completeRegistration: (data: CompleteRegistrationDto) => 
  apiClient.post('/auth/complete-registration', data),

// Update existing endpoints for cookie handling:
login: (credentials: LoginCredentials) => apiClient.post('/auth/login', credentials),
logout: () => apiClient.post('/auth/logout'),
refreshToken: () => apiClient.post('/auth/refresh'), // No body needed

// Add password reset:
forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
resetPassword: (email: string, otp: string, newPassword: string) => 
  apiClient.post('/auth/reset-password', { email, otp, newPassword }),
```

### 3. Update Items Endpoints
```typescript
// lib/apiEndpoints.ts - itemsApi updates:

// Update categories endpoint:
getCategories: () => apiClient.get('/items/categories'),

// Update image upload:
uploadItemPhotos: (itemId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  return apiClient.uploadFile(`/items/${itemId}/images`, formData);
},

// Add image deletion:
deleteItemImage: (imageId: string) => apiClient.delete(`/images/${imageId}`),
```

### 4. Update Users Endpoints
```typescript
// lib/apiEndpoints.ts - usersApi updates:

// Update avatar upload endpoint:
uploadAvatar: (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return apiClient.uploadFile('/users/upload-avatar', formData);
},
```

### 5. Add New Services API
```typescript
// lib/apiEndpoints.ts - Add new servicesApi:

export const servicesApi = {
  getServices: (params: SearchServicesParams = {}) =>
    apiClient.get('/services', params),
  
  getService: (id: string) => apiClient.get(`/services/${id}`),
  
  createService: (data: CreateServiceData) =>
    apiClient.post('/services', data),
    
  updateService: (id: string, data: Partial<CreateServiceData>) =>
    apiClient.patch(`/services/${id}`, data),
    
  deleteService: (id: string) => apiClient.delete(`/services/${id}`),
  
  // Service Ratings
  addRating: (serviceId: string, rating: CreateRatingData) =>
    apiClient.post(`/services/${serviceId}/ratings`, rating),
    
  getServiceRatings: (serviceId: string, params: PaginationParams = {}) =>
    apiClient.get(`/services/${serviceId}/ratings`, params),
};
```

### 6. Add New Interests API
```typescript
// lib/apiEndpoints.ts - Add new interestsApi:

export const interestsApi = {
  showInterest: (itemId: number, message?: string) =>
    apiClient.post('/interests', { itemId, message }),
    
  getItemInterests: (itemId: number) =>
    apiClient.get(`/interests/item/${itemId}`),
    
  getUserInterests: (userId: number) =>
    apiClient.get(`/interests/user/${userId}`),
    
  removeInterest: (id: number) => apiClient.delete(`/interests/${id}`),
};
```

## Backend Missing Features That Need Implementation

### 1. Messaging System
```typescript
// Backend needs to implement:
- POST /messages/conversations
- GET /messages/conversations  
- GET /messages/conversations/:id/messages
- POST /messages/conversations/:id/messages
- PATCH /messages/conversations/:id/read
- DELETE /messages/conversations/:id
```

### 2. Advanced Search
```typescript
// Backend needs to implement:
- GET /search/suggestions?q=query
- GET /search/popular
- POST /search/history
- GET /search/history
- DELETE /search/history
```

### 3. Notifications System
```typescript
// Backend needs to implement:
- GET /notifications
- POST /notifications/:id/read
- POST /notifications/read-all
- PUT /notifications/settings
- GET /notifications/settings
```

### 4. Social Features
```typescript
// Backend needs to implement:
- POST /users/:id/follow
- POST /users/:id/block
- POST /users/:id/report
- POST /items/:id/report
- GET /items/favorites
- POST /items/:id/favorite
```

## Environment Configuration

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3001/uploads
```

### Backend (.env)
```bash
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/campus_marketplace
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
```

## Testing Endpoints

### Start Both Servers
```bash
# Backend
cd CampusSuperApp
npm run start:dev  # Runs on port 3001

# Frontend  
cd Front-end
npm run dev       # Runs on port 3000
```

### Test API Connection
```bash
# Test backend health
curl http://localhost:3001

# Test Swagger docs
open http://localhost:3001/api

# Test CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3001/auth/login
```

## Implementation Priority

### Phase 1 (Critical)
1. ✅ Update API client base URL to port 3001
2. ✅ Implement cookie-based authentication
3. ✅ Update items endpoints (categories, image upload)
4. ✅ Update user profile endpoints

### Phase 2 (High Priority)
1. 🔄 Add OTP-based registration flow to frontend
2. 🔄 Add password reset functionality
3. 🔄 Implement services marketplace UI
4. 🔄 Replace favorites with interests system

### Phase 3 (Medium Priority)
1. 📋 Implement messaging system in backend
2. 📋 Implement advanced search in backend
3. 📋 Add social features (follow, block, report)

### Phase 4 (Low Priority)
1. 📋 Implement notifications system in backend
2. 📋 Add admin dashboard features
3. 📋 Add analytics and reporting

## Summary

The CampusSuperApp backend provides a solid foundation with:
- ✅ Authentication system (OTP-based registration)
- ✅ Items marketplace with image upload
- ✅ User profile management
- ✅ Services marketplace (new feature)
- ✅ Interests tracking (replaces favorites)
- ✅ Generic file upload system

**Major Gaps:**
- ❌ No messaging system
- ❌ No notifications system  
- ❌ No advanced search features
- ❌ No social features (follow, block, report)

**Next Steps:**
1. Update frontend API configuration
2. Implement missing backend features
3. Test integration between frontend and backend
4. Deploy both applications with proper environment configuration
