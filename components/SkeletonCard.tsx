interface SkeletonCardProps {
  layout?: 'mobile' | 'desktop';
}

export default function SkeletonCard({ layout = 'desktop' }: SkeletonCardProps) {
  if (layout === 'mobile') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
        <div className="flex">
          {/* Mobile: horizontal image */}
          <div className="w-28 h-28 bg-gray-200 flex-shrink-0"></div>
          
          {/* Mobile: content section */}
          <div className="flex-1 p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      {/* Desktop: vertical image with overlays */}
      <div className="relative aspect-square bg-gray-200">
        {/* Category badge skeleton */}
        <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300 rounded-lg"></div>
        {/* Favorite button skeleton */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full"></div>
        {/* Price badge skeleton */}
        <div className="absolute bottom-3 left-3 w-16 h-6 bg-gray-300 rounded-lg"></div>
      </div>
      
      {/* Desktop: content section with enhanced layout */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Condition row skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-5 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        
        {/* Seller info skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
        
        {/* Location skeleton */}
        <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}