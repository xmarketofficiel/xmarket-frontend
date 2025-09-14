'use client';

import { useUser } from '../contexts/UserContext';
import { usePathname } from 'next/navigation';
import LoginPage from '../app/login/page';
import Navbar from './Navbar';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006666] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Public pages - no navbar, no authentication required
  if (pathname === '/login' || pathname === '/signup' || pathname === '/coming-soon' || pathname === '/landing') {
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
      <>
        <main className="pb-16 min-h-screen bg-gray-50">
          {children}
        </main>
        <Navbar />
      </>
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
  
  // User is authenticated - show navbar and content
  return (
    <>
      <main className="pb-16 min-h-screen bg-gray-50">
        {children}
      </main>
      <Navbar />
    </>
  );
}
