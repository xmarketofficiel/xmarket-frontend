import { NextRequest, NextResponse } from 'next/server';

// Retain legacy source files, but retire these flows from the community marketplace.
export function middleware(request: NextRequest) {
  const signupRoute = request.nextUrl.pathname.startsWith('/signup/external') ||
    request.nextUrl.pathname.startsWith('/join-request') ||
    request.nextUrl.pathname === '/auth/register' ||
    request.nextUrl.pathname.startsWith('/signup/um6p-student') ||
    request.nextUrl.pathname.startsWith('/signup/1337-student') ||
    request.nextUrl.pathname.startsWith('/auth/discord/callback');
  const destination = new URL(signupRoute ? '/signup' : '/marketplace', request.url);
  return NextResponse.redirect(destination);
}

export const config = {
  matcher: [
    '/messages/:path*',
    '/users/:path*',
    '/signup/external/:path*',
    '/join-request/:path*',
    '/auth/register',
    '/signup/um6p-student/:path*',
    '/signup/1337-student/:path*',
    '/auth/discord/callback',
    '/services/:path*',
    '/marketplace/services/:path*',
    '/add-service/:path*',
  ],
};
