/**
 * Image Compression Utility
 * Compresses images client-side to reduce upload size and stay within Railway/Vercel body limits
 */

export interface CompressionOptions {
  maxSizeMB?: number;        // Maximum file size in MB (default: 0.8)
  maxWidthOrHeight?: number; // Maximum width or height in pixels (default: 1920)
  quality?: number;          // Image quality 0-1 (default: 0.85)
  fileType?: string;         // Output file type (default: original or 'image/jpeg')
}

/**
 * Get optimized compression settings based on device type
 */
export function getOptimizedCompressionSettings(): CompressionOptions {
  // Detect mobile devices
  const isMobile = typeof window !== 'undefined' && 
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Mobile: Lower settings for faster compression
    return {
      maxSizeMB: 0.6,          // 600KB target (smaller for mobile networks)
      maxWidthOrHeight: 1280,   // Lower resolution but still good quality
      quality: 0.75             // Slightly lower quality for speed
    };
  } else {
    // Desktop: Higher quality settings
    return {
      maxSizeMB: 0.8,          // 800KB target
      maxWidthOrHeight: 1920,   // Full HD quality
      quality: 0.85             // High quality
    };
  }
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compresses an image file using Canvas API
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise with compressed file and compression stats
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxSizeMB = 0.8,           // Target 800KB per image
    maxWidthOrHeight = 1920,   // Reasonable quality for web
    quality = 0.85,            // Good balance between quality and size
    fileType = file.type.includes('png') ? 'image/jpeg' : file.type // Convert PNG to JPEG for better compression
  } = options;

  const originalSize = file.size;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // If file is already small enough, return it as-is
  if (originalSize <= maxSizeBytes) {
    console.log(`✅ Image "${file.name}" already small enough (${(originalSize / 1024).toFixed(2)}KB)`);
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1
    };
  }

  try {
    // Load image
    const img = await loadImage(file);
    
    // Calculate new dimensions while maintaining aspect ratio
    let { width, height } = img;
    if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
      if (width > height) {
        height = (height / width) * maxWidthOrHeight;
        width = maxWidthOrHeight;
      } else {
        width = (width / height) * maxWidthOrHeight;
        height = maxWidthOrHeight;
      }
    }

    // Create canvas and compress
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Clear canvas and draw image with high quality (no cropping)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw the entire image scaled to fit the canvas dimensions
    ctx.drawImage(img, 0, 0, Math.round(width), Math.round(height));

    // Convert to blob with compression
    let compressedBlob = await canvasToBlob(canvas, fileType, quality);
    let currentQuality = quality;

    // If still too large, reduce quality iteratively
    while (compressedBlob.size > maxSizeBytes && currentQuality > 0.1) {
      currentQuality -= 0.1;
      compressedBlob = await canvasToBlob(canvas, fileType, currentQuality);
    }

    // Create new file from blob
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.\w+$/, fileType === 'image/jpeg' ? '.jpg' : '.webp'),
      { type: fileType, lastModified: Date.now() }
    );

    const compressedSize = compressedFile.size;
    const compressionRatio = compressedSize / originalSize;

    console.log(`🗜️ Compressed "${file.name}": ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB (${(compressionRatio * 100).toFixed(1)}%)`);

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      compressionRatio
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original file if compression fails
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1
    };
  }
}

/**
 * Compress multiple images in parallel (optimized for mobile performances
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @param onProgress - Optional callback for progress updates
 * @returns Promise with array of compressed files
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<CompressionResult[]> {
  let completed = 0;
  const total = files.length;
  
  console.log(`🗜️ Starting parallel compression of ${total} images...`);
  
  // Compress all images in parallel using Promise.all
  // This is 2-3x faster on mobile compared to sequential processing
  const compressionPromises = files.map(async (file) => {
    const result = await compressImage(file, options);
    completed++;
    
    // Report progress after each image completes
    if (onProgress) {
      onProgress(completed, total);
    }
    
    return result;
  });

  // Wait for all compressions to complete
  const results = await Promise.all(compressionPromises);

  // Log summary
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const compressionRatio = ((totalCompressed / totalOriginal) * 100).toFixed(1);
  
  console.log(`📊 Parallel compression complete: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalCompressed / 1024 / 1024).toFixed(2)}MB (${compressionRatio}% of original)`);

  return results;
}

/**
 * Load image from filee
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
