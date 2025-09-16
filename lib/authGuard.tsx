// Route protection utility for Bearer token authentication
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import TokenManager from './tokenManager';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requiredAuth?: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const { redirectTo = '/login', requiredAuth = true } = options;

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    // Check if authentication is required
    if (requiredAuth) {
      // Check if user is authenticated via tokens
      const hasValidTokens = TokenManager.isAuthenticated();
      
      // If no user and no valid tokens, redirect
      if (!user && !hasValidTokens) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, loading, router, redirectTo, requiredAuth]);

  return {
    isAuthenticated: !!user && TokenManager.isAuthenticated(),
    user,
    loading
  };
}

export default useAuthGuard;
