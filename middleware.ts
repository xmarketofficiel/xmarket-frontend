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
 * 1. Redirecting flows retired from the community marketplace
 * 2. Security headers
 * 3. Static asset optimization
 * 4. Future: Can add rate limiting, logging, etc.
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

// Retain legacy source files, but retire these flows from the community marketplace.
const RETIRED_SIGNUP_ROUTES = [
  '/signup/external',
  '/join-request',
  '/auth/register',
  '/signup/um6p-student',
  '/signup/1337-student',
  '/auth/discord/callback',
];

const RETIRED_MARKETPLACE_ROUTES = [
  '/messages',
  '/users',
  '/services',
  '/marketplace/services',
  '/add-service',
];

// Matches the route itself and anything beneath it, like a `:path*` matcher.
const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (SKIP_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
    return NextResponse.next();
  }

  // Redirect retired flows
  if (RETIRED_SIGNUP_ROUTES.some(route => matchesRoute(pathname, route))) {
    return NextResponse.redirect(new URL('/signup', request.url));
  }
  if (RETIRED_MARKETPLACE_ROUTES.some(route => matchesRoute(pathname, route))) {
    return NextResponse.redirect(new URL('/marketplace', request.url));
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
