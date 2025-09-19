/**
 * Server-side Configuration
 * This file contains configuration that should NEVER be exposed to the client
 */

// Backend URL - only accessible on server-side
export const BACKEND_URL = process.env.BACKEND_URL || 
                          process.env.NEXT_PUBLIC_API_BASE_URL || 
                          'http://localhost:3001';

// Validate that we're running on server-side
if (typeof window !== 'undefined') {
  throw new Error('server-config.ts should only be imported on the server-side');
}

// API Configuration for server-side requests
export const SERVER_API_CONFIG = {
  baseUrl: BACKEND_URL,
  timeout: 30000, // Longer timeout for server-to-server requests
  retries: 2,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'XMarket-Frontend/1.0',
  },
};

// Helper function to create server-side fetch options
export function createServerFetchOptions(options: RequestInit = {}): RequestInit {
  const baseHeaders: Record<string, string> = { ...SERVER_API_CONFIG.headers };
  
  // If custom headers are provided, they take precedence
  const mergedHeaders: Record<string, string> = {
    ...baseHeaders,
    ...(options.headers as Record<string, string>),
  };
  
  // Remove Content-Type if it's being explicitly unset (e.g., for FormData)
  if (options.headers && 'Content-Type' in options.headers && !(options.headers as any)['Content-Type']) {
    delete mergedHeaders['Content-Type'];
  }
  
  return {
    ...options,
    headers: mergedHeaders,
  };
}
