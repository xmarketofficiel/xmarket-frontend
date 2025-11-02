/**
 * Authentication utilities for Next.js API routes
 * Handles token extraction from various sources
 */

import { NextRequest } from 'next/server';

export function extractAuthToken(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try to get token from cookies (if using cookie-based auth)
  const tokenFromCookie = request.cookies.get('access_token')?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  // Try to get token from x-auth-token header (alternative)
  const tokenFromHeader = request.headers.get('x-auth-token');
  if (tokenFromHeader) {
    return tokenFromHeader;
  }

  return null;
}

export function createAuthHeaders(token: string | null): Record<string, string> {
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`
  };
}
