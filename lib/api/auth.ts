/**
 * Authentication API endpoints
 * Split from apiEndpoints.ts for better code splitting and performance
 */

import apiClient, { ApiResponse } from "../api";
import { User } from "../../types";

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
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
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

  completeRegistration: async (
    data: CompleteRegistrationData
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post("/auth/signup", data) as ApiResponse<AuthResponse>;
    
    // Store tokens in localStorage for Bearer token authentication
    if (response.data && 'access_token' in response.data) {
      try {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('token_expires', (Date.now() + (response.data.expires_in * 1000)).toString());
      } catch (error) {
        // Silent fail for localStorage errors
      }
    }
    
    return response;
  },

  // Bearer Token Authentication
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post("/auth/login", credentials) as ApiResponse<AuthResponse>;
    
    // Store tokens in localStorage for Bearer token authentication
    if (response.data && 'access_token' in response.data) {
      try {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('token_expires', (Date.now() + (response.data.expires_in * 1000)).toString());
      } catch (error) {
        // Silent fail for localStorage errors
      }
    }
    
    return response;
  },

  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    // Step 1: Clear tokens from localStorage immediately
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires');
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Tokens cleared from localStorage');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Error clearing localStorage during logout:', error);
      }
    }
    
    // Step 2: Wait a moment to ensure localStorage operations complete
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Step 3: Try to call the logout endpoint (optional)
    try {
      const response = await apiClient.post("/auth/logout");
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Logout API call successful');
      }
      return response as ApiResponse<{ message: string }>;
    } catch (error: any) {
      // If logout API call fails, still return success since tokens are cleared
      // Only log non-server errors to avoid console spam
      if (!error?.name?.includes('ServerError') && process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Logout API call failed, but tokens cleared locally:', error.message);
      }
      return {
        data: { message: 'Logout successful (tokens cleared)' },
        status: 200,
        message: 'Logout successful'
      };
    }
  },

  refreshToken: async (): Promise<ApiResponse<{ access_token: string; expires_in: number }>> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Get the base URL from environment or default
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001');
    
    // Use fetch directly for the refresh token request with Authorization header
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();

    // Update access token in localStorage
    if (data && data.access_token) {
      try {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_expires', (Date.now() + (data.expires_in * 1000)).toString());
      } catch (error) {
        // Silent fail for localStorage errors
      }
    }

    return {
      data: {
        access_token: data.access_token,
        expires_in: data.expires_in
      },
      status: response.status,
      message: 'Token refreshed successfully'
    };
  }
};