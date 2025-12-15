'use client';

import { usePathname } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import Navbar from './Navbar';
import { SkeletonPage } from './skeletons/SkeletonComponents';

/**
 * AppShell - Application shell component
 * 
 * Handles layout structure based on route type:
 * - Public routes (login, signup, etc.): No navbar
 * - Authenticated routes: Full layout with navbar
 * 
 * Note: Authentication redirects are handled by middleware.ts
 * This component only handles layout structure, not auth logic.
 */

// Routes that should NOT show the navbar
const NO_NAVBAR_ROUTES = [
  '/login',
  '/signup',
  '/signup/um6p-student',
  '/signup/1337-student',
  '/signup/external',
  '/auth/register',
  '/auth/discord/callback',
  '/coming-soon',
  '/forgot-password',
  '/forgot-password/verify',
  '/forgot-password/reset',
  '/verify-email',
];

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  
  // Check if current route should hide navbar
  const shouldHideNavbar = NO_NAVBAR_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Show loading skeleton while checking auth state
  if (loading) {
    return <SkeletonPage />;
  }
  
  // Public routes without navbar (login, signup, etc.)
  if (shouldHideNavbar) {
    return (
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    );
  }
  
  // Home page "/" - special handling
  // Show navbar only for authenticated users
  if (pathname === '/') {
    if (user) {
      return (
        <div className="h-screen flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-50 pb-[var(--navbar-height,4rem)]">
            {children}
          </main>
          <Navbar />
        </div>
      );
    }
    // Guest on home page - no navbar (landing page)
    return (
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    );
  }
  
  // All other authenticated routes - show navbar
  // Note: Middleware handles redirecting unauthenticated users
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-[var(--navbar-height,4rem)]">
        {children}
      </main>
      <Navbar />
    </div>
  );
}
