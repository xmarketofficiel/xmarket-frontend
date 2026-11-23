/**
 * Image Proxy Route
 * Proxies image requests to the backend server
 * This allows images to work from any device (not just localhost)
 */

import { NextRequest, NextResponse } from 'next/server';

// Read at runtime, not build time
const getBackendUrl = () => process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const imagePath = resolvedParams.path.join('/');
    const imageUrl = `${getBackendUrl()}/images/${imagePath}`;

    const backendUrl = getBackendUrl();
    console.log(`[Image Proxy] BACKEND_URL env: ${process.env.BACKEND_URL}`);
    console.log(`[Image Proxy] Resolved backend: ${backendUrl}`);
    console.log(`[Image Proxy] Fetching: ${imageUrl}`);

    const response = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.error(`[Image Proxy] Failed to fetch image: ${response.status}`);
      return new NextResponse(null, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[Image Proxy] Error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
