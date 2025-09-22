/**
 * API Proxy Route for SSR
 * This route proxies all API calls to the backend server-side
 * Hides backend API calls from the browser's network tab
 */

import { NextRequest, NextResponse } from 'next/server';
import { serverApiClient, ServerApiError } from '@/lib/server-api';
import { extractAuthToken } from '@/lib/auth-utils';

// Helper function to construct backend endpoint from path segments
function constructEndpoint(pathSegments: string[]): string {
  return `/${pathSegments.join('/')}`;
}

// Helper function to extract query parameters
function extractQueryParams(request: NextRequest): Record<string, string> {
  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

// GET requests
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const endpoint = constructEndpoint(resolvedParams.path);
    const queryParams = extractQueryParams(request);
    const authToken = extractAuthToken(request);

    console.log(`[SSR API] GET ${endpoint}`, { queryParams: Object.keys(queryParams) });

    const response = await serverApiClient.get(
      endpoint,
      Object.keys(queryParams).length > 0 ? queryParams : undefined,
      authToken || undefined
    );

    return NextResponse.json(response.data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('[SSR API] GET Error:', error);
    
    if (error instanceof ServerApiError) {
      return NextResponse.json(
        { 
          message: error.message, 
          code: error.code,
          details: error.details 
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST requests
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const endpoint = constructEndpoint(resolvedParams.path);
    const authToken = extractAuthToken(request);

    // Handle different content types
    const contentType = request.headers.get('content-type');
    let body: any = undefined;

    if (contentType?.includes('application/json')) {
      // Handle empty JSON requests gracefully
      try {
        const text = await request.text();
        if (text.trim()) {
          body = JSON.parse(text);
        } else {
          body = undefined; // Empty body
        }
      } catch (error) {
        console.warn('[SSR API] Failed to parse JSON body, using undefined:', error);
        body = undefined;
      }
    } else if (contentType?.includes('multipart/form-data')) {
      // For file uploads, we need to handle FormData
      const formData = await request.formData();
      console.log(`[SSR API] POST ${endpoint} (FormData)`);
      
      const response = await serverApiClient.uploadFile(
        endpoint,
        formData,
        authToken || undefined
      );

      return NextResponse.json(response.data, { 
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    } else if (contentType?.includes('text/plain')) {
      // Handle text/plain requests (usually empty body requests like logout)
      const text = await request.text();
      body = text.trim() ? text : undefined;
    }

    console.log(`[SSR API] POST ${endpoint}`);

    const response = await serverApiClient.post(
      endpoint,
      body,
      authToken || undefined
    );

    return NextResponse.json(response.data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('[SSR API] POST Error:', error);
    
    if (error instanceof ServerApiError) {
      return NextResponse.json(
        { 
          message: error.message, 
          code: error.code,
          details: error.details 
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT requests
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const endpoint = constructEndpoint(resolvedParams.path);
    const authToken = extractAuthToken(request);
    
    // Handle empty JSON requests gracefully
    let body: any = undefined;
    try {
      const text = await request.text();
      if (text.trim()) {
        body = JSON.parse(text);
      }
    } catch (error) {
      console.warn('[SSR API] Failed to parse JSON body for PUT, using undefined:', error);
      body = undefined;
    }

    console.log(`[SSR API] PUT ${endpoint}`);

    const response = await serverApiClient.put(
      endpoint,
      body,
      authToken || undefined
    );

    return NextResponse.json(response.data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('[SSR API] PUT Error:', error);
    
    if (error instanceof ServerApiError) {
      return NextResponse.json(
        { 
          message: error.message, 
          code: error.code,
          details: error.details 
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH requests
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const endpoint = constructEndpoint(resolvedParams.path);
    const authToken = extractAuthToken(request);
    
    // Handle empty JSON requests gracefully
    let body: any = undefined;
    try {
      const text = await request.text();
      if (text.trim()) {
        body = JSON.parse(text);
      }
    } catch (error) {
      console.warn('[SSR API] Failed to parse JSON body for PATCH, using undefined:', error);
      body = undefined;
    }

    console.log(`[SSR API] PATCH ${endpoint}`);

    const response = await serverApiClient.patch(
      endpoint,
      body,
      authToken || undefined
    );

    return NextResponse.json(response.data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('[SSR API] PATCH Error:', error);
    
    if (error instanceof ServerApiError) {
      return NextResponse.json(
        { 
          message: error.message, 
          code: error.code,
          details: error.details 
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE requests
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const endpoint = constructEndpoint(resolvedParams.path);
    const authToken = extractAuthToken(request);

    console.log(`[SSR API] DELETE ${endpoint}`);

    const response = await serverApiClient.delete(
      endpoint,
      authToken || undefined
    );

    return NextResponse.json(response.data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('[SSR API] DELETE Error:', error);
    
    if (error instanceof ServerApiError) {
      return NextResponse.json(
        { 
          message: error.message, 
          code: error.code,
          details: error.details 
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
