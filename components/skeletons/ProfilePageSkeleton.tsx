'use client';

import React from 'react';

// Profile header skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="w-48 h-6 bg-gray-200 rounded"></div>
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
          <div className="w-40 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
            <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile tabs skeleton
export function ProfileTabsSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200 animate-pulse">
      <div className="flex space-x-6 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="py-4">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile item grid skeleton
export function ProfileItemGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-3 space-y-2">
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
            <div className="flex justify-between">
              <div className="w-1/3 h-3 bg-gray-200 rounded"></div>
              <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Settings list skeleton
export function ProfileSettingsSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
              <div className="w-48 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Full profile page skeleton
export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <ProfileHeaderSkeleton />
        
        {/* Tabs */}
        <ProfileTabsSkeleton />
        
        {/* Content */}
        <ProfileItemGridSkeleton count={8} />
      </div>
    </div>
  );
}

export default ProfilePageSkeleton;