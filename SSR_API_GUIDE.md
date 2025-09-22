# SSR API Implementation Guide

## Overview

This implementation adds Server-Side Rendering (SSR) to hide API calls from the browser's network tab. Instead of making direct calls to the backend from the client, all API requests now go through Next.js API routes that act as a proxy.

## Architecture

```
Frontend (Browser) → Next.js API Routes → Backend Server
```

### Before (Direct API Calls)
```
Browser → http://localhost:3001/api/items
```
*Visible in browser's network tab*

### After (SSR Proxy)
```
Browser → /api/proxy/items → Next.js Server → http://localhost:3001/items
```
*Only `/api/proxy/items` visible in browser's network tab*

## Files Added/Modified

### New Files
- `lib/server-api.ts` - Server-side API client for backend communication
- `lib/auth-utils.ts` - Authentication utilities for Next.js API routes
- `app/api/proxy/[...path]/route.ts` - Main proxy route handling all HTTP methods (Next.js 15 compatible)
- `app/api/health/route.ts` - Health check endpoint
- `app/test-ssr/page.tsx` - Test page to demonstrate SSR functionality
- `app/test-logout/page.tsx` - Test page for improved logout functionality

### Modified Files
- `lib/api.ts` - Updated to use proxy route instead of direct backend calls
- `.env` - Added `BACKEND_API_URL` for server-side backend communication

## Environment Variables

```bash
# Client-side (still used for development/fallback)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Server-side (used by SSR proxy)
BACKEND_API_URL=http://localhost:3001
```

## How It Works

1. **Client-side requests**: Frontend makes API calls to `/api/proxy/*`
2. **Next.js proxy**: API route receives the request and forwards it to the backend
3. **Backend communication**: Server-side client communicates with your backend
4. **Response**: Backend response is returned through the proxy to the client

## Benefits

✅ **Hidden API calls**: Backend endpoints are not visible in browser network tab
✅ **Same functionality**: All existing API calls work exactly the same
✅ **Authentication**: JWT tokens are properly forwarded from client to backend
✅ **Error handling**: Maintains the same error handling as before
✅ **File uploads**: Supports file uploads through the proxy
✅ **All HTTP methods**: GET, POST, PUT, PATCH, DELETE all supported

## Testing

1. Start your backend server:
   ```bash
   cd backend && npm run start
   ```

2. Start your frontend server:
   ```bash
   cd frontend && npm run dev
   ```

3. Visit `http://localhost:3000/test-ssr` to test the functionality

4. Open browser Developer Tools → Network tab

5. Click the test buttons and notice:
   - You see calls to `/api/proxy/*` or `/api/health`
   - You DON'T see calls to `localhost:3001`
   - This means API calls are successfully hidden!

## Production Deployment

Update your environment variables for production:

```bash
# Server-side backend URL (not exposed to client)
BACKEND_API_URL=https://your-backend-domain.com

# Client-side URL (can be same as backend for fallback, but won't be used)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

## Security Considerations

- Backend URL is only known to the server-side code
- Client-side code never sees the actual backend endpoints
- Authentication tokens are properly forwarded
- All backend security measures remain intact

## Backward Compatibility

- All existing frontend code works without changes
- Same API interface and error handling
- Same authentication flow
- Same response formats

## Troubleshooting

### Common Issues

1. **500 errors**: Check that `BACKEND_API_URL` is set correctly
2. **Authentication issues**: Ensure tokens are being passed in headers
3. **CORS errors**: Should be eliminated since calls are server-to-server
4. **Timeout errors**: Check if backend is accessible from the Next.js server
5. **JSON parsing errors**: Fixed - proxy now handles empty request bodies gracefully

### Debug Logs

The proxy logs all requests:
```
[SSR API] GET /items { queryParams: ['page', 'limit'] }
[SSR API] POST /auth/login
```

Check your Next.js server logs for these messages.

### Next.js 15 Compatibility

This implementation is fully compatible with Next.js 15 requirements:
- ✅ Uses `await params` in dynamic routes
- ✅ Handles async parameters correctly
- ✅ No deprecation warnings

If you see warnings about `params` usage, ensure you're using the updated proxy route that awaits the params object.
