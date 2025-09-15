/**
 * Comprehensive Skeleton Loading Components
 * Replaces all text-based loading with visual skeletons
 */

interface SkeletonProps {
  className?: string;
}

// Basic skeleton line
export function SkeletonLine({ className = "" }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
  );
}

// Skeleton circle (for avatars, icons)
export function SkeletonCircle({ className = "w-8 h-8" }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 rounded-full animate-pulse ${className}`} />
  );
}

// Skeleton rectangle with rounded corners
export function SkeletonBox({ className = "w-full h-4" }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
  );
}

// Search bar skeleton
export function SkeletonSearchBar() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
      <div className="flex items-center space-x-3">
        <SkeletonCircle className="w-5 h-5" />
        <SkeletonLine className="flex-1 h-4" />
        <SkeletonBox className="w-20 h-8" />
      </div>
    </div>
  );
}

// Category filter skeleton
export function SkeletonCategoryFilter() {
  return (
    <div className="bg-white border-b border-gray-100 p-4 animate-pulse">
      <div className="flex space-x-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="w-20 h-8 flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

// Results counter skeleton
export function SkeletonResultsCounter() {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 animate-pulse">
      <SkeletonLine className="w-32 h-4" />
    </div>
  );
}

// Header skeleton
export function SkeletonHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SkeletonCircle className="w-8 h-8" />
          <SkeletonLine className="w-32 h-6" />
        </div>
        <SkeletonCircle className="w-10 h-10" />
      </div>
    </div>
  );
}

// Profile skeleton
export function SkeletonProfile() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <SkeletonCircle className="w-20 h-20" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-48 h-6" />
          <SkeletonLine className="w-32 h-4" />
          <SkeletonLine className="w-40 h-4" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <SkeletonLine className="w-12 h-8 mx-auto mb-2" />
            <SkeletonLine className="w-16 h-4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings menu skeleton
export function SkeletonSettingsMenu() {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <SkeletonCircle className="w-8 h-8" />
            <div className="flex-1">
              <SkeletonLine className="w-32 h-4 mb-1" />
              <SkeletonLine className="w-48 h-3" />
            </div>
            <SkeletonBox className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Message list skeleton
export function SkeletonMessageList() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <SkeletonCircle className="w-12 h-12" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <SkeletonLine className="w-32 h-4" />
                <SkeletonLine className="w-16 h-3" />
              </div>
              <SkeletonLine className="w-48 h-3 mb-1" />
              <SkeletonLine className="w-32 h-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Form skeleton (for add item, settings, etc.)
export function SkeletonForm() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <SkeletonLine className="w-24 h-4 mb-2" />
          <SkeletonBox className="w-full h-10" />
        </div>
      ))}
      <SkeletonBox className="w-32 h-10" />
    </div>
  );
}

// Grid skeleton for various layouts
export function SkeletonGrid({ 
  count = 6, 
  mobile = false 
}: { 
  count?: number; 
  mobile?: boolean; 
}) {
  return (
    <div className={`animate-pulse ${
      mobile 
        ? 'space-y-4' 
        : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
    }`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <SkeletonBox className="w-full aspect-square" />
          <div className="p-4 space-y-3">
            <SkeletonLine className="w-3/4 h-4" />
            <SkeletonLine className="w-1/2 h-5" />
            <div className="flex items-center justify-between">
              <SkeletonLine className="w-1/3 h-3" />
              <SkeletonLine className="w-1/4 h-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading page skeleton (full page)
export function SkeletonPage() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header */}
      <SkeletonHeader />
      
      {/* Content */}
      <div className="p-4 space-y-6">
        <SkeletonLine className="w-48 h-8" />
        <SkeletonGrid count={8} />
      </div>
    </div>
  );
}

// Empty state skeleton (when no data)
export function SkeletonEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-pulse">
      <SkeletonCircle className="w-20 h-20 mb-6" />
      <SkeletonLine className="w-48 h-6 mb-4" />
      <SkeletonLine className="w-64 h-4 mb-6" />
      <SkeletonBox className="w-32 h-10" />
    </div>
  );
}