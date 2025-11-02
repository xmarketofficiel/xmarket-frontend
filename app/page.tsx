"use client";

import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

// Import the actual marketplace page component
import MarketplacePage from "./marketplace/page";
// Import the landing page component from the @landing directory
import LandingPage from "./landing/page";

const BRAND_COLOR = '#009F9C';

/**
 * HomePage - Smart content display based on authentication
 * Shows landing page for guests, actual marketplace for authenticated users
 * NO REDIRECTS - everything happens on the same "/" path
 */
export default function HomePage() {
  const { user, loading } = useUser();

  // Clear add-item draft when successfully reaching home page
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const draftExists = localStorage.getItem('add_item_draft');
      if (draftExists) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🧹 Cleaning up add-item draft from localStorage on home page...');
        }
        localStorage.removeItem('add_item_draft');
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Add-item draft cleared from localStorage');
        }
      }
    }
  }, [user]);

  // Show loading state while determining auth status
  if (loading) {
    return <LoadingScreen />;
  }

  // Show actual marketplace content for authenticated users (NO REDIRECT)
  if (user) {
    return <MarketplacePage />;
  }

  // Show landing page content for non-authenticated users (NO REDIRECT)
  // Use the organized landing page from @landing directory
  return <LandingPage />;
}

/**
 * Loading screen component
 */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Content */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 font-medium mt-6">
            Setting up your XMarket experience...
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Clean loading spinner without framer-motion
 */
function LoadingSpinner() {
  return (
    <div className="relative">
      <div 
        className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: `${BRAND_COLOR} transparent transparent transparent` }}
      />
    </div>
  );
}