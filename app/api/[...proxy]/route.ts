import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL, createServerFetchOptions } from '../../../lib/server-config';

// Generic proxy for all backend routes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  return handleRequest(request, proxy, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  return handleRequest(request, proxy, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  return handleRequest(request, proxy, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  return handleRequest(request, proxy, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  return handleRequest(request, proxy, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  proxyPath: string[],
  method: string
) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const path = proxyPath.join('/');
    
    const authHeader = request.headers.get('authorization');
    const contentType = request.headers.get('content-type');
    
    let body;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (contentType?.includes('application/json')) {
        try {
          const jsonData = await request.json();
          body = JSON.stringify(jsonData);
        } catch (error) {
          // Handle empty JSON body (e.g., for favorite/unfavorite requests)
          console.log(`[Proxy] Empty JSON body for ${method} ${path}`);
          body = undefined;
        }
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // Create headers object for server fetch options
    const customHeaders: HeadersInit = {};
    // Don't set Content-Type for FormData (fetch will set it with proper boundary)
    // Don't set Content-Type if there's no body
    if (contentType && !(body instanceof FormData) && body !== undefined) {
      customHeaders['Content-Type'] = contentType;
    }
    if (authHeader) {
      customHeaders['Authorization'] = authHeader;
    }
    
    const fullUrl = `${BACKEND_URL}/${path}${queryString ? `?${queryString}` : ''}`;
    console.log(`[Proxy] ${method} ${fullUrl}`, { 
      authHeader: !!authHeader, 
      contentType,
      hasBody: !!body,
      bodyType: body instanceof FormData ? 'FormData' : typeof body
    });
    
    let fetchOptions: RequestInit;
    
    if (body instanceof FormData) {
      // For FormData, don't use createServerFetchOptions to avoid Content-Type conflicts
      fetchOptions = {
        method,
        headers: {
          // Only include non-Content-Type headers for FormData
          'User-Agent': 'XMarket-Frontend/1.0',
          ...(authHeader && { 'Authorization': authHeader }),
        },
        body,
      };
    } else {
      // For other requests, use the standard server fetch options
      fetchOptions = createServerFetchOptions({
        method,
        headers: customHeaders,
      });
      
      // Only add body if it exists
      if (body !== undefined) {
        fetchOptions.body = body;
      }
    }
    
    const response = await fetch(fullUrl, fetchOptions);

    let data;
    const responseContentType = response.headers.get('content-type');
    
    try {
      if (responseContentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (parseError) {
      console.error('[Proxy] Failed to parse response:', parseError);
      data = { error: 'Failed to parse backend response' };
    }

    console.log(`[Proxy] Response: ${response.status}`, data);

    return new NextResponse(
      typeof data === 'string' ? data : JSON.stringify(data),
      {
        status: response.status,
        headers: {
          'Content-Type': responseContentType || 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('[Proxy] Error:', error);
    
    // If it's a fetch error, it might be a connection issue
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Backend service unavailable' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
