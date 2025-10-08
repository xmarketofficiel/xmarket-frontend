'use client';

import { useUser } from '../contexts/UserContext';
import { usePathname } from 'next/navigation';
import LoginPage from '../app/login/page';
import Navbar from './Navbar';
import { SkeletonPage } from './skeletons/SkeletonComponents';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  
  // Show skeleton loading while checking authentication
  if (loading) {
    return <SkeletonPage />;
  }
  
  // Public pages - no navbar, no authentication required
  if (pathname === '/login' || 
      pathname === '/signup' || 
      pathname === '/signup/um6p-student' || 
      pathname === '/signup/1337-student' || 
      pathname === '/signup/external' || 
      pathname === '/auth/register' || 
      pathname === '/auth/discord/callback' ||
      pathname === '/coming-soon') {
    return (
      <main className={pathname === '/coming-soon' ? 'min-h-screen' : 'min-h-screen bg-gray-50'}>
        {children}
      </main>
    );
  }
  
  // Home page "/" - special handling for authentication
  if (pathname === '/') {
    // For home page, let the page itself handle authentication and layout
    // Only show Navbar if user is authenticated
    return user ? (
      <div className="h-screen flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
        <Navbar />
      </div>
    ) : (
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    );
  }
  
  // Protected pages - require authentication
  if (!user) {
    // User is not authenticated, redirect to login (no navbar)
    return (
      <main className="min-h-screen bg-gray-50">
        <LoginPage />
      </main>
    );
  }
  
  // User is authenticated - show navbar and content with proper fixed layout
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
      <Navbar />
    </div>
  );
}
