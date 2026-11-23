import { MarketplaceItemSkeleton } from '../../../components/skeletons/MarketplacePageSkeleton';
import type { LoadMoreButtonProps } from '../types';

/**
 * Load More Button Component
 * Shows skeleton grid when loading more items
 */
export function LoadMoreButton({
  hasMore,
  loading,
  onClick,
  itemsShown,
  totalItems
}: LoadMoreButtonProps) {
  // Show nothing if no more items and not loading
  if (!hasMore && !loading) return null;

  // Show skeleton grid when loading more items
  if (loading && hasMore) {
    return (
      <div className="pt-3">
        {/* Mobile: 2 column grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <MarketplaceItemSkeleton key={`mobile-skeleton-${i}`} />
          ))}
        </div>
        {/* Desktop: 3-4 column grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <MarketplaceItemSkeleton key={`desktop-skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  // Show nothing when hasMore but not loading (infinite scroll will trigger)
  return null;
}
