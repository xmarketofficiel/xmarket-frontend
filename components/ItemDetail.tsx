'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Flag, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Item } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { useUser } from '../contexts/UserContext';
import ReportModal from './ReportModal';
import { api } from '../lib/apiEndpoints';

interface ItemDetailProps {
  item: Item;
}

export default function ItemDetail({ item }: ItemDetailProps) {
  const router = useRouter();
  const { user } = useUser();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToast } = useToast();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isAddingInterest, setIsAddingInterest] = useState(false);
  const isItemFavorite = isFavorite(String(item.id));
  
  // Check if this is the user's own item
  const isOwnItem = user && (
    String(user.id) === String(item.sellerId) || 
    String(user.id) === String(item.seller?.id)
  );

  // Handle both backend format (images array) and mock format (photos array)
  const photos = item.photos || 
                 item.images?.map(img => {
                   const url = img.imageUrl;
                   // Add full URL prefix if it's a relative path and not 'undefined'
                   if (url && !url.includes('undefined') && url.startsWith('/')) {
                     return `http://localhost:3001${url}`;
                   }
                   return url;
                 }).filter(Boolean) || []; // Filter out empty/falsy values
  const hasPhotos = photos.length > 0 && photos.some(photo => photo && photo.trim() !== '');

  // Reset photo index if it's out of bounds
  useEffect(() => {
    if (currentPhotoIndex >= photos.length) {
      setCurrentPhotoIndex(0);
    }
  }, [photos.length, currentPhotoIndex]);

  const handleFavoriteClick = async () => {
    try {
      if (isItemFavorite) {
        await removeFromFavorites(String(item.id));
        addToast('Removed from favorites', 'info');
      } else {
        await addToFavorites(String(item.id));
        addToast('Added to favorites', 'success');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      addToast('Failed to update favorites. Please try again.', 'error');
    }
  };

  const openWhatsApp = () => {
    if (!item.seller?.whatsappNumber) {
      addToast('Seller has no WhatsApp number available', 'error');
      return;
    }
    
    const message = encodeURIComponent(`Hi! I'm interested in your item: ${item.title} (${item.price} DH)`);
    const whatsappNumber = item.seller.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExpressInterest = async () => {
    // Prevent multiple rapid clicks
    if (isAddingInterest) {
      return;
    }

    if (!user) {
      addToast('Please log in to express interest', 'error');
      return;
    }

    if (isOwnItem) {
      addToast('You cannot express interest in your own items', 'error');
      return;
    }

    setIsAddingInterest(true);
    
    try {
      await api.items.expressInterest(String(item.id));
      addToast('Interest added! Contact the seller on WhatsApp to negotiate.', 'success', 5000);
      
      // Open WhatsApp automatically after expressing interest
      openWhatsApp();
    } catch (error: any) {
      // Check for duplicate interest error
      if (error.name === 'DuplicateInterestError' || 
          error.message?.includes('already shown interest') ||
          error.message?.includes('already expressed interest')) {
        addToast('You have already shown interest in this item. Opening WhatsApp...', 'info');
        // Still open WhatsApp for users who already expressed interest
        openWhatsApp();
      } else {
        addToast(error.message || 'Failed to express interest', 'error');
      }
    } finally {
      setIsAddingInterest(false);
    }
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const nextPhoto = () => {
    if (hasPhotos && photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (hasPhotos && photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  // Touch gesture handlers for swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && hasPhotos && photos.length > 1) {
      nextPhoto();
    }
    if (isRightSwipe && hasPhotos && photos.length > 1) {
      prevPhoto();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center space-x-2">
          {/* Favorite Button - Hidden for user's own items */}
          {!isOwnItem && (
            <button
              onClick={handleFavoriteClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={isItemFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={20}
                className={`${isItemFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors`}
              />
            </button>
          )}
          
          {/* Report Button - Hidden for user's own items */}
          {!isOwnItem && (
            <button
              onClick={handleReport}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Report listing"
            >
              <Flag size={20} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Photo Carousel */}
      <div 
        className="relative aspect-square bg-gray-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={
            hasPhotos && photos[currentPhotoIndex] && photos[currentPhotoIndex].trim() !== ''
              ? photos[currentPhotoIndex]
              : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
          }
          alt={item.title}
          fill
          className="object-cover"
          priority={currentPhotoIndex === 0}
          loading={currentPhotoIndex === 0 ? 'eager' : 'lazy'}
          sizes="100vw"
        />
        
        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-4 left-4 bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
        
        {/* Photo Navigation */}
        {hasPhotos && photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Photo Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`View photo ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Price and Title */}
        <div>
          <div className="text-2xl font-bold text-[#006666] mb-2">
            {new Intl.NumberFormat('en-US').format(typeof item.price === 'string' ? parseFloat(item.price) : item.price)} DH
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {item.title}
          </h1>
          <div className="text-sm text-gray-600">
            {typeof item.category === 'object' ? `${item.category.icon} ${item.category.name}` : item.category}
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Seller</h3>
            {!isOwnItem && !item.anonymous && (
              <button
                onClick={() => {
                  const sellerId = item.seller?.id || item.sellerId;
                  if (sellerId) {
                    window.location.href = `/user/${sellerId}`;
                  }
                }}
                className="text-sm text-[#006666] hover:text-[#005555] font-medium transition-colors"
              >
                View Profile
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#006666] rounded-full flex items-center justify-center text-white font-semibold">
              {item.anonymous ? '🕶️' : (item.seller.fullName || item.seller.name || 'U').charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {item.anonymous ? 'Anonymous Seller' : (item.seller.fullName || item.seller.name)}
                </span>
                {!item.anonymous && (item.seller.isVerified || item.seller.verified) && (
                  <CheckCircle size={16} className="text-[#006666]" />
                )}
                {item.anonymous && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    🕶️ Private
                  </span>
                )}
              </div>
              {!item.anonymous && (
                <div className="text-sm text-gray-600">
                  {item.seller.program} • {item.seller.year}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>

        {/* Posted Date */}
        <div className="text-sm text-gray-500">
          Posted {new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        {!isOwnItem ? (
          <>
            {/* Main Interest Button */}
            <button
              onClick={handleExpressInterest}
              disabled={isAddingInterest}
              className="w-full bg-[#006666] text-white py-4 px-4 rounded-xl font-semibold hover:bg-[#005555] transition-colors flex items-center justify-center space-x-2 mb-3 disabled:opacity-50"
            >
              {isAddingInterest ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding Interest...</span>
                </>
              ) : (
                <>
                  <MessageCircle size={20} />
                  <span>I Want This - Chat Now</span>
                </>
              )}
            </button>
            
            {/* Secondary Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleFavoriteClick}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isItemFavorite
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={18} className={isItemFavorite ? 'fill-current' : ''} />
                <span>{isItemFavorite ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </>
        ) : (
          <div className="w-full py-4 px-6 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-600 font-medium">This is your item</p>
            <p className="text-sm text-gray-500">You can edit or manage it from your profile</p>
          </div>
        )}
      </div>

      {/* Bottom Padding */}
      <div className="h-32"></div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        itemId={String(item.id)}
        itemTitle={item.title}
      />
    </div>
  );
}