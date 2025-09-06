'use client';

import { useState, useEffect } from 'react';
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
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
    images: Array<{
      id: number;
      imageUrl: string;
    }>;
  };
}

export default function PendingSalesPage() {
  const { user } = useUser();
  const { addToast } = useToast();
  const [pendingPurchases, setPendingPurchases] = useState<PendingPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (user) {
      fetchPendingPurchases();
    }
  }, [user]);

  const fetchPendingPurchases = async () => {
    try {
      setLoading(true);
      
      // Use the new pending sales endpoint specifically for sellers
      const response = await api.items.getPendingSales();
      const purchases = response.data || [];
      
      // Ensure purchases is an array before mapping
      if (!Array.isArray(purchases)) {
        console.error('Expected purchases to be an array, got:', typeof purchases, purchases);
        setPendingPurchases([]);
        return;
      }
      
      // Map the data to include notification timestamps from the actual purchase data
      const mappedPurchases = purchases.map((purchase: any) => ({
        ...purchase,
        notificationId: `purchase-${purchase.id}`,
        notificationCreatedAt: purchase.createdAt
      }));
      
      setPendingPurchases(mappedPurchases);
    } catch (error: any) {
      console.error('Error fetching pending purchases:', error);
      addToast('Failed to load pending sales', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSellerConfirmation = async (purchaseId: number, confirmed: boolean, notes?: string) => {
    setProcessingIds(prev => new Set(prev).add(purchaseId));
    
    try {
      await api.items.sellerConfirmPurchase(String(purchaseId), confirmed, notes);
      
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

  const openWhatsApp = (purchase: PendingPurchase) => {
    if (!purchase.buyer.whatsappNumber) {
      addToast('Buyer has not provided WhatsApp number', 'error');
      return;
    }

    const message = encodeURIComponent(
      `Hi ${purchase.buyer.fullName}! I'm confirming your purchase of "${purchase.item.title}" for $${purchase.agreedPrice}. Let's arrange the handover details.`
    );
    
    const whatsappNumber = purchase.buyer.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view pending sales.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666] mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading pending sales...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#006666] flex items-center gap-1">
            <Home size={16} />
            Home
          </Link>
          <span>›</span>
          <Link href="/profile" className="hover:text-[#006666]">Profile</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Pending Sales</span>
        </nav>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#006666]" />
            Pending Sales Confirmations
          </h1>
          <p className="text-gray-600 mt-2">
            Confirm sales when buyers have indicated they purchased your items
          </p>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>How to get here:</strong> Go to your Profile → Click "Pending Sales" button, 
              or look for the notification bell 🔔 in the bottom navigation when you have pending confirmations.
            </p>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Confirmations</p>
              <p className="text-3xl font-bold text-orange-600">{pendingPurchases.length}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </div>
        </motion.div>

        {/* Pending Purchases */}
        {pendingPurchases.length > 0 ? (
          <div className="space-y-6">
            {pendingPurchases.map((purchase, index) => {
              // Safety check to ensure purchase and item exist
              if (!purchase || !purchase.item) {
                console.warn('Invalid purchase data:', purchase);
                return null;
              }

              return (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6 border border-orange-200"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Item Image */}
                    <div className="w-full lg:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {purchase.item.images?.[0]?.imageUrl ? (
                        <img
                          src={purchase.item.images[0].imageUrl}
                          alt={purchase.item.title || 'Item image'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Purchase Details */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 text-xl">{purchase.item.title || 'Untitled Item'}</h3>
                        <p className="text-[#006666] font-bold text-2xl">${purchase.agreedPrice || purchase.item.price}</p>
                        
                        {/* Buyer Info */}
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-900">
                              Buyer: {purchase.buyer?.fullName || 'Unknown Buyer'}
                            </span>
                          </div>
                          <p className="text-sm text-blue-700">
                            ✅ Confirmed purchase on {purchase.confirmedAt ? new Date(purchase.confirmedAt).toLocaleDateString() : 'Unknown date'}
                          </p>
                          {purchase.buyerNotes && (
                          <p className="text-sm text-blue-700 mt-1">
                            <strong>Note:</strong> {purchase.buyerNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleSellerConfirmation(purchase.id, true)}
                        disabled={processingIds.has(purchase.id)}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processingIds.has(purchase.id) ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Confirm Sale
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSellerConfirmation(purchase.id, false)}
                        disabled={processingIds.has(purchase.id)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Not Sold
                      </button>

                      {purchase.buyer.whatsappNumber && (
                        <button
                          onClick={() => openWhatsApp(purchase)}
                          className="flex-1 bg-[#25D366] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#20b558] transition-colors flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Contact Buyer
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Interest expressed: {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
              );
            }).filter(Boolean)}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Confirmations</h3>
            <p className="text-gray-600">
              You don't have any sales waiting for confirmation at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
