'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { api } from '../../../lib/apiEndpoints';
import { 
  Clock, 
  Check, 
  X, 
  ShoppingBag, 
  MessageCircle,
  AlertCircle,
  User,
  ArrowLeft,
  Package,
  Heart
} from 'lucide-react';

interface PendingPurchase {
  id: number;
  itemId: number;
  buyerId: number;
  status: string;
  confirmedAt: string;
  buyerNotes?: string;
  agreedPrice: number;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: number;
    fullName: string;
    email: string;
    whatsappNumber?: string;
  };
  item: {
    id: number;
    title: string;
    description: string;
    price: number;
    condition: string;
    sellerId?: number;
    seller?: {
      id: number;
      fullName: string;
      email: string;
      whatsappNumber?: string;
    };
    images: Array<{
      id: number;
      imageUrl: string;
    }>;
  };
}

export default function PendingConfirmationsPage() {
  const { user } = useUser();
  const { addToast } = useToast();
  const [pendingPurchases, setPendingPurchases] = useState<PendingPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<'all' | 'buyer-pending' | 'seller-pending' | 'awaiting-seller'>('all');

  const fetchPendingPurchases = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use the same approach as purchase-confirmations page
      // Get pending sales where current user is the seller
      const response = await api.items.getPendingSales();
      let pendingSales = (response.data as any)?.data || response.data || [];
      if (!Array.isArray(pendingSales)) {
        pendingSales = [];
      }
      
      // Also get buyer's pending confirmations
      const confirmationsResponse = await api.items.getPendingConfirmations();
      let pendingConfirmations = (confirmationsResponse.data as any)?.data || confirmationsResponse.data || [];
      if (!Array.isArray(pendingConfirmations)) {
        pendingConfirmations = [];
      }
      
      // Also get buyer's purchases that need confirmation
      const purchasesResponse = await api.items.getMyPurchases();
      let purchasesData = (purchasesResponse.data as any)?.data || purchasesResponse.data || [];
      if (!Array.isArray(purchasesData)) {
        purchasesData = [];
      }
      
      // Filter for pending purchases
      const buyerPending = purchasesData.filter((p: any) => p && p.status === 'pending');
      
      // Ensure all arrays are valid before combining
      const safePendingSales = Array.isArray(pendingSales) ? pendingSales : [];
      const safePendingConfirmations = Array.isArray(pendingConfirmations) ? pendingConfirmations : [];
      const safeBuyerPending = Array.isArray(buyerPending) ? buyerPending : [];
      
      // Combine all types of pending items
      const allPendingItems = [
        ...safePendingSales,
        ...safePendingConfirmations, 
        ...safeBuyerPending
      ];
      
      // Remove duplicates based on ID
      const uniquePurchases = allPendingItems.filter((item: any, index: number, self: any[]) => 
        item && item.id && index === self.findIndex(p => p && p.id === item.id)
      );
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Raw API Responses:');
        console.log('- getPendingSales response:', response);
        console.log('- getPendingConfirmations response:', confirmationsResponse);
        console.log('- getMyPurchases response:', purchasesResponse);
        console.log('Processed Data:');
        console.log('- Pending Sales (seller):', pendingSales, 'Type:', typeof pendingSales, 'IsArray:', Array.isArray(pendingSales));
        console.log('- Pending Confirmations (buyer):', pendingConfirmations, 'Type:', typeof pendingConfirmations, 'IsArray:', Array.isArray(pendingConfirmations));
        console.log('- Buyer Pending:', buyerPending, 'Type:', typeof buyerPending, 'IsArray:', Array.isArray(buyerPending));
        console.log('- Combined Unique:', uniquePurchases, 'Length:', uniquePurchases.length);
        console.log('- Current User ID:', user?.id);
      }
      
      setPendingPurchases(uniquePurchases);
    } catch (error: any) {
      console.error('Error fetching pending purchases:', error);
      addToast('Failed to load pending confirmations', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, user]);

  useEffect(() => {
    if (user) {
      fetchPendingPurchases();
    }
  }, [user, fetchPendingPurchases]);

  const handleSellerConfirmation = async (purchaseId: number, confirmed: boolean, notes?: string) => {
    setProcessingIds(prev => new Set(prev).add(purchaseId));
    
    try {
  await api.items.confirmSale(String(purchaseId), confirmed, notes);
      
      // Remove from pending list
      setPendingPurchases(prev => prev.filter(purchase => purchase.id !== purchaseId));
      
      addToast(
        confirmed 
          ? 'Sale confirmed successfully! The item has been marked as sold.' 
          : 'Purchase request declined.',
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

  const handleBuyerConfirmation = async (purchaseId: number, confirmed: boolean) => {
    setProcessingIds(prev => new Set(prev).add(purchaseId));
    
    try {
      await api.items.confirmPurchase(String(purchaseId), confirmed);
      
      // Update the item in the list
      setPendingPurchases(prev => prev.map(purchase => 
        purchase.id === purchaseId 
          ? { ...purchase, status: confirmed ? 'buyer_confirmed' : 'declined' }
          : purchase
      ));
      
      addToast(
        confirmed 
          ? 'Purchase confirmation sent to seller. Waiting for seller to confirm the sale.' 
          : 'Item removed from your interests.',
        confirmed ? 'success' : 'info'
      );
    } catch (error: any) {
      addToast(error.message || 'Failed to update status', 'error');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(purchaseId);
        return newSet;
      });
    }
  };

  const openWhatsApp = (purchase: PendingPurchase) => {
    // Determine the contact based on user role
    const isSeller = (purchase.item?.sellerId === user?.id) || (purchase.item?.seller?.id === user?.id);
    const contact = isSeller ? purchase.buyer : purchase.item?.seller;

    
    if (!contact || !contact.whatsappNumber) {
      addToast('Contact has no WhatsApp number available', 'error');
      return;
    }

    const message = encodeURIComponent(
      `Hi ${contact.fullName}! Regarding the item: ${purchase.item.title} (${purchase.agreedPrice || purchase.item.price} DH)`
    );
    
    const whatsappNumber = contact.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Filter purchases by type - simplified approach
  const buyerPendingPurchases = pendingPurchases.filter(p => {
    const isBuyer = p.buyerId === user?.id;
    return isBuyer && p.status === 'pending';
  });
  
  const buyerAwaitingSellerPurchases = pendingPurchases.filter(p => {
    const isBuyer = p.buyerId === user?.id;
    return isBuyer && p.status === 'buyer_confirmed';
  });
  
  const sellerPendingPurchases = pendingPurchases.filter(p => {
    const isSeller = (p.item?.sellerId === user?.id) || (p.item?.seller?.id === user?.id);
    return isSeller && p.status === 'buyer_confirmed';
  });

  const filteredPurchases = (() => {
    switch (filter) {
      case 'buyer-pending':
        return buyerPendingPurchases;
      case 'seller-pending':
        return sellerPendingPurchases;
      case 'awaiting-seller':
        return buyerAwaitingSellerPurchases;
      default:
        return pendingPurchases;
    }
  })();

  const getFilterCount = (filterType: typeof filter) => {
    switch (filterType) {
      case 'buyer-pending':
        return buyerPendingPurchases.length;
      case 'seller-pending':
        return sellerPendingPurchases.length;
      case 'awaiting-seller':
        return buyerAwaitingSellerPurchases.length;
      default:
        return pendingPurchases.length;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to view pending confirmations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Pending Confirmations
                  {pendingPurchases.length > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-red-500 rounded-full">
                      {pendingPurchases.length > 9 ? '9+' : pendingPurchases.length}
                    </span>
                  )}
                </h1>
                <p className="text-gray-600">
                  Manage purchase confirmations
                  {pendingPurchases.length > 0 && (
                    <span className="font-medium text-red-600"> • {pendingPurchases.length} pending</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Filter Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex space-x-1 p-1">
              {(['all', 'buyer-pending', 'awaiting-seller', 'seller-pending'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-[#006666] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filterType === 'all' && `All (${getFilterCount(filterType)})`}
                  {filterType === 'buyer-pending' && `Need My Confirmation (${getFilterCount(filterType)})`}
                  {filterType === 'awaiting-seller' && `Awaiting Seller (${getFilterCount(filterType)})`}
                  {filterType === 'seller-pending' && `Sales to Confirm (${getFilterCount(filterType)})`}
                </button>
              ))}
            </div>
          </div>

          {/* Purchases List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666]"></div>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Clock size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No pending confirmations' : `No ${filter.replace('-', ' ')} items`}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? "You don't have any pending confirmations at the moment."
                  : `You don't have any ${filter.replace('-', ' ')} items at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {Array.isArray(filteredPurchases) && filteredPurchases.map((purchase) => {
                const isBuyer = purchase.buyerId === user?.id;
                const isSeller = (purchase.item?.sellerId === user?.id) || (purchase.item?.seller?.id === user?.id);
                
                const isBuyerPending = isBuyer && purchase.status === 'pending';
                const isAwaitingSeller = isBuyer && purchase.status === 'buyer_confirmed';
                const isSellerPending = isSeller && purchase.status === 'buyer_confirmed';
                
                return (
                  <div key={purchase.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {purchase.item.title}
                            </h3>
                            <p className="text-[#006666] font-bold text-xl">
                              {purchase.agreedPrice || purchase.item.price} DH
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {isSeller 
                                ? `Buyer: ${purchase.buyer?.fullName || 'Unknown'}` 
                                : `Seller: ${purchase.item?.seller?.fullName || 'Unknown'}`
                              }
                            </p>
                          </div>
                          
                          {/* Status Badge */}
                          <div>
                            {isBuyerPending && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                <AlertCircle className="w-3 h-3" />
                                Need Your Confirmation
                              </span>
                            )}
                            {isAwaitingSeller && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <Clock className="w-3 h-3" />
                                Awaiting Seller
                              </span>
                            )}
                            {isSellerPending && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <Check className="w-3 h-3" />
                                Sale to Confirm
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Confirmation Message */}
                        {isBuyerPending && (
                          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="text-sm text-orange-800">
                              <strong>Did you complete the purchase for this item?</strong>
                              <br />After negotiating with the seller, did you buy this item?
                            </p>
                          </div>
                        )}

                        {isSellerPending && (
                          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                              <strong>Buyer confirmed they purchased this item.</strong>
                              <br />Please confirm if the sale was completed.
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          {isBuyerPending && (
                            <>
                              <button
                                onClick={() => handleBuyerConfirmation(purchase.id, true)}
                                disabled={processingIds.has(purchase.id)}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {processingIds.has(purchase.id) ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Yes, I bought it
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleBuyerConfirmation(purchase.id, false)}
                                disabled={processingIds.has(purchase.id)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                No, didn't buy it
                              </button>
                            </>
                          )}

                          {isSellerPending && (
                            <>
                              <button
                                onClick={() => handleSellerConfirmation(purchase.id, true)}
                                disabled={processingIds.has(purchase.id)}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {processingIds.has(purchase.id) ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Confirm Sale
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleSellerConfirmation(purchase.id, false)}
                                disabled={processingIds.has(purchase.id)}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Decline Sale
                              </button>
                            </>
                          )}

                          {/* Contact Button */}
                          {(() => {
                            const contactForButton = isSeller ? purchase.buyer : purchase.item?.seller;
                            return contactForButton?.whatsappNumber && (
                              <button
                                onClick={() => openWhatsApp(purchase)}
                                className="flex-1 bg-[#25D366] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#20b558] transition-colors flex items-center justify-center gap-2"
                              >
                                <MessageCircle className="w-4 h-4" />
                                Contact {isSeller ? 'Buyer' : 'Seller'}
                              </button>
                            );
                          })()}
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                          Interest expressed: {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}