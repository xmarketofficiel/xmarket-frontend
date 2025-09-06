'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Flag, Shield, Zap } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { api } from '../lib/apiEndpoints';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
}

export interface ReportReason {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const REPORT_REASONS: ReportReason[] = [
  {
    id: 'inappropriate_content',
    label: 'Inappropriate Content',
    description: 'Contains offensive, adult, or inappropriate material',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'misleading_info',
    label: 'Misleading Information',
    description: 'False or misleading product details, fake images, or incorrect pricing',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: 'spam_duplicate',
    label: 'Spam or Duplicate',
    description: 'Repeated posting or spam content',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'prohibited_item',
    label: 'Prohibited Item',
    description: 'Selling items that are not allowed on the platform',
    icon: <Flag className="w-5 h-5" />
  },
  {
    id: 'copyright_violation',
    label: 'Copyright Violation',
    description: 'Unauthorized use of copyrighted images or content',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'safety_concern',
    label: 'Safety Concern',
    description: 'Item poses potential safety risks or hazards',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: 'fraud_scam',
    label: 'Fraud or Scam',
    description: 'Suspicious activity, potential fraud, or scam attempt',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Other reason not listed above',
    icon: <Flag className="w-5 h-5" />
  }
];

export default function ReportModal({ isOpen, onClose, itemId, itemTitle }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) {
      addToast('Please select a reason for reporting', 'error');
      return;
    }

    if (selectedReason === 'other' && !customMessage.trim()) {
      addToast('Please provide details when selecting "Other"', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedReasonData = REPORT_REASONS.find(r => r.id === selectedReason);
      const reportReason = selectedReason === 'other' 
        ? customMessage.trim()
        : `${selectedReasonData?.label}: ${customMessage.trim() || selectedReasonData?.description}`;

      await api.items.reportItem(itemId, reportReason);
      
      addToast('Report submitted successfully. We will review it shortly.', 'success');
      onClose();
      
      // Reset form
      setSelectedReason('');
      setCustomMessage('');
    } catch (error: any) {
      addToast(error.message || 'Failed to submit report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    setSelectedReason('');
    setCustomMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-500" />
              Report Item
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Report: <span className="font-medium">{itemTitle}</span>
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

        <form onSubmit={handleSubmit} className="p-6">
          {/* Report Reasons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Why are you reporting this item? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReason(reason.id);
                  }}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedReason === reason.id
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${
                      selectedReason === reason.id ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {reason.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{reason.label}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {reason.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Additional details {selectedReason === 'other' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={selectedReason === 'other' 
                ? "Please provide details about why you're reporting this item..." 
                : "Optional: Provide additional context or details (recommended)"}
              rows={4}
              maxLength={1000}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
            />
            <div className="text-xs text-gray-500 mt-1 flex justify-between">
              <span>Help us understand the issue better</span>
              <span>{customMessage.length}/1000</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Report Policy</p>
                <ul className="space-y-1 text-xs">
                  <li>• Reports are reviewed by our moderation team within 24-48 hours</li>
                  <li>• False reports may result in account restrictions</li>
                  <li>• Your report is anonymous to the seller</li>
                  <li>• We may contact you for additional information if needed</li>
                </ul>
              </div>
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
              type="submit"
              disabled={!selectedReason || isSubmitting || (selectedReason === 'other' && !customMessage.trim())}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
