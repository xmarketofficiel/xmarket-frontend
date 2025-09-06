// Utility functions for handling image URLs safely
import { Item } from '../types';

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

  // Check for photos array (new structure with Cloudinary URLs)
  if (item.photos && Array.isArray(item.photos) && item.photos.length > 0) {
    const photo = item.photos[0];
    if (typeof photo === 'string' && photo.trim()) {
      const trimmedPhoto = photo.trim();
      
      // If it's already a full URL (e.g., Cloudinary), validate and use
      if (trimmedPhoto.startsWith('http')) {
        return isValidUrl(trimmedPhoto) ? trimmedPhoto : fallbackImage;
      } else {
        // If it's a relative path, construct full URL
        const fullUrl = `http://localhost:3001${trimmedPhoto}`;
        return isValidUrl(fullUrl) ? fullUrl : fallbackImage;
      }
    }
  }

  // Check for images array (legacy structure)
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const image = item.images[0];
    if (image && image.imageUrl && typeof image.imageUrl === 'string') {
      const imageUrl = image.imageUrl.trim();
      
      // Skip obviously invalid URLs
      if (!imageUrl || imageUrl.includes('undefined') || imageUrl.includes('null')) {
        return fallbackImage;
      }

      // If it's already a full URL (e.g., Cloudinary), validate and use
      if (imageUrl.startsWith('http')) {
        return isValidUrl(imageUrl) ? imageUrl : fallbackImage;
      } else {
        // If it's a relative path, construct full URL
        const fullUrl = `http://localhost:3001${imageUrl}`;
        return isValidUrl(fullUrl) ? fullUrl : fallbackImage;
      }
    }
  }

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
          const fullUrl = `http://localhost:3001${trimmedPhoto}`;
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
          const fullUrl = `http://localhost:3001${imageUrl}`;
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
export const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
