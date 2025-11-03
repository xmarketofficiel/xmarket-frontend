/**
 * Safe URL utilities for handling potentially malformed image URLs
 */

/**
 * Sanitizes and validates a URL, handling common malformation issues
 */
export function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Trim whitespace
  url = url.trim();
  
  if (!url) {
    return null;
  }

  // Handle double protocol issue (https://https://...)
  if (url.match(/^https?:\/\/https?:\/\//)) {
    // Extract the part after the double protocol
    url = url.replace(/^https?:\/\//, '');
  }

  // Ensure URL starts with protocol
  if (!url.match(/^https?:\/\//)) {
    // If it looks like it should be HTTPS, add it
    if (url.includes('digitaloceanspaces.com') || url.includes('cloudinary.com')) {
      url = 'https://' + url;
    }
  }

  // Validate the final URL
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.warn('Invalid URL detected and filtered:', url);
    return null;
  }
}

/**
 * Gets a safe image URL with proper error handling
 */
export function getSafeImageUrl(url: string | null | undefined, fallback: string): string {
  const sanitized = sanitizeImageUrl(url);
  return sanitized || fallback;
}

/**
 * Default placeholder for broken/missing images
 */
export const DEFAULT_IMAGE_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";