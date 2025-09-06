"use client";

import dynamic from 'next/dynamic';
import SkeletonCard from './SkeletonCard';

const AddItemForm = dynamic(() => import('./AddItemForm'), {
  loading: () => (
    <div className="p-6">
      <SkeletonCard />
    </div>
  ),
  ssr: false,
});

export default function AddItemFormClient() {
  return <AddItemForm />;
}
