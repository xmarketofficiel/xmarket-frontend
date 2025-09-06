"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to marketplace
        router.push('/marketplace');
      } else {
        // User is not authenticated, redirect to landing
        router.push('/landing');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009F9C]/5 via-white to-blue-50/30">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#009F9C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading XMarket...</p>
      </div>
    </div>
  );
}
