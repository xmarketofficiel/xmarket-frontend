// Utility functions for handling image URLs safely
import { Item } from '@/types';

/**
 * Gets the API base URL from environment variables
 */
const getApiBaseUrl = (): string => {
  // In production, use the SSR API routes
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }
  // In development, use the environment variable or fallback
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets a safe image URL from an item, with fallback to placeholder
 */
export const getItemImageUrl = (item: Item): string => {
  const fallbackImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

  // Safety check - return fallback if item is null/undefined
  if (!item) {
    console.log('DEBUG: Item is null/undefined');
    return fallbackImage;
  }

  console.log('DEBUG: Item structure:', {
    hasPhotos: !!item.photos,
    photosLength: item.photos?.length,
    hasImages: !!item.images,
    imagesLength: item.images?.length,
    firstPhoto: item.photos?.[0],
    firstImage: item.images?.[0]
  });

  // Check for photos array (new structure with Cloudinary URLs)
  if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
    const photo = item.photos[0];
    if (typeof photo === 'string' && photo.trim()) {
      const trimmedPhoto = photo.trim();
      console.log('DEBUG: Using photo URL:', trimmedPhoto);
      
      // If it's already a full URL (e.g., Cloudinary), validate and use
      if (trimmedPhoto.startsWith('http')) {
        return isValidUrl(trimmedPhoto) ? trimmedPhoto : fallbackImage;
      } else {
        // If it's a relative path, construct full URL
        const fullUrl = `${getApiBaseUrl()}${trimmedPhoto}`;
        return isValidUrl(fullUrl) ? fullUrl : fallbackImage;
      }
    }
  }

  // Check for images array (legacy structure)
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const image = item.images[0];
    if (image && image.imageUrl && typeof image.imageUrl === 'string') {
      const imageUrl = image.imageUrl.trim();
      
      console.log('DEBUG: Using image.imageUrl:', imageUrl);
      
      // Skip obviously invalid URLs
      if (!imageUrl || imageUrl.includes('undefined') || imageUrl.includes('null')) {
        console.log('DEBUG: Skipping invalid URL:', imageUrl);
        return fallbackImage;
      }

      // If it's already a full URL (e.g., Cloudinary), validate and use
      if (imageUrl.startsWith('http')) {
        const isValid = isValidUrl(imageUrl);
        console.log('DEBUG: URL validation result:', isValid);
        return isValid ? imageUrl : fallbackImage;
      } else {
        // If it's a relative path, construct full URL
        const fullUrl = `${getApiBaseUrl()}${imageUrl}`;
        const isValid = isValidUrl(fullUrl);
        console.log('DEBUG: Full URL validation result:', isValid, fullUrl);
        return isValid ? fullUrl : fallbackImage;
      }
    }
  }

  console.log('DEBUG: No valid images found, returning fallback');
  return fallbackImage;
};

/**
 * Gets all image URLs from an item
 */
export const getItemImageUrls = (item: Item): string[] => {
  const validUrls: string[] = [];

  // Check for photos array (new structure)
  if (item.photos && Array.isArray(item.photos)) {
    item.photos.forEach(photo => {
      if (typeof photo === 'string' && photo.trim()) {
        const trimmedPhoto = photo.trim();
        
        if (trimmedPhoto.startsWith('http')) {
          if (isValidUrl(trimmedPhoto)) {
            validUrls.push(trimmedPhoto);
          }
        } else {
          const fullUrl = `${getApiBaseUrl()}${trimmedPhoto}`;
          if (isValidUrl(fullUrl)) {
            validUrls.push(fullUrl);
          }
        }
      }
    });
  }

  // Check for images array (legacy structure)
  if (item.images && Array.isArray(item.images)) {
    item.images.forEach(image => {
      if (image && image.imageUrl && typeof image.imageUrl === 'string') {
        const imageUrl = image.imageUrl.trim();
        
        if (!imageUrl || imageUrl.includes('undefined') || imageUrl.includes('null')) {
          return; // Skip invalid URLs
        }

        if (imageUrl.startsWith('http')) {
          if (isValidUrl(imageUrl)) {
            validUrls.push(imageUrl);
          }
        } else {
          const fullUrl = `${getApiBaseUrl()}${imageUrl}`;
          if (isValidUrl(fullUrl)) {
            validUrls.push(fullUrl);
          }
        }
      }
    });
  }

  return validUrls;
};

/**
 * Default placeholder image data URL
 */
export const PLACEHOLDER_IMAGE = '/placeholder-image.jpg';

/**
 * Gets the appropriate image variant URL from an item image - SIMPLIFIED VERSION
 * @param image - Item image object
 * @param preferredSize - Desired size: 'thumbnail', 'small', 'medium', 'large'
 * @returns URL for the requested size or fallback
 */
export const getImageVariantUrl = (
  image: any, 
  preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!image) return PLACEHOLDER_IMAGE;

  // Try to get the imageUrl directly first (most common case)
  if (image.imageUrl && typeof image.imageUrl === 'string' && image.imageUrl.trim()) {
    const imageUrl = image.imageUrl.trim();
    if (imageUrl.startsWith('http') && isValidUrl(imageUrl)) {
      return imageUrl;
    }
  }

  // Check for variants (new structure)
  if (image.imageVariants && typeof image.imageVariants === 'object') {
    const variantUrl = image.imageVariants[preferredSize];
    if (variantUrl && typeof variantUrl === 'string' && variantUrl.trim()) {
      if (variantUrl.startsWith('http') && isValidUrl(variantUrl)) {
        return variantUrl;
      }
    }
  }

  // Fallback to other common image properties
  const fallbackUrl = image.cloudinaryUrl || image.spacesUrl || image.url;
  if (fallbackUrl && typeof fallbackUrl === 'string' && fallbackUrl.trim()) {
    if (fallbackUrl.startsWith('http') && isValidUrl(fallbackUrl)) {
      return fallbackUrl;
    }
  }

  return PLACEHOLDER_IMAGE;
};

/**
 * Gets item image URL with preferred size - SIMPLIFIED AND FIXED VERSION
 * @param item - Item object (supports both Item and ProfileItem types)
 * @param size - Desired size: string or number (currently ignoring size for compatibility)
 * @returns URL for the item's image or fallback
 */
export function getItemImageUrlWithSize(item: Item, size?: string | number): string {
  // Use the working getItemImageUrl function instead of complex logic
  return getItemImageUrl(item);
}

/**
 * Enhanced function for profile items with size support - SIMPLIFIED VERSION
 * @param item - Profile item object
 * @param preferredSize - Size preference as string
 * @returns URL for the requested size or fallback
 */
export function getProfileItemImageUrl(item: any, preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'): string {
  // Use the working getItemImageUrl function for simplicity
  return getItemImageUrl(item);
}

/**
 * Gets all image URLs from an item with preferred size
 * @param item - Item object
 * @param preferredSize - Desired size: 'thumbnail', 'small', 'medium', 'large'
 * @returns Array of URLs for the requested size
 */
export const getItemImageUrlsWithSize = (
  item: Item,
  preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'  
): string[] => {
  if (!item) return [];

  const validUrls: string[] = [];

  // Check for images array
  if (item.images && Array.isArray(item.images)) {
    item.images.forEach(image => {
      const variantUrl = getImageVariantUrl(image, preferredSize);
      if (variantUrl !== PLACEHOLDER_IMAGE) {
        validUrls.push(variantUrl);
      }
    });
  }

  return validUrls;
};


