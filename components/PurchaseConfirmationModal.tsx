'use client';

import React, { useState } from 'react';
import { X, ShoppingCart, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { api } from '../lib/apiEndpoints';

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    price: number;
    seller?: {
      fullName: string;
      whatsappNumber?: string;
    };
  };
  onConfirmed?: () => void;
}

export default function PurchaseConfirmationModal({ 
  isOpen, 
  onClose, 
  item, 
  onConfirmed 
}: PurchaseConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const { addToast } = useToast();

  const handleExpressInterest = async () => {
    // Prevent multiple rapid clicks
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await api.items.expressInterest(item.id, notes);
      addToast('Interest expressed successfully! Waiting for your confirmation.', 'success');
      onClose();
      onConfirmed?.();
    } catch (error: any) {
      console.log('Express interest error:', error); // Debug log
      
      // Check for duplicate interest error
      if (error.name === 'DuplicateInterestError' || 
          error.message?.includes('already shown interest') ||
          error.message?.includes('already expressed interest')) {
        addToast('You have already shown interest in this item', 'info');
        onClose();
        onConfirmed?.();
      } else {
        addToast(error.message || 'Failed to express interest', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#006666]" />
              Purchase Interest
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Express your interest in buying this item
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Item Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold text-[#006666]">{item.price} DH</span>
            </div>
            {item.seller?.fullName && (
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Seller:</span>
                <span className="text-gray-900">{item.seller.fullName}</span>
              </div>
            )}
          </div>

          {/* Process Explanation */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              How it works:
            </h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Express your interest with optional notes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>You'll receive a confirmation request in your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Decide "Yes" to confirm purchase or "No" to cancel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">4.</span>
                <span>Confirmed purchases appear in your purchase history</span>
              </li>
            </ol>
          </div>

          {/* Notes Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Additional Notes <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any questions for the seller or special requests..."
              rows={3}
              maxLength={500}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006666] focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
            />
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>Share any questions or requirements with the seller</span>
              <span>{notes.length}/500</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleExpressInterest}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#006666] text-white rounded-lg hover:bg-[#005555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Express Interest
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
