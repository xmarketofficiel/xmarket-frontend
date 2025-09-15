import React from 'react';

interface ConfirmedPurchaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  itemTitle: string;
  confirmedBuyersCount: number;
  changeType: 'price' | 'title' | 'quantity';
  currentValue: string | number;
  newValue: string | number;
}

export default function ConfirmedPurchaseInfoModal({ 
  isOpen, 
  onClose, 
  onProceed,
  itemTitle, 
  confirmedBuyersCount,
  changeType,
  currentValue,
  newValue
}: ConfirmedPurchaseInfoModalProps) {
  if (!isOpen) return null;

  const getChangeDescription = () => {
    switch (changeType) {
      case 'price':
        return {
          title: 'Price Change Notice',
          description: `You're changing the price from $${currentValue} to $${newValue}`,
          impact: 'This change may affect buyer expectations, but confirmed purchases will honor the original agreed price.'
        };
      case 'title':
        return {
          title: 'Title Change Notice',
          description: `You're changing the title from "${currentValue}" to "${newValue}"`,
          impact: 'This change may affect buyer expectations, but confirmed purchases refer to the original title.'
        };
      case 'quantity':
        return {
          title: 'Quantity Change Notice',
          description: `You're changing the quantity from ${currentValue} to ${newValue}`,
          impact: 'Make sure you can fulfill all confirmed purchases after this change.'
        };
      default:
        return {
          title: 'Item Change Notice',
          description: 'You\'re making changes to this item',
          impact: 'This change may affect buyer expectations.'
        };
    }
  };

  const changeInfo = getChangeDescription();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 text-blue-500">ℹ️</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {changeInfo.title}
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
          {/* Info Message */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-5 h-5 text-amber-500 mt-0.5">⚠️</div>
            <div>
              <p className="text-sm text-gray-600">
                You have <span className="font-semibold text-gray-900">{confirmedBuyersCount} confirmed purchase(s)</span> for this item.
              </p>
            </div>
          </div>

          {/* Change Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Change Details</h4>
            <p className="text-sm text-blue-800">{changeInfo.description}</p>
          </div>

          {/* Impact Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-amber-800">
              <strong>Impact:</strong> {changeInfo.impact}
            </p>
          </div>

          {/* Good to know */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Good to know:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-green-600">✓</span>
                <span>Confirmed purchases will honor the original agreement</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600">✓</span>
                <span>You can still make this change if needed</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">ℹ️</span>
                <span>Consider notifying buyers about significant changes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006666]"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#006666] rounded-md hover:bg-[#005555] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006666]"
          >
            Proceed with Change
          </button>
        </div>
      </div>
    </div>
  );
}
