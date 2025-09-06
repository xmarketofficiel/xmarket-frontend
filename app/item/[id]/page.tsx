'use client';

import { useParams, notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import ItemDetail from '../../../components/ItemDetail';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    notFound();
  }

  return <ItemDetail item={item} />;
}