'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy } from 'lucide-react';
import { SHARE_OPTIONS } from '../constants';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    price: number | string;
  };
}

export default function ShareModal({ isOpen, onClose, item }: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareOption = async (option: typeof SHARE_OPTIONS[0]) => {
    try {
      if (option.id === 'copy-link') {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        const url = option.getUrl(item);
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Share Item</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Item Preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {typeof item.price === 'string' ? item.price : `${item.price} DH`}
              </p>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              {SHARE_OPTIONS.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleShareOption(option)}
                  className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${option.color}15` }}
                  >
                    <span>{option.icon}</span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 group-hover:text-gray-700">
                      {option.name}
                    </div>
                    {option.id === 'copy-link' && (
                      <div className="text-sm text-gray-500">
                        {copiedLink ? 'Link copied!' : 'Copy link to clipboard'}
                      </div>
                    )}
                  </div>

                  {option.id === 'copy-link' && copiedLink && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-500"
                    >
                      <Check size={20} />
                    </motion.div>
                  )}

                  {option.id === 'copy-link' && !copiedLink && (
                    <Copy size={20} className="text-gray-400 group-hover:text-gray-600" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Current URL Display */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="text-sm font-medium text-gray-700 mb-2">Link</div>
              <div className="text-xs text-gray-500 break-all bg-white p-2 rounded border">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
