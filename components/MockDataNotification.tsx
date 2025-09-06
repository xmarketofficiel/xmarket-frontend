"use client";

import { useToast } from '../contexts/ToastContext';
import { useEffect } from 'react';

// Component to show a notification when using mock data
export function MockDataNotification() {
  const { addToast } = useToast();

  useEffect(() => {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
    if (useMock) {
      setTimeout(() => {
        addToast("🧪 Using Mock Data - Real backend disabled", "info");
      }, 1000);
    } else {
      setTimeout(() => {
        addToast("🔗 Connected to Backend API", "success");
      }, 1000);
    }
  }, [addToast]);

  return null; // This component doesn't render anything
}
