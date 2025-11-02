'use client';

import React from 'react';

// Individual marketplace item skeleton that matches the actual product card layout
export function MarketplaceItemSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Image */}
      <div className="aspect-square bg-gray-200 relative">
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
        <div className="absolute bottom-2 left-2">
          <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
        
        {/* Price */}
        <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
        
        {/* Footer - Seller and Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-16 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Marketplace grid skeleton
export function MarketplaceGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MarketplaceItemSkeleton key={i} />
      ))}
    </div>
  );
}

// Full marketplace page skeleton with header, search, and grid
export function MarketplacePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-100 p-4 animate-pulse">
        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 animate-pulse">
        <div className="flex space-x-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-20 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Results counter */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 animate-pulse">
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <MarketplaceGridSkeleton count={12} />
      </div>
    </div>
  );
}

export default MarketplacePageSkeleton;