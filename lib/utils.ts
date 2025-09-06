import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Common utility functions consolidated from across the app
 */

// Date utilities
export const dateUtils = {
  /**
   * Format date consistently across the app
   */
  formatDate: (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format time consistently (avoiding hydration issues)
   */
  formatTime: (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  getRelativeTime: (date: Date | string): string => {
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return dateUtils.formatDate(target);
  },

  /**
   * Check if date is today
   */
  isToday: (date: Date | string): boolean => {
    const today = new Date();
    const target = new Date(date);
    return today.toDateString() === target.toDateString();
  }
};

// String utilities
export const stringUtils = {
  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, length: number): string => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
  },

  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convert to title case
   */
  toTitleCase: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Generate slug from string
   */
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Extract initials from name
   */
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
};

// Number utilities
export const numberUtils = {
  /**
   * Format price consistently
   */
  formatPrice: (price: number | string, currency: string = 'MAD'): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `${num.toLocaleString()} ${currency}`;
  },

  /**
   * Format large numbers with K, M suffixes
   */
  formatLargeNumber: (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },

  /**
   * Generate random number in range
   */
  randomBetween: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Clamp number between min and max
   */
  clamp: (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
  }
};

// Array utilities
export const arrayUtils = {
  /**
   * Remove duplicates from array
   */
  unique: <T>(arr: T[]): T[] => {
    return Array.from(new Set(arr));
  },

  /**
   * Group array by key
   */
  groupBy: <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
    return arr.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Shuffle array
   */
  shuffle: <T>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Chunk array into smaller arrays
   */
  chunk: <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
};

// File utilities
export const fileUtils = {
  /**
   * Format file size
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  /**
   * Get file extension
   */
  getFileExtension: (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  /**
   * Check if file is image
   */
  isImage: (file: File | string): boolean => {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const extension = typeof file === 'string' 
      ? fileUtils.getFileExtension(file) 
      : fileUtils.getFileExtension(file.name);
    return imageTypes.includes(extension.toLowerCase());
  },

  /**
   * Create object URL safely
   */
  createObjectURL: (file: File): string => {
    return URL.createObjectURL(file);
  },

  /**
   * Revoke object URL safely
   */
  revokeObjectURL: (url: string): void => {
    URL.revokeObjectURL(url);
  }
};

// Error utilities
export const errorUtils = {
  /**
   * Extract error message from various error types
   */
  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message);
    }
    return 'An unknown error occurred';
  },

  /**
   * Check if error is network related
   */
  isNetworkError: (error: unknown): boolean => {
    const message = errorUtils.getErrorMessage(error).toLowerCase();
    return message.includes('network') || 
           message.includes('fetch') || 
           message.includes('connection') ||
           message.includes('timeout');
  }
};

// Debug utilities (development only)
export const debugUtils = {
  /**
   * Log performance timing
   */
  logPerformance: (label: string, fn: () => void): void => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
  },

  /**
   * Deep log object
   */
  deepLog: (label: string, obj: any): void => {
    if (process.env.NODE_ENV !== 'development') return;
    console.group(`[Debug] ${label}`);
    console.log(JSON.parse(JSON.stringify(obj)));
    console.groupEnd();
  }
};
