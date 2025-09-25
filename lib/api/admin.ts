/**
 * Admin API endpoints
 * Split from apiEndpoints.ts for better code splitting and performance
 */

import apiClient, { ApiResponse } from "../api";
import { User } from "../../types";

// Interfaces
export interface AdminUser extends User {
  role: 'admin' | 'superadmin' | 'moderator';
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

export interface SystemStats {
  totalUsers: number;
  totalItems: number;
  totalSales: number;
  dailyActiveUsers: number;
  monthlyRevenue: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export interface AuditLog {
  id: number;
  action: string;
  userId: number;
  userName: string;
  timestamp: string;
  details: Record<string, any>;
  ipAddress: string;
}

// ===== ADMIN API =====
export const adminApi = {
  // Authentication & Authorization
  loginAdmin: (
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: AdminUser }>> =>
    apiClient.post("/admin/auth/login", { email, password }),

  verifyAdminToken: (): Promise<ApiResponse<{ user: AdminUser }>> =>
    apiClient.get("/admin/auth/verify"),

  // User Management
  getAllUsers: (
    page?: number,
    limit?: number,
    search?: string
  ): Promise<ApiResponse<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }>> =>
    apiClient.get("/admin/users", { page, limit, search }),

  getUserById: (id: number): Promise<ApiResponse<User>> =>
    apiClient.get(`/admin/users/${id}`),

  updateUser: (
    id: number,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> =>
    apiClient.put(`/admin/users/${id}`, userData),

  deleteUser: (id: number): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/admin/users/${id}`),

  banUser: (
    id: number,
    reason: string,
    duration?: number
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post(`/admin/users/${id}/ban`, { reason, duration }),

  unbanUser: (id: number): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post(`/admin/users/${id}/unban`),

  // Item Management
  getAllItems: (
    page?: number,
    limit?: number,
    status?: string
  ): Promise<ApiResponse<{
    items: any[];
    total: number;
    page: number;
    totalPages: number;
  }>> =>
    apiClient.get("/admin/items", { page, limit, status }),

  approveItem: (id: number): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post(`/admin/items/${id}/approve`),

  rejectItem: (
    id: number,
    reason: string
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post(`/admin/items/${id}/reject`, { reason }),

  deleteItem: (id: number): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/admin/items/${id}`),

  // Content Moderation
  getReportedItems: (
    page?: number,
    limit?: number
  ): Promise<ApiResponse<{
    reports: any[];
    total: number;
    page: number;
    totalPages: number;
  }>> =>
    apiClient.get("/admin/reports/items", { page, limit }),

  getReportedUsers: (
    page?: number,
    limit?: number
  ): Promise<ApiResponse<{
    reports: any[];
    total: number;
    page: number;
    totalPages: number;
  }>> =>
    apiClient.get("/admin/reports/users", { page, limit }),

  resolveReport: (
    id: number,
    action: 'dismiss' | 'warn' | 'ban' | 'delete',
    notes?: string
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post(`/admin/reports/${id}/resolve`, { action, notes }),

  // System Statistics
  getSystemStats: (): Promise<ApiResponse<SystemStats>> =>
    apiClient.get("/admin/stats/system"),

  getDashboardStats: (): Promise<ApiResponse<{
    userGrowth: any[];
    itemGrowth: any[];
    revenueGrowth: any[];
    topCategories: any[];
  }>> =>
    apiClient.get("/admin/stats/dashboard"),

  // Audit Logs
  getAuditLogs: (
    page?: number,
    limit?: number,
    action?: string,
    userId?: number
  ): Promise<ApiResponse<{
    logs: AuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }>> =>
    apiClient.get("/admin/audit-logs", { page, limit, action, userId }),

  // System Configuration
  getSystemConfig: (): Promise<ApiResponse<Record<string, any>>> =>
    apiClient.get("/admin/config"),

  updateSystemConfig: (
    config: Record<string, any>
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.put("/admin/config", config),

  // Backup & Maintenance
  createBackup: (): Promise<ApiResponse<{
    backupId: string;
    message: string;
    estimatedTime: number;
  }>> =>
    apiClient.post("/admin/backup/create"),

  getBackups: (): Promise<ApiResponse<{
    backups: Array<{
      id: string;
      createdAt: string;
      size: number;
      status: 'completed' | 'in_progress' | 'failed';
    }>;
  }>> =>
    apiClient.get("/admin/backup/list"),

  restoreBackup: (backupId: string): Promise<ApiResponse<{
    message: string;
    estimatedTime: number;
  }>> =>
    apiClient.post(`/admin/backup/${backupId}/restore`),

  // Cache Management
  clearCache: (cacheType?: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post("/admin/cache/clear", { cacheType }),

  getCacheStats: (): Promise<ApiResponse<{
    redis: { connected: boolean; memory: number };
    application: { size: number; hitRate: number };
  }>> =>
    apiClient.get("/admin/cache/stats"),

  // Announcements
  createAnnouncement: (
    title: string,
    message: string,
    type: 'info' | 'warning' | 'success' | 'error',
    targetUsers?: 'all' | 'active' | 'premium'
  ): Promise<ApiResponse<{ id: number; message: string }>> =>
    apiClient.post("/admin/announcements", { title, message, type, targetUsers }),

  getAnnouncements: (): Promise<ApiResponse<{
    announcements: Array<{
      id: number;
      title: string;
      message: string;
      type: string;
      createdAt: string;
      isActive: boolean;
    }>;
  }>> =>
    apiClient.get("/admin/announcements"),

  updateAnnouncement: (
    id: number,
    updates: { title?: string; message?: string; isActive?: boolean }
  ): Promise<ApiResponse<{ message: string }>> =>
    apiClient.put(`/admin/announcements/${id}`, updates),

  deleteAnnouncement: (id: number): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete(`/admin/announcements/${id}`)
};