'use client';

import React from 'react';

export function ItemDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 animate-pulse">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="animate-pulse">
        {/* Image Gallery */}
        <div className="aspect-square bg-gray-200 w-full relative">
          <div className="absolute bottom-4 right-4">
            <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Title and Price */}
          <div className="space-y-2">
            <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
            <div className="w-32 h-8 bg-gray-200 rounded"></div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-1">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailSkeleton;