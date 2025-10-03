'use client';

import { useParams, notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ItemDetail, LoadingSpinner } from './components';
import { api } from '../../../lib/apiEndpoints';
import { Item } from '../../../types';

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.id as string;
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await api.items.getItem(itemId);
        setItem(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setError('Item not found');
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text="Loading item details..." 
          className="p-8"
        />
      </div>
    );
  }

  if (error || !item) {
    notFound();
  }

  return <ItemDetail item={item} />;
}