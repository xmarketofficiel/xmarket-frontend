'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { api } from '../../../lib/apiEndpoints';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Package, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  MapPin,
  User as UserIcon,
  RefreshCw
} from 'lucide-react';
import ProfileItemCard from '../components/ProfileItemCard';

interface PurchaseItem {
  id: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  confirmedAt: string;
  completedAt?: string;
  agreedPrice: number;
  buyerNotes?: string;
  createdAt: string;
  updatedAt: string;
  item: {
    id: number;
    title: string;
    description: string;
    price: number;
    condition: string;
    images: Array<{
      id: number;
      imageUrl: string;
    }>;
    seller?: {
      id: number;
      fullName: string;
      email: string;
    };
  };
}

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const { user } = useUser();
  const { addToast } = useToast();
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Use the correct API endpoint for user's purchases with completed status
      const response = await api.items.getMyPurchases('completed');
      const responseData = (response.data as any)?.data || response.data || [];
      
      setPurchases(responseData);
    } catch (error: any) {
      console.error('Error loading purchase history:', error);
      setError('Failed to load purchase history');
      addToast('Failed to load purchase history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: any) => {
    router.push(`/item/${item.item.id}`);
  };

  const handleItemAction = async (action: string, item: any) => {
    // Actions for purchase history items
    switch (action) {
      case 'view':
        router.push(`/item/${item.item.id}`);
        break;
      case 'reorder':
        // Future: Add to cart or quick reorder functionality
        addToast('Reorder functionality coming soon!', 'info');
        break;
      case 'review':
        // Future: Leave a review
        addToast('Review functionality coming soon!', 'info');
        break;
      default:
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            <Package className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const LoadingState = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Purchase History
        </h3>
        
        <p className="text-gray-600 mb-6">
          You haven't completed any purchases yet. Start exploring the marketplace!
        </p>
        
        <button
          onClick={() => router.push('/marketplace')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-xl hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Marketplace
        </button>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {error || 'Failed to load purchase history. Please try again.'}
        </p>
        
        <button
          onClick={loadPurchases}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#009F9C] text-white rounded-xl hover:bg-[#007A77] transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/profile')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#009F9C]/10 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#009F9C]" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Order History</h1>
                <p className="text-sm text-gray-500">
                  {purchases.length} completed purchase{purchases.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {error ? (
          <ErrorState />
        ) : loading ? (
          <LoadingState />
        ) : purchases.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {purchase.item.images?.[0]?.imageUrl ? (
                      <img
                        src={purchase.item.images[0].imageUrl}
                        alt={purchase.item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {purchase.item.title}
                      </h3>
                      {getStatusBadge(purchase.status)}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#009F9C]">
                          {purchase.agreedPrice} DH
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="capitalize">{purchase.item.condition}</span>
                      </div>

                      {purchase.item.seller && (
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          <span>Sold by {purchase.item.seller.fullName}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Completed on {new Date(purchase.completedAt || purchase.confirmedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleItemAction('view', purchase)}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        View Item
                      </button>
                      <button
                        onClick={() => handleItemAction('reorder', purchase)}
                        className="px-3 py-1.5 text-xs font-medium bg-[#009F9C]/10 hover:bg-[#009F9C]/20 text-[#009F9C] rounded-lg transition-colors"
                      >
                        Reorder
                      </button>
                      <button
                        onClick={() => handleItemAction('review', purchase)}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
