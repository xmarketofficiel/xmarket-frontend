'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { api } from '../../../lib/apiEndpoints';
import { 
  ArrowLeft, 
  CheckCircle, 
  Package, 
  DollarSign, 
  AlertCircle,
  Calendar,
  User as UserIcon,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

interface SoldItem {
  id: number;
  status: 'sold' | 'completed';
  soldAt: string;
  completedAt?: string;
  finalPrice: number;
  buyerNotes?: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: number;
    fullName: string;
    email: string;
  };
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
  };
}

export default function SoldItemsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { addToast } = useToast();
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSold: 0,
    totalEarnings: 0,
    averagePrice: 0
  });

  useEffect(() => {
    loadSoldItems();
  }, []);

  const loadSoldItems = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get user's items and filter for sold ones
      const itemsResponse = await api.users.getUserItems(String(user.id));
      const itemsData = itemsResponse.data?.data || itemsResponse.data || [];
      
      // Get pending confirmations to find sold items with buyer info
      const confirmationsResponse = await api.items.getPendingConfirmations();
      const confirmationsData = (confirmationsResponse.data as any)?.data || confirmationsResponse.data || [];
      
      // Filter for sold items and merge with purchase data
      const soldItemsData = itemsData
        .filter((item: any) => item.isSold || item.status === 'sold')
        .map((item: any) => {
          // Find corresponding purchase confirmation for buyer info
          const purchase = confirmationsData.find((conf: any) => 
            conf.itemId === item.id && (conf.status === 'completed' || conf.status === 'confirmed')
          );
          
          return {
            id: item.id,
            status: 'sold',
            soldAt: item.updatedAt || item.createdAt,
            finalPrice: purchase?.agreedPrice || item.price,
            item: item,
            buyer: purchase?.buyer || {
              id: 0,
              fullName: 'Anonymous Buyer',
              email: 'buyer@example.com'
            }
          };
        });
      
      setSoldItems(soldItemsData);
      
      // Calculate stats
      const totalEarnings = soldItemsData.reduce((sum: number, sold: SoldItem) => sum + sold.finalPrice, 0);
      const averagePrice = soldItemsData.length > 0 ? totalEarnings / soldItemsData.length : 0;
      
      setStats({
        totalSold: soldItemsData.length,
        totalEarnings,
        averagePrice
      });
    } catch (error: any) {
      console.error('Error loading sold items:', error);
      setError('Failed to load sold items');
      addToast('Failed to load sold items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: any) => {
    router.push(`/item/${item.item.id}`);
  };

  const handleItemAction = async (action: string, item: any) => {
    // Actions for sold items
    switch (action) {
      case 'view':
        router.push(`/item/${item.item.id}`);
        break;
      case 'relist':
        // Future: Create similar listing
        addToast('Relist functionality coming soon!', 'info');
        break;
      case 'contact-buyer':
        // Future: Contact buyer
        addToast('Contact buyer functionality coming soon!', 'info');
        break;
      default:
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Sold
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            <Package className="w-3 h-3" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const LoadingState = () => (
    <div className="space-y-4">
      {/* Stats Loading */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
            <div className="h-6 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
      
      {/* Items Loading */}
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
          <TrendingUp className="w-10 h-10 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Sold Items Yet
        </h3>
        
        <p className="text-gray-600 mb-6">
          You haven't sold any items yet. List some items to start earning!
        </p>
        
        <button
          onClick={() => router.push('/add-item')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009F9C] to-[#007A77] text-white rounded-xl hover:from-[#007A77] hover:to-[#006B68] transition-all font-medium"
        >
          <Package className="w-4 h-4" />
          List an Item
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
          {error || 'Failed to load sold items. Please try again.'}
        </p>
        
        <button
          onClick={loadSoldItems}
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
                <CheckCircle className="w-4 h-4 text-[#009F9C]" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Sold Items</h1>
                <p className="text-sm text-gray-500">
                  {soldItems.length} item{soldItems.length !== 1 ? 's' : ''} sold
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
        ) : soldItems.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-[#009F9C]" />
                  <span className="text-sm text-gray-600">Total Sold</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalSold}</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Earnings</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalEarnings} DH</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Avg Price</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{Math.round(stats.averagePrice)} DH</div>
              </div>
            </div>

            {/* Sold Items List */}
            <div className="space-y-4">
              {soldItems.map((soldItem) => (
                <div key={soldItem.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {soldItem.item.images?.[0]?.imageUrl ? (
                        <img
                          src={soldItem.item.images[0].imageUrl}
                          alt={soldItem.item.title}
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
                          {soldItem.item.title}
                        </h3>
                        {getStatusBadge(soldItem.status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-green-600">
                            Sold for {soldItem.finalPrice} DH
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="capitalize">{soldItem.item.condition}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          <span>Sold to {soldItem.buyer.fullName}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Sold on {new Date(soldItem.soldAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleItemAction('view', soldItem)}
                          className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          View Item
                        </button>
                        <button
                          onClick={() => handleItemAction('relist', soldItem)}
                          className="px-3 py-1.5 text-xs font-medium bg-[#009F9C]/10 hover:bg-[#009F9C]/20 text-[#009F9C] rounded-lg transition-colors"
                        >
                          Relist Similar
                        </button>
                        <button
                          onClick={() => handleItemAction('contact-buyer', soldItem)}
                          className="px-3 py-1.5 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                        >
                          Contact Buyer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
