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

// HOC for protecting pages
export function withAuthGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: UseAuthGuardOptions = {}
) {
  return function AuthGuardedComponent(props: P) {
    const { isAuthenticated, loading } = useAuthGuard(options);

    // Show loading while checking auth
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
        </div>
      );
    }

    // Show component if authenticated (or auth not required)
    if (isAuthenticated || !options.requiredAuth) {
      return <WrappedComponent {...props} />;
    }

    // This will typically not render as the redirect happens in useEffect
    return null;
  };
}

export default useAuthGuard;
