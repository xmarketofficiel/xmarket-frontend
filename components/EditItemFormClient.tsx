"use client";

import dynamic from 'next/dynamic';
import EditItemFormSkeleton from './EditItemFormSkeleton';

// Dynamic import with comprehensive skeleton loading
// Reduces initial bundle size by lazy loading the 704-line EditItemForm component
const EditItemForm = dynamic(() => import('./EditItemForm'), {
  loading: () => <EditItemFormSkeleton />,
  ssr: false, // EditItemForm has client-side dependencies and localStorage usage
});

interface EditItemFormClientProps {
  itemId: string;
}

export default function EditItemFormClient({ itemId }: EditItemFormClientProps) {
  return <EditItemForm itemId={itemId} />;
}
