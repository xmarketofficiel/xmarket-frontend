'use client';

import { ReactNode } from 'react';
import { UserProvider } from '../contexts/UserContext';
import { ToastProvider } from '../contexts/ToastContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { UIProvider } from '../contexts/UIContext';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * AppProviders - Consolidated provider component
 * 
 * This consolidates all app-level providers into a single component for:
 * 1. Cleaner layout.tsx
 * 2. Easier testing (can mock this single component)
 * 3. Clear dependency order documentation
 * 
 * Provider order (outer to inner):
 * - ErrorBoundary: Catches errors from all providers
 * - UserProvider: Auth state (no dependencies)
 * - ToastProvider: Notifications (no dependencies)
 * - FavoritesProvider: Depends on UserProvider & ToastProvider
 * - UIProvider: UI state (no dependencies)
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ToastProvider>
          <FavoritesProvider>
            <UIProvider>
              {children}
            </UIProvider>
          </FavoritesProvider>
        </ToastProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default AppProviders;
