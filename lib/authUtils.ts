/**
 * Authentication utilities for handling logout and token expiration
 */

import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';

/**
 * Custom hook for handling authentication errors consistently across the app
 */
export function useAuthErrorHandler() {
  const router = useRouter();
  const { logout } = useUser();

  const handleAuthError = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if logout fails, redirect to landing page
      router.push('/landing');
    }
  };

  const handleTokenExpiration = () => {
    console.warn('Token expired - redirecting to landing page');
    handleAuthError();
  };

  return {
    handleAuthError,
    handleTokenExpiration,
  };
}

/**
 * Check if an error is an authentication error (401)
 */
export function isAuthError(error: any): boolean {
  return error?.response?.status === 401 || error?.status === 401;
}

/**
 * Check if an error is a forbidden error (403) 
 */
export function isForbiddenError(error: any): boolean {
  return error?.response?.status === 403 || error?.status === 403;
}

/**
 * Check if current path is a public route that doesn't require authentication
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = ['/login', '/signup', '/landing', '/coming-soon', '/'];
  return publicRoutes.includes(pathname) || pathname.startsWith('/landing');
}
