/**
 * EditItemForm Skeleton Loading Component
 * Used while the actual EditItemForm component is loading dynamically
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export default function EditItemFormSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-32 w-full" />
              </div>

              {/* Price and Quantity Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Condition Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-18" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['New', 'Like New', 'Good', 'Fair'].map((condition) => (
                    <Skeleton key={condition} className="h-10 w-full" />
                  ))}
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                <div className="text-center space-y-4">
                  <Skeleton className="h-12 w-12 mx-auto rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40 mx-auto" />
                    <Skeleton className="h-3 w-56 mx-auto" />
                  </div>
                  <Skeleton className="h-10 w-32 mx-auto" />
                </div>
              </div>

              {/* Existing Images Placeholder */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Loading Info */}
        <div className="mt-4 text-center">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}