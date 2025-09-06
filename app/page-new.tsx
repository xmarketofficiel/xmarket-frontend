"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    
    if (token) {
      // User is logged in, redirect to marketplace
      router.push('/marketplace');
    } else {
      // User is not logged in, redirect to landing
      router.push('/landing');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#006666]/5 via-white to-blue-50/30">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading XMarket...</p>
      </div>
    </div>
  );
}
