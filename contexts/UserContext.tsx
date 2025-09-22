'use client';

import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { api } from '../lib/apiEndpoints';
import apiClient from '../lib/api';
import TokenManager from '../lib/tokenManager';

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  // Handle authentication errors (token expiration)
  const handleAuthError = useCallback(() => {
    setUser(null);
    // Clear tokens from localStorage
    TokenManager.clearTokens();
    
    // Only redirect if not on a public page
    const currentPath = window.location.pathname;
    const isPublicPage = currentPath === '/' || 
                        currentPath.includes('/login') || 
                        currentPath.includes('/signup') ||
                        currentPath.includes('/landing');
    
    if (!isPublicPage) {
      router.push('/login'); // Redirect to login page
    }
  }, [router]);

  // Check for existing session on mount
  useEffect(() => {
    // Clean up any old localStorage tokens that might conflict
    const oldTokenKeys = ['token', 'user', 'accessToken', 'refreshToken', 'user-token'];
    oldTokenKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Set up global auth error handler that respects public pages
    apiClient.setAuthErrorHandler(() => {
      const currentPath = window.location.pathname;
      const isPublicPage = currentPath === '/' || 
                          currentPath.includes('/login') || 
                          currentPath.includes('/signup') ||
                          currentPath.includes('/landing');
      
      if (!isPublicPage) {
        handleAuthError();
      }
    });
    
    checkCurrentUser();
  }, [handleAuthError]);

  const checkCurrentUser = async () => {
    try {
      // Check if we have valid tokens before making request
      if (!TokenManager.isAuthenticated()) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if token needs refresh
      if (TokenManager.shouldRefreshToken()) {
        try {
          await api.auth.refreshToken();
        } catch (refreshError) {
          console.warn('Token refresh failed:', refreshError);
          TokenManager.clearTokens();
          setUser(null);
          setLoading(false);
          return;
        }
      }
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const response = await Promise.race([
        api.auth.getCurrentUser(),
        timeoutPromise
      ]);
      setUser(response.data);
    } catch (error: any) {
      // Check if it's a 401 (token expired) and we're not already on a public page
      const isPublicPage = window.location.pathname === '/' || 
                          window.location.pathname.includes('/login') || 
                          window.location.pathname.includes('/signup');
                          
      if (error?.status === 401 && !isPublicPage) {
        handleAuthError();
      } else {
        // No active session or on a public page - just clear state
        setUser(null);
        TokenManager.clearTokens();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      setUser(response.data.user);
      // After successful login, redirect to the main app, not landing
      router.push('/profile');
    } catch (error) {
      // Clear any stale auth state on failed login
      setUser(null);
      // No need to remove localStorage tokens since we're using HTTP-only cookies
      throw error; // Let the component handle the error
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      // First, clear tokens and user state immediately
      setUser(null);
      TokenManager.clearTokens();
      
      // Wait a moment to ensure tokens are fully cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to call the logout API (non-critical if it fails)
      try {
        await api.auth.logout();
      } catch (error: any) {
        // Logout API errors are non-critical since tokens are already cleared
        // Only log if it's not a server error to avoid console spam
        if (!error?.name?.includes('ServerError')) {
          console.warn('Logout API call failed, but tokens cleared locally:', error.message);
        }
      }
      
    } catch (error) {
      // Even if something fails, ensure tokens are cleared
      setUser(null);
      TokenManager.clearTokens();
      console.error('Error during logout:', error);
    } finally {
      // Always redirect to home page after token cleanup
      router.push('/');
    }
  }, [router]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prevUser: User | null) => prevUser ? { ...prevUser, ...updates } : null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      // Check if we have valid tokens before making request
      if (!TokenManager.isAuthenticated()) {
        setUser(null);
        return;
      }

      // Check if token needs refresh
      if (TokenManager.shouldRefreshToken()) {
        try {
          await api.auth.refreshToken();
        } catch (refreshError) {
          console.warn('Token refresh failed during user refresh:', refreshError);
          TokenManager.clearTokens();
          setUser(null);
          return;
        }
      }

      const response = await api.auth.getCurrentUser();
      setUser(response.data);
    } catch (error: any) {
      if (error?.status === 401) {
        handleAuthError();
      } else {
        // For other errors, just clear the user state
        setUser(null);
        TokenManager.clearTokens();
      }
    }
  }, [handleAuthError]);  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser, 
      refreshUser 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}