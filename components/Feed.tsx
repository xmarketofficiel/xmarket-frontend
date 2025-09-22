'use client';

import React from 'react';
import { Item } from '../types';
import ItemCard from './ItemCard';
import SkeletonCard from './SkeletonCard';
import { SkeletonGrid } from './skeletons/SkeletonComponents';

interface FeedProps {
  items: Item[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function Feed({ items, loading, onLoadMore, hasMore }: FeedProps) {
  const observerRef = React.useRef<HTMLDivElement>(null);

  // Debug: Check for duplicate IDs
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const ids = items.map(item => item.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn('Duplicate item IDs detected:', {
          totalItems: ids.length,
          uniqueItems: uniqueIds.size,
          duplicates: ids.filter((id, index) => ids.indexOf(id) !== index)
        });
      }
    }
  }, [items]);

  // Infinite scroll observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="text-gray-400 mb-4">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          We couldn't find any items matching your criteria. Try adjusting your filters or search terms.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#009F9C] text-white px-6 py-2 rounded-xl hover:bg-[#007A77] transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="">
      {/* Mobile layout - 2 column grid */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {items.map((item, index) => (
          <ItemCard 
            key={item.id} 
            item={item} 
            priority={index < 4}
            layout="mobile"
          />
        ))}
        
        {/* Loading skeletons for mobile */}
        {loading && items.length === 0 && (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={`skeleton-mobile-${index}`} layout="mobile" />
          ))
        )}
      </div>

      {/* Desktop layout - 3-4 column grid */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <ItemCard 
            key={item.id} 
            item={item} 
            priority={index < 4}
            layout="desktop"
          />
        ))}
        
        {/* Loading skeletons for desktop */}
        {loading && items.length === 0 && (
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={`skeleton-desktop-${index}`} layout="desktop" />
          ))
        )}
      </div>

      {/* Load More Button/Infinite Scroll Trigger - simplified */}
      {hasMore && !loading && items.length > 0 && (
        <div ref={observerRef} className="py-6">
          <SkeletonGrid count={4} />
        </div>
      )}

      {/* Loading more indicator - skeleton */}
      {loading && items.length > 0 && (
        <div className="py-4">
          <SkeletonGrid count={2} />
        </div>
      )}

      {/* End of results message */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">You've reached the end of the results</p>
        </div>
      )}
    </div>
  );
}