'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Check, X, MessageCircle, Clock, ShoppingBag } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { useUser } from '../../../contexts/UserContext';
import { api } from '../../../lib/apiEndpoints';

interface InterestItem {
  id: number;
  status: string;
  buyerNotes: string;
  agreedPrice: number;
  createdAt: string;
  confirmedAt?: string;
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

export default function MyInterestsPage() {
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const { addToast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchInterests();
    }
  }, [user]);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const response = await api.items.getMyPurchases(); // This gets all purchase records
      setInterests(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch interests:', error);
      addToast(error.message || 'Failed to load your interests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (purchaseId: number, completed: boolean) => {
    setProcessingIds(prev => new Set(prev).add(purchaseId));
    
    try {
      await api.items.confirmPurchase(String(purchaseId), completed);
      
      // Update the item in the list
      setInterests(prev => prev.map(interest => 
        interest.id === purchaseId 
          ? { ...interest, status: completed ? 'buyer_confirmed' : 'declined' }
          : interest
      ));
      
      addToast(
        completed 
          ? 'Purchase confirmation sent to seller. Waiting for seller to confirm the sale.' 
          : 'Item removed from your interests.',
        completed ? 'success' : 'info'
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

  const openWhatsApp = (item: InterestItem) => {
    if (item.item.seller.whatsappNumber) {
      const message = encodeURIComponent(`Hi! I'm following up on the item: ${item.item.title} (${item.item.price} DH)`);
      const whatsappNumber = item.item.seller.whatsappNumber.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } else {
      addToast('Seller has no WhatsApp number available', 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your interests</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your interests...</p>
        </div>
      </div>
    );
  }

  const pendingInterests = interests.filter(interest => interest.status === 'pending');
  const buyerConfirmedPurchases = interests.filter(interest => interest.status === 'buyer_confirmed');
  const completedPurchases = interests.filter(interest => interest.status === 'confirmed');
  const declinedInterests = interests.filter(interest => interest.status === 'declined');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#006666]" />
            My Interests & Purchases
          </h1>
          <p className="text-gray-600 mt-2">
            Track items you're interested in and confirm completed purchases
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingInterests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Awaiting Seller</p>
                <p className="text-2xl font-bold text-blue-600">{buyerConfirmedPurchases.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedPurchases.length}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Interests</p>
                <p className="text-2xl font-bold text-[#006666]">{interests.length}</p>
              </div>
              <Heart className="w-8 h-8 text-[#006666]" />
            </div>
          </div>
        </div>

        {/* Pending Items - Need Confirmation */}
        {pendingInterests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Items Awaiting Your Confirmation
            </h2>
            <div className="space-y-4">
              {pendingInterests.map((interest) => (
                <div key={interest.id} className="bg-white rounded-lg shadow-sm p-6 border border-orange-200">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Item Image */}
                    <div className="w-full lg:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {interest.item.images?.[0]?.imageUrl ? (
                        <img
                          src={interest.item.images[0].imageUrl.startsWith('/') 
                            ? `http://localhost:3001${interest.item.images[0].imageUrl}`
                            : interest.item.images[0].imageUrl
                          }
                          alt={interest.item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {interest.item.title}
                          </h3>
                          <p className="text-lg font-bold text-[#006666]">
                            {interest.item.price} DH
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Seller: {interest.item.seller.fullName}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-800">
                          <strong>Did you complete the purchase for this item?</strong>
                          <br />After negotiating with the seller, did you buy this item?
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleMarkCompleted(interest.id, true)}
                          disabled={processingIds.has(interest.id)}
                          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processingIds.has(interest.id) ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check className="w-5 h-5" />
                              Yes, I bought it
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleMarkCompleted(interest.id, false)}
                          disabled={processingIds.has(interest.id)}
                          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          No, didn't buy it
                        </button>

                        {interest.item.seller.whatsappNumber && (
                          <button
                            onClick={() => openWhatsApp(interest)}
                            className="flex-1 bg-[#25D366] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#20b558] transition-colors flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-5 h-5" />
                            Contact Seller
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Interest expressed: {new Date(interest.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buyer Confirmed - Awaiting Seller Confirmation */}
        {buyerConfirmedPurchases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Awaiting Seller Confirmation
            </h2>
            <div className="space-y-4">
              {buyerConfirmedPurchases.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Item Image */}
                    <div className="w-full lg:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {purchase.item.images?.[0]?.imageUrl ? (
                        <img
                          src={purchase.item.images[0].imageUrl}
                          alt={purchase.item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{purchase.item.title}</h3>
                          <p className="text-[#006666] font-bold text-xl">${purchase.item.price}</p>
                          <p className="text-gray-600 text-sm mt-1">
                            Sold by: {purchase.item.seller.fullName}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Waiting for seller confirmation
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-gray-600">
                        <p className="mb-2">✅ You confirmed the purchase</p>
                        <p className="mb-2">⏳ Waiting for seller to confirm the sale</p>
                        <p className="text-xs text-gray-500">
                          Confirmed: {purchase.confirmedAt ? new Date(purchase.confirmedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>

                      {/* Contact Seller Button */}
                      {purchase.item.seller.whatsappNumber && (
                        <div className="mt-4">
                          <button
                            onClick={() => openWhatsApp(purchase)}
                            className="bg-[#25D366] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#20b558] transition-colors flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Contact Seller
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Purchases */}
        {completedPurchases.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              My Completed Purchases
            </h2>
            <div className="space-y-4">
              {completedPurchases.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-lg shadow-sm p-6 border border-green-200">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Item Image */}
                    <div className="w-full lg:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {purchase.item.images?.[0]?.imageUrl ? (
                        <img
                          src={purchase.item.images[0].imageUrl.startsWith('/') 
                            ? `http://localhost:3001${purchase.item.images[0].imageUrl}`
                            : purchase.item.images[0].imageUrl
                          }
                          alt={purchase.item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {purchase.item.title}
                          </h3>
                          <p className="text-lg font-bold text-green-600">
                            {purchase.item.price} DH
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Seller: {purchase.item.seller.fullName}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <Check className="w-3 h-3" />
                          Purchased
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Interest expressed: {new Date(purchase.createdAt).toLocaleDateString()}</p>
                        {purchase.confirmedAt && (
                          <p>Purchase confirmed: {new Date(purchase.confirmedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {interests.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Interests Yet</h3>
            <p className="text-gray-600">
              Start exploring items and click "I Want This" to express your interest!
            </p>
          </div>
        )}

        {/* Empty Pending State */}
        {interests.length > 0 && pendingInterests.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Confirmations</h3>
            <p className="text-gray-600">
              All your interests have been processed. Keep exploring for more items!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
