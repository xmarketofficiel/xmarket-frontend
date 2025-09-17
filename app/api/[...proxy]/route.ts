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
        body = JSON.stringify(await request.json());
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // Create headers object for server fetch options
    const customHeaders: HeadersInit = {};
    if (contentType && !(body instanceof FormData)) {
      customHeaders['Content-Type'] = contentType;
    }
    if (authHeader) {
      customHeaders['Authorization'] = authHeader;
    }
    
    const response = await fetch(
      `${BACKEND_URL}/${path}${queryString ? `?${queryString}` : ''}`,
      createServerFetchOptions({
        method,
        headers: customHeaders,
        ...(body && { body }),
      })
    );

    let data;
    const responseContentType = response.headers.get('content-type');
    
    if (responseContentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

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
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
