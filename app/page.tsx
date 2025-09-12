"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";

// Constants
const ROUTES = {
  MARKETPLACE: '/marketplace',
  LANDING: '/landing'
} as const;

const BRAND_COLOR = '#009F9C';

/**
 * HomePage - Smart router that redirects users based on authentication status
 * Authenticated users → marketplace, unauthenticated users → landing page
 */
export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return; // Wait for auth state to resolve

    const redirectPath = user ? ROUTES.MARKETPLACE : ROUTES.LANDING;
    router.push(redirectPath);
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30">
      <LoadingSpinner />
    </div>
  );
}

/**
 * Loading spinner component for better reusability
 */
function LoadingSpinner() {
  return (
    <div className="text-center">
      <div 
        className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        style={{ borderColor: `${BRAND_COLOR} transparent transparent transparent` }}
      />
      <p className="text-gray-600 font-medium">Loading XMarket...</p>
    </div>
  );
}
