import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for routing and security headers
 * 
 * Note: Since auth tokens are stored in localStorage (client-side only),
 * we cannot check authentication state in middleware. Auth redirects
 * are handled client-side in AppShell component.
 * 
 * This middleware handles:
 * 1. Security headers
 * 2. Static asset optimization
 * 3. Future: Can add rate limiting, logging, etc.
 * 
 * To enable server-side auth checking:
 * - Backend would need to set HTTP-only cookies alongside localStorage tokens
 * - Then middleware can read the cookie and make auth decisions
 */

// Static assets and API routes to skip
const SKIP_PATTERNS = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/icon',
  '/manifest',
  '/sw.js',
  '/workbox',
  '/images',
  '/fonts',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static assets and API routes
  if (SKIP_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
    return NextResponse.next();
  }
  
  // Create response
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
