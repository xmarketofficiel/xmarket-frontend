/**
 * API Endpoints - Backward Compatibility Layer
 */

import { authApi as _authApi } from './api/auth';
import { itemsApi as _itemsApi } from './api/items';
import { usersApi as _usersApi } from './api/users';
import { messagesApi as _messagesApi } from './api/messages';
import { searchApi as _searchApi, uploadsApi as _uploadsApi } from './api/uploads';
import { adminApi as _adminApi } from './api/admin';
import apiClient from './api';

export const authApi = _authApi;
export const itemsApi = _itemsApi;
export const usersApi = _usersApi;
export const messagesApi = _messagesApi;
export const searchApi = _searchApi;
export const uploadsApi = _uploadsApi;
export const adminApi = _adminApi;

export const api = {
  auth: _authApi,
  items: _itemsApi,
  users: _usersApi,
  messages: _messagesApi,
  search: _searchApi,
  uploads: _uploadsApi,
  admin: _adminApi,
  joinRequests: {
    create: (data: any) =>
      apiClient.post('/join-requests', data)
  },
  
  notifications: {
    getNotifications: (params?: any) => Promise.resolve({
      data: { items: [], total: 0, page: 1, totalPages: 0 },
      status: 200,
      message: 'Mock notifications'
    })
  },
  
  completeRegistration: _authApi.completeRegistration,
  login: _authApi.login,
  logout: _authApi.logout,
  getCurrentUser: _usersApi.getProfile,
  createItem: _itemsApi.createItem,
  getItems: _itemsApi.getItems,
  getCategories: _itemsApi.getCategories,
  searchItems: _searchApi.searchItems
};

export default api;
