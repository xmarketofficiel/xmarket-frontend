'use client';

import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { useUser } from '../../../contexts/UserContext';
import { api } from '../../../lib/apiEndpoints';

interface PurchaseItem {
  id: number;
  status: string;
  buyerNotes: string;
  agreedPrice: number;
  confirmedAt?: string;
  createdAt: string;
  item: {
    id: number;
    title: string;
    price: number;
    images: Array<{ imageUrl: string }>;
    seller: {
      fullName: string;
      whatsappNumber?: string;
    };
  };
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { 
      icon: Clock, 
      text: 'Awaiting Confirmation', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
    },
    confirmed: { 
      icon: CheckCircle, 
      text: 'Purchase Confirmed', 
      className: 'bg-green-100 text-green-800 border-green-200' 
    },
    declined: { 
      icon: XCircle, 
      text: 'Declined', 
      className: 'bg-red-100 text-red-800 border-red-200' 
    },
    completed: { 
      icon: CheckCircle, 
      text: 'Completed', 
      className: 'bg-blue-100 text-blue-800 border-blue-200' 
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
};

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { addToast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user, filter]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const filterParam = filter === 'all' ? undefined : filter;
      const response = await api.items.getMyPurchases(filterParam);
      setPurchases(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch purchases:', error);
      addToast(error.message || 'Failed to load purchase history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (filter === 'all') return true;
    return purchase.status === filter;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your purchase history</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your purchases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-[#006666]" />
            My Purchases
          </h1>
          <p className="text-gray-600 mt-2">
            Track your purchase history and status
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Purchases' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'completed', label: 'Completed' },
            { key: 'declined', label: 'Declined' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-[#006666] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Purchase List */}
        {filteredPurchases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No Purchases Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Purchases`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Start exploring items and express your interest in purchasing!'
                : `You don't have any ${filter} purchases.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPurchases.map((purchase) => (
              <div key={purchase.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Item Image */}
                  <div className="w-full lg:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {purchase.item.images?.[0]?.imageUrl ? (
                      <img
                        src={purchase.item.images[0].imageUrl.startsWith('/') 
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001')}${purchase.item.images[0].imageUrl}`
                          : purchase.item.images[0].imageUrl
                        }
                        alt={purchase.item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Purchase Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {purchase.item.title}
                        </h3>
                        <p className="text-xl font-bold text-[#006666]">
                          {purchase.agreedPrice} DH
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Seller: {purchase.item.seller.fullName}
                        </p>
                      </div>
                      <StatusBadge status={purchase.status} />
                    </div>

                    {/* Notes */}
                    {purchase.buyerNotes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {purchase.buyerNotes}
                        </p>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Interest expressed: {new Date(purchase.createdAt).toLocaleDateString()}
                      </div>
                      {purchase.confirmedAt && (
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" />
                          Confirmed: {new Date(purchase.confirmedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Action Info */}
                    {purchase.status === 'confirmed' && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Next steps:</strong> The seller has been notified of your purchase. 
                          They should contact you soon to arrange payment and delivery.
                        </p>
                      </div>
                    )}

                    {purchase.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <strong>Action needed:</strong> Please confirm if you want to proceed with this purchase 
                          in your{' '}
                          <a 
                            href="/profile/purchase-confirmations" 
                            className="font-medium underline hover:no-underline"
                          >
                            confirmation center
                          </a>.
                        </p>
                      </div>
                    )}
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
