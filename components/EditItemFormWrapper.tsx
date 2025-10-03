/**
 * Dynamic EditItemForm Component
 * Implements code splitting for the large EditItemForm component (704 lines)
 * Uses dynamic import with skeleton loading for better performance
 */

'use client';

import dynamic from 'next/dynamic';
import EditItemFormSkeleton from './EditItemFormSkeleton';

// Dynamic import with skeleton loading
const EditItemFormDynamic = dynamic(
  () => import('./EditItemForm'),
  {
    loading: () => <EditItemFormSkeleton />,
    ssr: false // EditItemForm has client-side dependencies
  }
);

interface EditItemFormWrapperProps {
  itemId: string;
}

export default function EditItemFormWrapper({ itemId }: EditItemFormWrapperProps) {
  return <EditItemFormDynamic itemId={itemId} />;
}