"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useUser } from "../contexts/UserContext";
import { MarketplacePageSkeleton } from "../components/skeletons/MarketplacePageSkeleton";

// Dynamic imports for code splitting - each page loads only when needed
const MarketplacePage = dynamic(() => import("./marketplace/page"), {
  loading: () => null, // Marketplace page handles its own loading states
  ssr: false, // Disable SSR since this depends on client-side auth state
});

const LandingPage = dynamic(() => import("./landing/page"), {
  loading: () => null, // Landing page loads fast, no skeleton needed
});

/**
 * HomePage - Smart content display based on authentication
 * 
 * Architecture:
 * - Uses dynamic imports for proper code splitting
 * - MarketplacePage and LandingPage are loaded lazily
 * - AppShell handles the layout (navbar visibility)
 * - Skeleton is shown while marketplace is loading
 */
export default function HomePage() {
  const { user, loading } = useUser();

  // Clear add-item draft when authenticated user reaches home page
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const draftExists = localStorage.getItem('add_item_draft');
      if (draftExists) {
        localStorage.removeItem('add_item_draft');
      }
    }
  }, [user]);

  // Show skeleton while determining auth status (for logged in users)
  if (loading) {
    return <MarketplacePageSkeleton />;
  }

  // Render appropriate page based on auth state
  // Both are dynamically imported for code splitting
  return user ? <MarketplacePage /> : <LandingPage />;
}