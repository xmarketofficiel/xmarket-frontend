/**
 * Utility functions for safe image handling
 */

/**
 * Validates and returns a safe image URL
 * @param url - The image URL to validate
 * @returns A safe URL or null if invalid (prevents React console errors)
 */
export function getSafeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string' || url === 'undefined' || url === 'null' || url.trim() === '') {
    return null;
  }
  
  try {
    // Basic URL validation
    new URL(url);
    return url;
  } catch {
    // If it's not a valid URL, return null instead of empty string
    return null;
  }
}

/**
 * Safe image component props for handling undefined URLs
 */
export interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallback?: React.ReactNode;
}

/**
 * Safe image component that handles undefined/invalid URLs gracefully
 */
export function SafeImage({ src, fallback, onError, ...props }: SafeImageProps) {
  const safeUrl = getSafeImageUrl(src);
  
  if (!safeUrl) {
    return fallback as React.ReactElement || null;
  }

  return (
    <img 
      {...props}
      src={safeUrl}
      onError={(e) => {
        // Hide the broken image and show fallback
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        if (onError) {
          onError(e);
        }
      }}
    />
  );
}

/**
 * Checks if an image URL is valid and accessible
 * @param url - The image URL to check
 * @returns Promise<boolean> - True if image is valid and accessible
 */
export function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const safeUrl = getSafeImageUrl(url);
    if (!safeUrl) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = safeUrl;
  });
}
