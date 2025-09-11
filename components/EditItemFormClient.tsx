"use client";

import dynamic from 'next/dynamic';
import SkeletonCard from './SkeletonCard';

const EditItemForm = dynamic(() => import('./EditItemForm'), {
  loading: () => (
    <div className="p-6">
      <SkeletonCard />
    </div>
  ),
  ssr: false,
});

interface EditItemFormClientProps {
  itemId: string;
}

export default function EditItemFormClient({ itemId }: EditItemFormClientProps) {
  return <EditItemForm itemId={itemId} />;
}
