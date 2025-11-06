import React from 'react';

interface ConfirmedPurchaseWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAnyway: () => void;
  itemTitle: string;
  newTitle?: string; // Add optional new title prop
  currentPrice: number;
  newPrice: number;
  confirmedBuyersCount: number;
  blockedField: 'price' | 'title';
}

export default function ConfirmedPurchaseWarning({ 
  isOpen, 
  onClose, 
  onContinueAnyway, 
  itemTitle, 
  newTitle,
  currentPrice, 
  newPrice, 
  confirmedBuyersCount,
  blockedField 
}: ConfirmedPurchaseWarningProps) {
  if (!isOpen) return null;

  const priceChange = newPrice > currentPrice ? 'increase' : 'decrease';
  const priceDifference = Math.abs(newPrice - currentPrice);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 text-amber-500">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Active Purchase Agreements
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-5 h-5 text-blue-500 mt-0.5">👥</div>
            <div>
              <p className="text-sm text-gray-600">
                You have <span className="font-semibold text-gray-900">{confirmedBuyersCount} confirmed buyer(s)</span> for this item.
              </p>
            </div>
          </div>

          {/* Current vs New Value */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {blockedField === 'price' ? 'Price Change' : 'Title Change'}
            </h4>
            
            {blockedField === 'price' ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Agreed Price:</span>
                  <span className="text-sm font-medium">{currentPrice} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Price:</span>
                  <span className="text-sm font-medium">{newPrice} DH</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm text-gray-600">Change:</span>
                  <span className={`text-sm font-medium ${priceChange === 'increase' ? 'text-red-600' : 'text-green-600'}`}>
                    {priceChange === 'increase' ? '+' : '-'}{priceDifference.toFixed(2)} DH ({priceChange})
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Current Title:</span>
                  <p className="text-sm font-medium">"{itemTitle}"</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">New Title:</span>
                  <p className="text-sm font-medium text-blue-600">"{newTitle || 'New Title'}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Warning Text */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-amber-800">
              Changing the {blockedField} could affect existing purchase agreements with confirmed buyers.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Your Options:</h4>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="font-medium text-[#006666]">1.</span>
                <span>Keep current {blockedField} and edit other details</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium text-[#006666]">2.</span>
                <span>Contact buyers directly to discuss the change</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium text-[#006666]">3.</span>
                <span>Create a new listing with the desired {blockedField}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006666]"
          >
            Cancel Edit
          </button>
          <button
            onClick={onContinueAnyway}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Contact Buyers First
          </button>
        </div>
      </div>
    </div>
  );
}
