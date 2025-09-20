'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Package, MessageSquare } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { useUser } from '../../../contexts/UserContext';
import { api } from '../../../lib/apiEndpoints';

interface PurchaseItem {
  id: number;
  status: string;
  buyerNotes: string;
  agreedPrice: number;
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

export default function PurchaseConfirmationsPage() {
  const [pendingPurchases, setPendingPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const { addToast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchPendingConfirmations();
    }
  }, [user]);

  const fetchPendingConfirmations = async () => {
    try {
      setLoading(true);
      const response = await api.items.getPendingConfirmations();
      // Handle the nested data structure: response.data.data contains the array
      const purchases = (response.data as any)?.data || response.data || [];
      setPendingPurchases(Array.isArray(purchases) ? purchases : []);
    } catch (error: any) {
      console.error('Failed to fetch pending confirmations:', error);
      addToast(error.message || 'Failed to load pending confirmations', 'error');
      setPendingPurchases([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async (purchaseId: number, confirmed: boolean, notes?: string) => {
    setProcessingIds(prev => new Set(prev).add(purchaseId));
    
    try {
      await api.items.confirmPurchase(String(purchaseId), confirmed, notes);
      
      // Remove from pending list
      setPendingPurchases(prev => prev.filter(p => p.id !== purchaseId));
      
      addToast(
        confirmed 
          ? 'Purchase confirmed! Item added to your purchased items.' 
          : 'Purchase declined successfully.',
        confirmed ? 'success' : 'info'
      );
    } catch (error: any) {
      addToast(error.message || 'Failed to process confirmation', 'error');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(purchaseId);
        return newSet;
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view purchase confirmations</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending confirmations...</p>
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
            <Clock className="w-6 h-6 text-[#006666]" />
            Purchase Confirmations
            {pendingPurchases.length > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-red-500 rounded-full">
                {pendingPurchases.length > 9 ? '9+' : pendingPurchases.length}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Confirm or decline your interest in these items
            {pendingPurchases.length > 0 && (
              <span className="font-medium text-red-600"> • {pendingPurchases.length} pending</span>
            )}
          </p>
        </div>

        {/* Pending Confirmations */}
        {pendingPurchases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Confirmations</h3>
            <p className="text-gray-600">
              You don't have any purchase confirmations waiting for your decision.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(pendingPurchases) && pendingPurchases.map((purchase) => (
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

                  {/* Item Details */}
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
                    </div>

                    {/* Notes */}
                    {purchase.buyerNotes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Your notes:</strong> {purchase.buyerNotes}
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    <p className="text-xs text-gray-500 mb-4">
                      Interest expressed: {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleConfirmPurchase(purchase.id, true)}
                        disabled={processingIds.has(purchase.id)}
                        className="flex-1 bg-[#006666] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processingIds.has(purchase.id) ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Yes, I want to buy this
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleConfirmPurchase(purchase.id, false, 'Changed my mind')}
                        disabled={processingIds.has(purchase.id)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        No, not interested
                      </button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-800">
                        <strong>What happens next?</strong> If you confirm, the item will be marked as sold 
                        and added to your purchase history. The seller will be notified to arrange delivery.
                      </p>
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
