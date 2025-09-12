"use client";

import dynamic from 'next/dynamic';
import SkeletonCard from './SkeletonCard';

const OptimizedAddItemForm = dynamic(() => import('../app/add-item/components/OptimizedAddItemForm'), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="p-6 max-w-md w-full">
        <SkeletonCard />
        <div className="mt-4 text-center">
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

export default function AddItemFormClient() {
  return <OptimizedAddItemForm />;
}
