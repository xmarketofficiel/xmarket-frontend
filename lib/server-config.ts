/**
 * Server-side Configuration
 * This file contains configuration that should NEVER be exposed to the client
 */

// Backend URL - only accessible on server-side
export const BACKEND_URL = process.env.BACKEND_URL || 
                          process.env.NEXT_PUBLIC_API_BASE_URL || 
                          'https://xmarket-backend-production-v1.up.railway.app';

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
  return {
    ...options,
    headers: {
      ...SERVER_API_CONFIG.headers,
      ...options.headers,
    },
  };
}
