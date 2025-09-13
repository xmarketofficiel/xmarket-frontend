'use client';

import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { api } from '../lib/apiEndpoints';
import apiClient from '../lib/api';

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
    // No need to remove localStorage tokens since we're using HTTP-only cookies
    router.push('/login'); // Redirect to login, not landing
  }, [router]);

  // Check for existing session on mount
  useEffect(() => {
    // Clean up any old localStorage tokens that might conflict with cookies
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user-token');
    
    // Set up global auth error handler
    apiClient.setAuthErrorHandler(handleAuthError);
    
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
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
      if (error?.response?.status === 401 && !window.location.pathname.includes('/landing') && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        handleAuthError();
      } else {
        // No active session or on a public page - just clear state
        setUser(null);
        // No need to remove localStorage tokens since we're using HTTP-only cookies
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
      await api.auth.logout();
    } catch (error) {
      // Logout errors are non-critical, continue with client-side cleanup
    } finally {
      // Clear user state
      setUser(null);
      // No need to remove localStorage tokens since we're using HTTP-only cookies
      // Redirect to login page
      router.push('/login');
    }
  }, [router]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prevUser: User | null) => prevUser ? { ...prevUser, ...updates } : null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.auth.getCurrentUser();
      setUser(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        handleAuthError();
      } else {
        // For other errors, just clear the user state
        setUser(null);
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