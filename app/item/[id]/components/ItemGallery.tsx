'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemImage } from '../types';
import { ITEM_DETAIL_CONFIG, CAROUSEL_CONFIG } from '../constants';

interface ItemGalleryProps {
  images: string[];
  title: string;
  isFeatured?: boolean;
  onImageClick?: (index: number) => void;
  className?: string;
}

export default function ItemGallery({ 
  images = [], 
  title, 
  isFeatured,
  onImageClick,
  className = ''
}: ItemGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Filter out empty/invalid images
  const validImages = images.filter(img => img && img.trim() !== '' && !img.includes('undefined'));
  const hasImages = validImages.length > 0;
  const hasMultipleImages = validImages.length > 1;

  // Default placeholder image
  const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

  const currentImage = hasImages ? validImages[currentIndex] : placeholderImage;

  // Navigation functions
  const goToNext = () => {
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const goToPrevious = () => {
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < validImages.length) {
      setCurrentIndex(index);
    }
  };

  // Touch gesture handlers
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !hasMultipleImages) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  const handleImageClick = () => {
    if (onImageClick && hasImages) {
      onImageClick(currentIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultipleImages) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(validImages.length - 1);
        break;
    }
  };

  return (
    <div 
      className={`relative aspect-square bg-gray-100 overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="img"
      aria-label={`${title} - Image ${currentIndex + 1} of ${validImages.length}`}
    >
      {/* Main Image */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ITEM_DETAIL_CONFIG.ANIMATION_DURATION }}
        className="relative w-full h-full cursor-pointer"
        onClick={handleImageClick}
      >
        <Image
          src={currentImage}
          alt={`${title} - Photo ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          loading={currentIndex === 0 ? 'eager' : 'lazy'}
          sizes={ITEM_DETAIL_CONFIG.IMAGE_SIZES}
          quality={ITEM_DETAIL_CONFIG.IMAGE_QUALITY}
          onError={(e) => {
            // Silently handle image load failures
          }}
        />
      </motion.div>
      
      {/* Featured Badge */}
      {isFeatured && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-10"
        >
          ⭐ Featured
        </motion.div>
      )}
      
      {/* Navigation Arrows */}
      {hasMultipleImages && (
        <AnimatePresence>
          <motion.button
            key="prev-arrow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </motion.button>
          
          <motion.button
            key="next-arrow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </motion.button>
        </AnimatePresence>
      )}
      
      {/* Image Indicators */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {validImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm backdrop-blur-sm z-10">
          {currentIndex + 1} / {validImages.length}
        </div>
      )}

      {/* Loading State */}
      {!hasImages && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-6xl mb-2">📷</div>
            <div className="text-sm">No images available</div>
          </div>
        </div>
      )}
    </div>
  );
}
